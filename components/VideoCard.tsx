import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { Post, User } from "@/lib/types";
import { icons } from "@/constants";
import { ResizeMode, Video } from "expo-av";

interface VideoCardProps {
  video: Post;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="items-center justify-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: video.creator.avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {video.title}
            </Text>

            <Text
              className="text-gray-100 text-xs font-pregular"
              numberOfLines={1}
            >
              {video.creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {isPlaying ? (
        <Video
          className="w-full h-60 rounded-xl mt-3"
          source={{ uri: video.video }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setIsPlaying(true)}
          activeOpacity={0.7}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: video.thumbnail }}
            className="w-full h-full rounded-xl mt-2"
            resizeMode="cover"
          />

          <Image
            className="absolute w-12 h-12"
            resizeMode="contain"
            source={icons.play}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
