import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';
import firebase from 'firebase';
import { get } from 'lodash';

import {
  BaseScreenWrapper,
  NavBar,
  TabBar,
  EmptyConnections,
  Connection,
} from '@components';
import { Metrics } from '@constants';
import { getRouteParams, mergeConnections } from '@utils';
import { fetchProfile } from '@actions';
import {
  fetchUserFollowers,
  fetchUserFollowings,
} from '@api';

const styles = {
  wrapper: {
    flex: 1,
    paddingTop: Metrics.Bigger,
  },
};

const routes = [
  { key: 'followers', title: 'Followers' },
  { key: 'followings', title: 'Following' },
];

const ConnectionList = ({ type, userId }) => {
  const [connections, setConnections] = useState({
    users: [],
    loading: false,
    allFetched: false,
    appending: false,
  });
  useEffect(() => {
    fetchConnections();
  }, []);
  const fetchConnections = async (appending = false) => {
    const fetchingFunction = type === 'followers' ? fetchUserFollowers : fetchUserFollowings;
    if ((!connections.loading && !connections.allFetched) || appending) {
      setConnections({ ...connections, loading: true, appending });
      try {
        if (appending) {
          const results = await fetchingFunction(userId, 1);
          setConnections({
            ...connections,
            loading: false,
            users: mergeConnections(results.data, connections.users),
            appending: false,
          });
        } else {
          const page = Math.max(Math.ceil(connections.users.length / 50), 0);
          const results = await fetchingFunction(userId, page + 1);
          if (results.data.length > 0) {
            const mergedConns = mergeConnections(connections.users, results.data);
            setConnections({
              ...connections,
              users: mergedConns,
              loading: false,
              allFetched: results.data.length < 50,
            });
          } else {
            setConnections({ ...connections, loading: false, allFetched: true });
          }
        }
      } catch (err) {
        setConnections({ ...connections, loading: false, appending: false });
      }
    }
  };
  const keyExtractor = item => `${type}_${item.id}`;
  const renderConnectionItem = ({ item }) => (
    <Connection type={type} connection={item} uid={userId} />
  );
  return (
    <FlatList
      style={{ flex: 1 }}
      data={connections.users}
      ListEmptyComponent={
        <EmptyConnections
          loading={connections.appending ? false : connections.loading}
          type={type}
        />
      }
      onEndReached={() => fetchConnections(false)}
      renderItem={renderConnectionItem}
      onRefresh={() => fetchConnections(true)}
      refreshing={connections.appending}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
    />
  );
};

const FollowingList = () => {
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  const { userId = get(firebase.auth(), 'currentUser.uid') } = getRouteParams(navState) || {};
  return <ConnectionList type="followings" userId={userId} />;
};

const FollowerList = () => {
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  const { userId = get(firebase.auth(), 'currentUser.uid') } = getRouteParams(navState) || {};
  return <ConnectionList type="followers" userId={userId} />;
};

export default () => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  const { userId = get(firebase.auth(), 'currentUser.uid'), type } = getRouteParams(navState) || {};
  useEffect(() => {
    dispatch(fetchProfile(userId));
    navigation.addListener('focus', handleFocus);
    return () => {
      navigation.removeListener('focus', handleFocus);
    };
  }, [userId]);
  const handleFocus = () => {
    if (type === 'followers') {
      setTimeout(() => {
        setIndex(0);
      }, 200);
    } else {
      setTimeout(() => {
        setIndex(1);
      }, 200);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTabBar = props => (
    <TabBar {...props} />
  );

  const renderScene = SceneMap({
    followers: FollowerList,
    followings: FollowingList,
  });

  const renderNavigation = () => () => (
    <NavBar
      left="close"
      onLeft={handleBack}
    />
  );
  return (
    <BaseScreenWrapper renderNavigation={renderNavigation()} fullWidth>
      <SafeAreaView style={styles.wrapper}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          tabBarPosition="bottom"
        />
      </SafeAreaView>
    </BaseScreenWrapper>
  );
};
