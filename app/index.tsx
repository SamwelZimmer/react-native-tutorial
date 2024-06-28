import React from "react";
import { Image, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Redirect, router } from "expo-router";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "@/context/GlobalProvider";

const App = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();

  console.log("is logged in", isLoggedIn);

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full max-h-[85vh] my-auto h-full justify-center items-center px-4">
            <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            />

            <Image
              source={images.cards}
              className="max-w-[380px] w-full h-[300px]"
              resizeMode="contain"
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center">
                Discover Endless Possibilities with{" "}
                <Text className="text-secondary-200">Aora</Text>
              </Text>

              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              Where creativity meets innovation: embark on a journey of
              limitless inspiration with Aora
            </Text>

            <CustomButton
              title="Continue with Email"
              containerStyles="w-full mt-7"
              handlePress={() => router.push("/sign-in")}
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
