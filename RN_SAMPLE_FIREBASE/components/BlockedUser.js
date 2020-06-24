import React from 'react';
import { TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { get } from 'lodash';

import { Metrics, Fonts } from '@constants';

import { Avatar } from './Avatar';
import { Body2Text } from './Texts';

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
};

export default ({ info }) => {
  const navigation = useNavigation();
  const currentUserId = get(firebase.auth(), 'currentUser.uid');
  const handlePress = () => {
    if (info.blockedUserId === currentUserId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate({
        name: 'ExternalProfile',
        params: { userId: info.blockedUserId },
      });
    }
  };
  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
      <Avatar userId={info.blockedUserId} size={Metrics.Larger} onPress={handlePress} />
      <Body2Text
        style={styles.username}
        fontFamily={Fonts.primarySemiBold}
      >
        {info.blockedUsername}
      </Body2Text>
    </TouchableOpacity>
  );
};
