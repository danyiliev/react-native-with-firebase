import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  Share,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TabView, SceneMap } from 'react-native-tab-view';
import firebase from 'firebase';
import { get } from 'lodash';

import {
  BaseScreenWrapper,
  NavBar,
  ProfileHeader,
  TabBar,
  FeedList,
  useActionSheet,
  BlockedState,
  ReportModal,
  BlockedByUserState,
} from '@components';
import { Metrics, Colors } from '@constants';
import { getRouteParams, mergePosts, blockUser, unblockUser } from '@utils';
import { fetchUserWishlist, fetchUserPosts } from '@api';
import { fetchProfile, changeProfile } from '@actions';
import { selectUserProfile } from '@selectors';

const PAGE_SIZE = 8;

const styles = {
  wrapper: {
    flex: 1,
  },
};

const routes = [
  { key: 'posts', title: 'Posts' },
  { key: 'wishlist', title: 'Wishlist' },
];

export const PostList = ({ type = 'posts' }) => {
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  const dispatch = useDispatch();
  const [postState, setPostState] = useState({ loading: false, posts: [], allFetched: false });
  const currentUserId = get(firebase.auth(), 'currentUser.uid');
  const [userId, setUserId] = useState(null);
  const [refreshing, updateRefreshState] = useState(false);
  const [error, setError] = useState();
  const profile = useSelector(selectUserProfile(userId));
  useEffect(() => {
    if (!profile.blocked) {
      fetchPosts();
    }
  }, [userId, profile.blocked]);
  useFocusEffect(() => {
    const params = getRouteParams(navState) || {};
    const { userId: uid = currentUserId } = params;
    setUserId(uid);
  });
  const isOwner = userId === currentUserId;
  const fetchFunction = type === 'posts' ? fetchUserPosts : fetchUserWishlist;
  const updateProfile = async () => {
    updateRefreshState(true);
    try {
      await dispatch(fetchProfile(userId));
    } finally {
      updateRefreshState(false);
    }
  };
  const fetchPosts = async () => {
    if (!postState.allFetched && !postState.loading && userId) {
      try {
        setPostState({ ...postState, loading: true });
        const page = Math.max(Math.ceil(postState.posts.length / PAGE_SIZE), 0);
        const results = await fetchFunction(userId, page + 1, isOwner, PAGE_SIZE);
        if (results.data.length > 0) {
          const mergedPosts = mergePosts(postState.posts, results.data);
          setPostState({ ...postState, posts: mergedPosts, loading: false, allFetched: results.data.length < PAGE_SIZE });
        } else {
          setPostState({ ...postState, loading: false, allFetched: true });
        }
      } catch (err) {
        setPostState({ ...postState, loading: false });
        setError(err);
      }
    }
  };
  return (
    <FeedList
      ListHeaderComponent={<ProfileHeader profileId={userId} profile={profile} isOwner={isOwner} />}
      data={postState.posts}
      type={type}
      onEndReached={fetchPosts}
      loading={postState.loading}
      onRefresh={updateProfile}
      refreshing={refreshing}
      keyPrefix={type}
    />
  );
};

const UserPostList = () => <PostList type="posts" />;
const UserWishlist = () => <PostList type="wishlist" />;

const ProfileState = ({ profile, profileId, state = 'blocked' }) => {
  const [refreshing, updateRefreshState] = useState(false);
  const dispatch = useDispatch();
  const updateProfile = async () => {
    updateRefreshState(true);
    try {
      await dispatch(fetchProfile(profileId));
    } finally {
      updateRefreshState(false);
    }
  };
  return (
    <ScrollView
      style={{ paddingTop: Metrics.Big }}
      onRefresh={updateProfile}
      refreshing={refreshing}
    >
      <ProfileHeader profileId={profileId} profile={profile} isOwner={false} />
      {state === 'blocked' ? (
        <BlockedState />
      ) : (
        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 250 }}>
          <ActivityIndicator size="large" color={Colors.purple} />
        </View>
      )}
    </ScrollView>
  );
};

export default () => {
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const actionSheet = useActionSheet();
  const [showReport, setShowReport] = useState(false);
  const currentUserId = get(firebase.auth(), 'currentUser.uid');
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    loadUserProfile();
  }, [userId]);
  useFocusEffect(() => {
    const params = getRouteParams(navState) || {};
    const { userId: uid = currentUserId } = params;
    setUserId(uid);
  });
  const loadUserProfile = async () => {
    if (userId !== currentUserId && currentUserId) {
      dispatch(fetchProfile(currentUserId));
    }
    try {
      setLoading(true);
      await dispatch(fetchProfile(userId));
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  const profile = useSelector(selectUserProfile(userId));
  const isOwner = userId === currentUserId;
  const handleRight = () => {
    if (isOwner) {
      navigation.navigate('Settings');
    } else {
      if (currentUserId) {
        actionSheet.show(['Share', 'Report', profile.blocked ? 'Unblock' : 'Block'], handleActionSheet);
      } else {
        actionSheet.show(['Share', 'Report'], handleActionSheet);
      }
    }
  };
  const handleActionSheet = async (idx) => {
    try {
      switch (idx) {
        case 0:
          Share.share(
            {
              message: Platform.OS === 'android' ? `https://shopcam.tv/user/${profile.username}` : `Check @${profile.username}'s profile`,
              title: `${profile.username}'s profile`,
              url: `https://shopcam.tv/user/${profile.username}`,
            },
          );
          return;
        case 1:
          setShowReport(true);
          return;
        case 2:
          if (profile.blocked) {
            await unblockUser(profile.blocked.id);
            dispatch(changeProfile(userId, { blocked: false }));
          } else {
            Alert.alert(
              `Block ${profile.username}?`,
              'They won\'t be able to see your profile or posts on Shopcam.',
              [
                { text: 'Cancel' },
                { text: 'Block',
                  onPress: async () => {
                    const result = await blockUser(currentUserId, userId, profile.username);
                    dispatch(changeProfile(userId, { blocked: result }));
                  },
                },
              ],
            );
          }
          return;
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  };
  const hideReportModal = () => setShowReport(false);
  const renderNavigation = () => () => {
    const { username = 'Unknown' } = profile;
    return (
      <NavBar
        left={isOwner ? undefined : 'close'}
        title={username}
        onLeft={() => { navigation.goBack(); }}
        right={isOwner ? 'setting' : 'more'}
        onRight={handleRight}
        textAlign="left"
      />
    );
  };

  const renderScene = SceneMap({
    posts: UserPostList,
    wishlist: UserWishlist,
  });

  const renderTabBar = props => (
    <TabBar {...props} />
  );
  const renderContent = () => {
    if (loading) {
      return <ProfileState profile={profile} profileId={userId} state="loading" />;
    }
    if (profile.blockedByUser) {
      return <BlockedByUserState />;
    }
    if (profile.blocked) {
      return <ProfileState profile={profile} profileId={userId} state="blocked" />;
    }
    return (
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        tabBarPosition="bottom"
      />
    );
  };
  return (
    <BaseScreenWrapper renderNavigation={renderNavigation()} fullWidth>
      <SafeAreaView style={styles.wrapper}>
        {renderContent()}
        <ReportModal type="user" visible={showReport} onRequestClose={hideReportModal} resourceId={userId} />
      </SafeAreaView>
    </BaseScreenWrapper>
  );
};
