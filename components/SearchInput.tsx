import { View, Text, TextInput, Image, Alert } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { icons } from "@/constants";
import { router, usePathname } from "expo-router";

interface SearchInputProps {
  placeholder?: string;
  initialQuery?: string;
}

const SearchInput = ({ placeholder, initialQuery }: SearchInputProps) => {
  const [query, setQuery] = useState(initialQuery ?? "");

  const pathname = usePathname();

  const handlePress = () => {
    if (!query) {
      return Alert.alert("Missing query", "Please empty to search videos");
    }

    if (pathname.startsWith("/search")) {
      router.setParams({ query });
    } else {
      router.push(`/search/${query}`);
    }
  };

  return (
    <View className="flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center space-x-4 text-base mt-0.5 text-white flex-1 font-pregular">
      <TextInput
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder={placeholder ?? ""}
        placeholderTextColor="#7b7b8b"
        className="flex-1 text-white w-full text-base"
      />

      <TouchableOpacity onPress={handlePress}>
        <Image className="h-5 w-5" resizeMode="contain" source={icons.search} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
