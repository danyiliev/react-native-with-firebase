import * as FileSystem from 'expo-file-system';

export const cacheVideo = async (videoUri, postId, type) => {
  try {
    const ext = videoUri.substring(videoUri.lastIndexOf('.') + 1);
    const cacheFileName = `${postId}_${type}.${ext}`;
    const info = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + cacheFileName);
    if (info.exists) {
      return FileSystem.cacheDirectory + cacheFileName;
    }
    await FileSystem.downloadAsync(videoUri, FileSystem.cacheDirectory + cacheFileName);
    return FileSystem.cacheDirectory + cacheFileName;
  } catch (err) {
    return false;
  }
};

export const cacheAvatar = async (avatarUri, userId) => {
  try {
    const cacheImageName = `avatar_${userId}.jpg`;
    await FileSystem.downloadAsync(avatarUri, FileSystem.cacheDirectory + cacheImageName);
    return FileSystem.cacheDirectory + cacheImageName;
  } catch (err) {
    return false;
  }
};
