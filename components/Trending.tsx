import {
  Text,
  FlatList,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import React, { useState } from "react";

import { Post } from "@/lib/types";
import * as Animatable from "react-native-animatable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1 }] },
};

const zoomOut: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};

interface TrendingProps {
  posts: Post[];
}

const Trending = ({ posts }: TrendingProps) => {
  const [activeItemId, setActiveItemId] = useState(posts[0]?.$id ?? "0");

  const handleViewableItemChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Post>[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItemId(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItemId={activeItemId} item={item} />
      )}
      onViewableItemsChanged={handleViewableItemChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 0, y: 0 }}
      horizontal
    />
  );
};

const TrendingItem = ({
  activeItemId,
  item,
}: {
  activeItemId: string;
  item: Post;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  console.log(item.video);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItemId === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <Video
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          source={{ uri: item.video }}
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
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setIsPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black-40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            resizeMode="cover"
            className="w-12 h-12 absolute"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default Trending;
