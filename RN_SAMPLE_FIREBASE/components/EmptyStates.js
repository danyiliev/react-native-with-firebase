import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';

import { Metrics, Colors } from '@constants';

import { Body1Text } from './Texts';

const styles = {
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  icon: {
    marginBottom: Metrics.Normal,
  }
}

export const EmptyPosts = ({ loading }) => (
  <View style={styles.wrapper}>
    {loading ? (
      <ActivityIndicator size="large" color={Colors.purple} />
    ) : (
      <>
        <FontAwesome size={Metrics.Large} color={Colors.mediumGray} name="film" style={styles.icon} />
        <Body1Text color={Colors.mediumGray}>No posts yet</Body1Text>
      </>
    )}
  </View>
);

export const EmptyWishlist = ({ loading }) => (
  <View style={styles.wrapper}>
    {loading ? (
      <ActivityIndicator size="large" color={Colors.purple} />
    ) : (
      <>
        <Feather size={Metrics.Large} color={Colors.mediumGray} name="bookmark" style={styles.icon} />
        <Body1Text color={Colors.mediumGray}>Wishlist empty</Body1Text>
      </>
    )}
  </View>
);

export const EmptyConnections = ({ type, loading }) => (
  <View style={styles.wrapper}>
    {loading ? (
      <ActivityIndicator size="large" color={Colors.purple} />
    ) : (
      <>
        <Feather size={Metrics.Large} color={Colors.mediumGray} name="user" style={styles.icon} />
        <Body1Text color={Colors.mediumGray}>{type === 'followers' ? 'No followers yet' : 'Not following anyone'}</Body1Text>
      </>
    )}
  </View>
);

export const BlockedState = () => (
  <View style={styles.wrapper}>
    <Feather size={Metrics.Large} color={Colors.mediumGray} name="eye" style={styles.icon} />
    <View style={{ width: 280 }}>
      <Body1Text color={Colors.mediumGray} style={{ textAlign: 'center' }}>You blocked this user. Unblock them to see their posts.</Body1Text>
    </View>
  </View>
);

export const EmptyBlockedList = ({ loading }) => (
  <View style={styles.wrapper}>
    {loading ? (
      <ActivityIndicator size="large" color={Colors.purple} />
    ) : (
      <>
        <Feather size={Metrics.Large} color={Colors.mediumGray} name="eye" style={styles.icon} />
        <View style={{ width: 280 }}>
          <Body1Text color={Colors.mediumGray} style={{ textAlign: 'center' }}>No blocked users</Body1Text>
        </View>
      </>
    )}
  </View>
);

export const BlockedByUserState = () => (
  <View style={styles.wrapper}>
    <Feather size={Metrics.Large} color={Colors.mediumGray} name="eye" style={styles.icon} />
    <View style={{ width: 280 }}>
      <Body1Text color={Colors.mediumGray} style={{ textAlign: 'center' }}>You've been blocked from viewing this user's profile and posts.</Body1Text>
    </View>
  </View>
);
