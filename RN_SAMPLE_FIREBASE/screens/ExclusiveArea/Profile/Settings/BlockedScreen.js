import React, { useState, useEffect } from 'react';
import { View, FlatList, Platform } from 'react-native';
import firebase from 'firebase';
import { get } from 'lodash';
import { useNavigation } from '@react-navigation/native';

import {
  BaseScreenWrapper,
  NavBar,
  BlockedUser,
  EmptyBlockedList,
} from '@components';
import { Colors } from '@constants';
import { fetchUserBlocked } from '@api';
import { mergeConnections } from '@utils';

const BlockedList = () => {
  const [blocked, setBlocked] = useState({ users: [], loading: false, allFetched: false, appending: false });
  useEffect(() => {
    fetchBlockedList();
  }, []);
  const userId = get(firebase.auth(), 'currentUser.uid');
  const fetchBlockedList = async (appending = false) => {
    if ((!blocked.loading && !blocked.allFetched) || appending) {
      setBlocked({ ...blocked, loading: !appending, appending });
      try {
        if (appending) {
          const results = await fetchUserBlocked(userId, 1);
          setBlocked({
            ...blocked,
            loading: false,
            users: mergeConnections(results.data, blocked.users),
            appending: false,
          });
        } else {
          const page = Math.max(Math.ceil(blocked.users.length / 50), 0);
          const results = await fetchUserBlocked(userId, page + 1);
          if (results.data.length > 0) {
            const mergedList = mergeConnections(blocked.users, results.data);
            setBlocked({
              ...blocked,
              users: mergedList,
              loading: false,
              allFetched: results.data.length < 50,
            });
          } else {
            setBlocked({
              ...blocked,
              loading: false,
              allFetched: true,
            });
          }
        }
      } catch (err) {
        setBlocked({ ...blocked, loading: false, appending: false });
      }
    }
  };
  const keyExtractor = item => `blocked_${item.id}`;
  const renderConnectionItem = ({ item }) => <BlockedUser info={item} />;
  return (
    <FlatList
      style={{ flex: 1 }}
      data={blocked.users}
      ListEmptyComponent={<EmptyBlockedList loading={blocked.loading} />}
      onEndReached={() => fetchBlockedList(false)}
      renderItem={renderConnectionItem}
      refreshing={blocked.appending}
      onRefresh={() => fetchBlockedList(true)}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      extraData={blocked.loading}
    />
  );
};

export default () => {
  const navigation = useNavigation();
  const onBack = () => {
    navigation.goBack();
  };
  const renderNavigation = () => (
    <NavBar
      left="close"
      onLeft={onBack}
    />
  );
  return (
    <BaseScreenWrapper renderNavigation={renderNavigation} fullWidth>
      <View style={styles.modalWrapper}>
        <View style={styles.modal}>
          <BlockedList />
        </View>
      </View>
    </BaseScreenWrapper>
  );
};

const styles = {
  modalWrapper: {
    flex: 1,
  },
  modal: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  button: {
    width: 64,
  },
};
