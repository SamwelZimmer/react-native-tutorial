import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/hooks/useAppwrite";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import { Post } from "@/lib/types";
import { useGlobalContext } from "@/context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    data: posts,
    refetch: refetchPosts,
    isLoading,
  } = useAppwrite(getAllPosts);

  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const onRefresh = async () => {
    setIsRefreshing(true);

    // recall videos
    await refetchPosts();

    setIsRefreshing(false);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts as any as Post[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }: { item: Post }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-6 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {user?.username}
                  </Text>
                </View>

                <View className="mt-1.5">
                  <Image
                    className="w-9 h-10"
                    resizeMode="contain"
                    source={images.logoSmall}
                  />
                </View>
              </View>

              <SearchInput placeholder="Search video topics..." />

              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100 text-lg font-pregular mb-3">
                  Latest Videos
                </Text>

                <Trending posts={latestPosts as any as Post[]} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No videos found"
              subtitle="Be the first to upload a video"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
