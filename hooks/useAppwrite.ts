import { useState, useEffect } from "react";
import { getAllPosts } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import { Alert } from "react-native";

const useAppwrite = (fn: () => any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Models.Document[]>([]);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await fn();

      setData(res);
    } catch (err) {
      console.error(err);
      const error = err as Error;
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, refetch, isLoading };
};

export default useAppwrite;
