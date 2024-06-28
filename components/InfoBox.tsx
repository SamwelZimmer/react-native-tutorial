import { View, Text } from "react-native";
import React from "react";

interface InfoBoxProps {
  title: string;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
}

const InfoBox = ({
  title,
  subtitle,
  containerStyles,
  titleStyles,
}: InfoBoxProps) => {
  return (
    <View className={`${containerStyles}`}>
      <Text className={`${titleStyles} text-white text-center font-psemibold`}>
        {title}
      </Text>
      <Text className={`text-gray-100 text-center font-pregular text-sm`}>
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
