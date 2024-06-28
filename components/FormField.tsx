import { View, Text, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { icons } from "@/constants";

interface FormFieldProps {
  text: string;
  value: string;
  handleChange: (text: string) => void;
  placeholder?: string;
  otherClasses?: string;
  type?: string;
}

const FormField = ({
  text,
  value,
  handleChange,
  placeholder,
  otherClasses,
  type,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherClasses}`}>
      <Text className="text-base text-gray-100 font-pmedium">{text}</Text>

      <View className="flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center">
        <TextInput
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          className="flex-1 text-white w-full  font-psemibold text-base"
          secureTextEntry={type === "password" && !showPassword}
        />

        {type === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              className="h-6 w-6"
              resizeMode="contain"
              source={!showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
