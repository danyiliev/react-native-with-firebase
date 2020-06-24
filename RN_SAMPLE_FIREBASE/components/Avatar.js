import React, { useState, useEffect } from 'react';
import { View, Image, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import * as FileSystem from 'expo-file-system';

import { Colors, Metrics } from '@constants';

export const Avatar = ({ size = Metrics.Larger, onPress = () => {}, userId, uri, source }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const avatarUri = `https://cdn.shopcam.co/avatars/${userId}.jpg`;
  const [avatarSource, setAvatarSource] = useState(null);
  useEffect(() => {
    setLoading(false);
    setError(false);
    getUserAvatar();
    setAvatarSource(source || (uri ? { uri } : { uri: avatarUri, cache: 'reload' }));
  }, [userId, uri, source]);
  const getUserAvatar = async () => {
    try {
      const currentUserId = firebase.auth().currentUser && firebase.auth().currentUser.uid;
      if (currentUserId === userId) {
        const cacheImageName = `avatar_${userId}.jpg`;
        const info = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + cacheImageName);
        if (info.exists) {
          setAvatarSource({ uri: FileSystem.cacheDirectory + cacheImageName });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          backgroundColor: Colors.lightGray,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: Colors.lightGray,
          borderStyle: 'solid',
        }}
      >
        {((uri || source || userId) && !error) ? (
          <Image
            source={avatarSource}
            style={{ width: size, height: size }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setError(true)}
          />
        ) : (
          <Ionicons name="md-person" size={size * 0.7} color={Colors.mediumLightGray} />
        )}
        {loading && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: size,
              height: size,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}
          >
            <ActivityIndicator color={Colors.purple} size="small" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
