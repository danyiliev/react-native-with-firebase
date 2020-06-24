import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { isEmpty, get } from 'lodash';

import { Metrics, Colors, Shadows } from '@constants';
import { fetchFollowStatus } from '@api';
import { fetchProfile, setAuthRedirect } from '@actions';
import { selectProfile } from '@selectors';
import { followUser, unfollowUser } from '@utils';

const styles = {
  container: {
    width: Metrics.Big,
    height: Metrics.Big,
    borderRadius: Metrics.Small,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.main,
  },
};

export default ({ connection, userId, style }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [following, setFollowingState] = useState({ following: false, loading: false });
  const userProfile = useSelector(selectProfile);
  const loggedIn = firebase.auth().currentUser;
  const currentUserId = get(firebase.auth(), 'currentUser.uid');

  const getFollowState = async () => {
    if (firebase.auth().currentUser) {
      try {
        setFollowingState({ ...following, loading: true });
        const result = await fetchFollowStatus(currentUserId, connection.userId);
        setFollowingState({ following: isEmpty(result.data) ? false : result.data, loading: false });
      } catch (err) {
        setFollowingState({ ...following, loading: false });
      }
    }
  };

  const handleFollow = async () => {
    if (!(loggedIn && currentUserId !== connection.userId)) {
      dispatch(setAuthRedirect('origin'));
      navigation.navigate('Onboarding');
    }
    if (following.loading === false) {
      setFollowingState({ ...following, loading: true });
      try {
        if (following.following) {
          Alert.alert(
            `Unfollow ${following.following.followingUsername}?`, '',
            [
              { text: 'Cancel', onPress: () => { setFollowingState({ ...following, loading: false }); } },
              {
                text: 'Unfollow',
                onPress: async () => {
                  await unfollowUser(following.following.id);
                  setFollowingState({ following: false, loading: false });
                },
              },
            ],
          );
        } else {
          const result = await followUser(currentUserId, userProfile.username, connection.userId, connection.username);
          setFollowingState({ following: result, loading: false });
        }
        dispatch(fetchProfile(userId));
      } catch (err) {
        setFollowingState({ ...following, loading: false });
      }
    }
  };

  useEffect(() => {
    getFollowState();
  }, [connection]);

  return (
    <TouchableOpacity onPress={handleFollow} disabled={following.loading} style={[styles.container, style]}>
      {following.loading ? (
        <ActivityIndicator size="small" color={Colors.purple} />
      ) : (
        <Feather name={following.following ? 'check' : 'plus'} size={Metrics.Normal} color={Colors.purple} />
      )}
    </TouchableOpacity>
  );
};
