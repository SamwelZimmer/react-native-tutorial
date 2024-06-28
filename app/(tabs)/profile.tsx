import { View, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "@/hooks/useAppwrite";
import { getUserPost, signOut } from "@/lib/appwrite";
import { Post } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const { data: posts } = useAppwrite(() => getUserPost(user?.$id as string));

  const logout = async () => {
    await signOut();

    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts as any as Post[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }: { item: Post }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb-12 px-4">
              <TouchableOpacity
                onPress={logout}
                className="w-full items-end mb-10"
              >
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>

              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="h-[90%] w-[90%] rounded-lg"
                  resizeMode="cover"
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles="mt-5"
                titleStyles="text-lg"
              />

              <View className="mt-5 flex-row">
                <InfoBox
                  title={`${posts.length}`}
                  subtitle="Posts"
                  containerStyles="mr-10"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title={"1.2K"}
                  subtitle="Followers"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No videos found"
              subtitle="No videos found for this search query"
            />
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;
