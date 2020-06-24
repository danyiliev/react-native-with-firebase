import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';

import { Metrics, Fonts } from '@constants';

import { Avatar } from './Avatar';
import { Body2Text } from './Texts';
import FollowButton from './FollowButton';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: Metrics.Small,
    paddingHorizontal: Metrics.Normal,
  },
  username: {
    marginLeft: Metrics.Normal,
  },
  avatarWrapper: {
    width: Metrics.Larger,
    position: 'relative',
  },
  followButton: {
    position: 'absolute',
    bottom: -Metrics.Smaller,
    left: (Metrics.Larger - Metrics.Big) / 2,
  },
};

export default ({ connection, userId }) => {
  const navigation = useNavigation();
  const currentUserId = firebase.auth().currentUser.uid;

  const handlePress = () => {
    if (connection.userId === currentUserId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate({
        name: 'ExternalProfile',
        params: { userId: connection.userId },
      });
    }
  };
  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
      <View style={styles.avatarWrapper}>
        <Avatar userId={connection.userId} size={Metrics.Larger} onPress={handlePress} />
        <FollowButton connection={connection} userId={userId} style={styles.followButton} />
      </View>
      <Body2Text style={styles.username} fontFamily={Fonts.primarySemiBold}>{connection.username}</Body2Text>
    </TouchableOpacity>
  );
};
