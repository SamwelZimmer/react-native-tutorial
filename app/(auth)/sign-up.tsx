import { View, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import React, { useState } from "react";

import { images } from "../../constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const user = await createUser("jonny", "example10@email.com", "qwerty23");
      // const user = await createUser(form.username, form.email, form.password)

      // add user to global context
      setUser(user);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (err) {
      console.error(err);
      const error = err as Error;
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full max-h-[85vh] my-auto h-full justify-center px-4">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[35px]"
            />
            <Text className="text-white text-2xl font-psemibold mt-10">
              Sign up to Aora
            </Text>

            <FormField
              text="Username"
              value={form.username}
              handleChange={(text) => setForm({ ...form, username: text })}
              otherClasses="mt-10"
              type="text"
              placeholder="Enter email..."
            />

            <FormField
              text="Email"
              value={form.email}
              handleChange={(text) => setForm({ ...form, email: text })}
              otherClasses="mt-7"
              type="email"
              placeholder="Enter username..."
            />

            <FormField
              text="Password"
              value={form.password}
              handleChange={(text) => setForm({ ...form, password: text })}
              otherClasses="mt-7"
              type="password"
              placeholder="Enter password..."
            />

            <CustomButton
              title="Sign Up"
              handlePress={handleSubmit}
              containerStyles="mt-7"
              isLoading={isLoading}
            />

            <View className="justify-center pt-5 flex-row items-center gap-2 text-lg">
              <Text className="text-gray-100 font-pregular">
                {"Already have an account?"}
              </Text>
              <Link className="text-secondary font-bold" href={"/sign-in"}>
                Log In
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignUp;
