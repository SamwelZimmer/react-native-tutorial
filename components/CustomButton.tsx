import { Text, Pressable } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  handlePress?: () => void;
  containerStyles?: string;
  textStyle?: string;
  isLoading?: boolean;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyle,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center active:opacity-70 ${containerStyles} ${
        isLoading && "opacity-50"
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyle}`}>
        {title}
      </Text>
    </Pressable>
  );
};

export default CustomButton;
