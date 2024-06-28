import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/hooks/useAppwrite";
import { searchPosts } from "@/lib/appwrite";
import { Post } from "@/lib/types";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch: refetchPosts } = useAppwrite(() =>
    searchPosts(query as string)
  );

  const onRefetch = async () => {
    await refetchPosts();
  };

  useEffect(() => {
    onRefetch();
  }, [query]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-primary h-full">
        <FlatList
          data={posts as any as Post[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }: { item: Post }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-6">
              <View className="justify-between items-start flex-row mb-6">
                <Text className="font-pmedium text-sm text-gray-100">
                  Search Results
                </Text>
              </View>

              <View className="mt-6 mb-8">
                <SearchInput
                  initialQuery={query as string}
                  placeholder="Search video topics..."
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

export default Search;
