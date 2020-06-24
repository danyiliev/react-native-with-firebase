import React, { useState, useEffect } from 'react';
import { View, TouchableWithoutFeedback, Linking, Alert } from 'react-native';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, get } from 'lodash';
import { useNavigation } from '@react-navigation/native';

import { Colors, Metrics, Fonts } from '@constants';
import { followUser, unfollowUser } from '@utils';
import { unblockUser, stripeDoubleLineBreak } from '@utils';
import { changeProfile, setAuthRedirect } from '@actions';
import { fetchFollowStatus } from '@api';
import { selectProfile } from '@selectors';

import { CaptionText, Body2Text } from './Texts';
import { PurpleTransparentButton, GradientButton } from './Buttons';
import { Avatar } from './Avatar';
import ReadMore from './ReadMore';

const styles = {
  wrapper: {
    paddingHorizontal: Metrics.Big,
    marginBottom: Metrics.Big,
  },
  mainPart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  figureWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Metrics.Big,
  },
  figureCount: {
    marginRight: Metrics.Tiny,
  },
  secondaryPart: {
    marginTop: Metrics.Normal,
  },
  buttonStyle: {
    width: 192,
    marginTop: Metrics.Smaller,
  },
  profileInfo: {
    marginVertical: Metrics.Smaller,
  },
  infoPart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: Metrics.Smaller,
  }
}

const Figure = ({ title, count, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
    <View style={styles.figureWrapper}>
      <Body2Text fontFamily={Fonts.primarySemiBold} style={styles.figureCount}>{count}</Body2Text>
      <CaptionText>{title}</CaptionText>
    </View>
  </TouchableWithoutFeedback>
);

export default ({ profileId, profile, isOwner }) => {
  const userId = get(firebase.auth(), 'currentUser.uid');
  const userProfile = useSelector(selectProfile);
  const navigation = useNavigation();
  const [followInfo, setFollowInfo] = useState({});
  const [following, setFollowing] = useState(false);
  const [followingDisabled, setfollowingDisabled] = useState(false);
  const [unblocking, setUnblocking] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userId !== profileId) {
      fetchFollowing()
    }
  }, [profileId]);
  const fetchFollowing = async () => {
    const result = await fetchFollowStatus(userId, profileId);
    setFollowInfo(result.data);
  };
  const onPressLink = async () => {
    try {
      const isSupported = await Linking.canOpenURL(profile.website);
      if (isSupported) {
        Linking.openURL(profile.website);
      }
    } catch {}
  }
  const follow = async () => {
    if (!followingDisabled) {
      setFollowing(true);
      setfollowingDisabled(true);
      try {
        const result = await followUser(userId, userProfile.username, profileId, profile.username);
        setFollowInfo(result);
      } finally {
        setFollowing(false);
        setfollowingDisabled(false);
      }
    }
  }
  const unfollow = async () => {
    if (!followingDisabled) {
      setFollowing(true);
      setfollowingDisabled(true);
      try {
        await unfollowUser(followInfo.id);
        setFollowInfo(false);
        setfollowingDisabled(false);

      } finally {
        setFollowing(false);
      }
    }
  }
  const unblock = async () => {
    setUnblocking(true);
    try {
      await unblockUser(profile.blocked.id);
      dispatch(changeProfile(profileId, { blocked: false }));
    } finally {
      setUnblocking(false);
    }
  }
  const login = () => {
    dispatch(setAuthRedirect('origin'));
    navigation.navigate('Onboarding');
  }
  const renderFollowingButton = () => {
    if (!userId) {
      return (
        <GradientButton
          style={styles.buttonStyle}
          height={32}
          title="Follow"
          gradient="purpleGradient"
          onPress={login}
        />
      )
    }
    if (profile.blocked) {
      return (
        <GradientButton
          style={styles.buttonStyle}
          height={32}
          title="Unblock"
          gradient="purpleGradient"
          onPress={unblock}
          loading={unblocking}
          disabled={following}
        />
      )
    }
    return isEmpty(followInfo) ? (
      <GradientButton
        style={styles.buttonStyle}
        height={32}
        title="Follow"
        gradient="purpleGradient"
        onPress={follow}
        loading={following}
        disabled={following}
      />
    ) : (
      <PurpleTransparentButton
        style={styles.buttonStyle}
        height={32}
        title="Following"
        onPress={unfollow}
        loading={following}
        disabled={following}
      />
    )
  }
  const editProfile = () => {
    navigation.navigate('EditProfile');
  }
  const toConnection = (type) => () => {
    if (!userId) {
      dispatch(setAuthRedirect({
        routeName: 'ExternalConnection',
        params: { userId: profileId, type },
      }));
      navigation.navigate('Onboarding');
    } else if (isOwner) {
      navigation.navigate('SocialConnection', { type });
    } else {
      navigation.navigate('ExternalConnection', { userId: profileId, type });
    }
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.mainPart}>
        <Avatar size={80} userId={profileId} key={profile.avatarUpdated} />
      </View>
      <View style={styles.secondaryPart}>
        <Body2Text fontFamily={Fonts.primarySemiBold} style={styles.profileInfo}>{profile.name || profile.username || 'unknown'}</Body2Text>
        {!isEmpty(profile.bio) && (
          <ReadMore style={styles.profileInfo} TextObject={Body2Text}>{stripeDoubleLineBreak(profile.bio)}</ReadMore>
        )}
        {!isEmpty(profile.website) && (
          <TouchableWithoutFeedback onPress={onPressLink}>
            <Body2Text style={styles.profileInfo} color={Colors.purple}>{profile.website}</Body2Text>
          </TouchableWithoutFeedback>
        )}
        {!profile.blocked && (
          <View style={styles.infoPart}>
            <Figure title="posts" count={profile.postCount || 0} />
            <Figure title="followers" count={profile.followerCount || 0} onPress={toConnection('followers')} />
            <Figure title="following" count={profile.followingCount || 0} onPress={toConnection('followings')}/>
          </View>
        )}
        {isOwner ? (
          <PurpleTransparentButton style={styles.buttonStyle} height={32} title="Edit profile" onPress={editProfile} />
        ) : renderFollowingButton()}
      </View>
    </View>
  )
};
