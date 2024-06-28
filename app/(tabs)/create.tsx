import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";

import FormField from "@/components/FormField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { VideoFormType } from "@/lib/types";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createVideo } from "@/lib/appwrite";

const Create = () => {
  const { user } = useGlobalContext();
  const [form, setForm] = useState<VideoFormType>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [uploading, setUploading] = useState(false);

  const openPicker = async (selectType: "video" | "image") => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const handleSubmit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      return Alert.alert("Please fill in all fields");
    }

    setUploading(true);

    try {
      // create the video
      await createVideo(form, user?.$id ?? "");

      // reset to an empty form
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      Alert.alert("Successfully uploaded");

      // go to home page
      router.push("/");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Text className="text-2xl text-white font-psemibold px-4">
            Upload video
          </Text>

          <FormField
            text="Video title"
            value={form.title}
            placeholder="Give your video a catchy title"
            handleChange={(e) => setForm({ ...form, title: e })}
            otherClasses="mt-10 px-4"
          />

          <View className="mt-7 space-y-2 px-4">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload video
            </Text>

            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl"
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              ) : (
                <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-7 space-y-2 px-4">
            <Text className="text-base text-gray-100 font-pmedium">
              Upload thumbnail
            </Text>

            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <FormField
            text="AI Prompt"
            value={form.prompt}
            placeholder="The prompt used to create this video"
            handleChange={(e) => setForm({ ...form, prompt: e })}
            otherClasses="mt-7 px-4"
          />

          <CustomButton
            title="Submit + Publish"
            handlePress={handleSubmit}
            containerStyles="mt-7 mx-4"
            isLoading={uploading}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Create;
