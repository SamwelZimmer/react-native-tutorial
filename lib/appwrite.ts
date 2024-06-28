import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";
import * as DocumentPicker from "expo-document-picker";

import { Post, VideoFormType } from "@/lib/types";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.samwel.aora",
  projectId: "667b323c002f96596ab7",
  databaseId: "667b33760007420db5d7",
  userCollectionId: "667b338c000f96eff60a",
  videoCollectionId: "667b33ab0034169639d3",
  storageId: "667b357b003d2f092ee8",
};

// init appwrite react-native sdk
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    // create new account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error();
    }

    // get avatar
    const avatarUrl = avatars.getInitials(username);

    // sign in
    await signIn(email, password);

    // add user to db
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error();

    return currentUser.documents[0];
  } catch (err) {
    console.error(err);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents as any as Post[];
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents as any as Post[];
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const searchPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents as any as Post[];
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getUserPost = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents as any as Post[];
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const getFilePreview = async (
  fileId: string,
  type: "video" | "image"
) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top" as ImageGravity,
        100
      );
    } else {
      throw new Error("Invalid File Type");
    }

    if (!fileUrl) {
      throw new Error("No file url");
    }

    return fileUrl;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const uploadFile = async (
  file: DocumentPicker.DocumentPickerAsset,
  type: "video" | "image"
) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type, mimeType, ...rest };

  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset as any
    );

    const fileUrl = await getFilePreview(uploadFile.$id, type);

    return fileUrl;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};

export const createVideo = async (formData: VideoFormType, userId: string) => {
  try {
    if (!formData.thumbnail || !formData.video) return;

    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(formData.thumbnail, "image"),
      uploadFile(formData.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: formData.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: formData.prompt,
        creator: userId,
      }
    );

    return newPost;
  } catch (err) {
    console.error(err);
    const error = err as Error;
    throw new Error(error.message);
  }
};
