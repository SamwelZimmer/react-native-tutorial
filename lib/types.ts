import * as DocumentPicker from "expo-document-picker";

export type Post = {
  $id: string;
  title: string;
  thumbnail: string;
  prompt: string;
  video: string;
  creator: User;
};

export type User = {
  username: string;
  email: string;
  avatar: string;
  accountId: string;
};

export type VideoFormType = {
  title: string;
  video: null | DocumentPicker.DocumentPickerAsset;
  thumbnail: null | DocumentPicker.DocumentPickerAsset;
  prompt: string;
};
