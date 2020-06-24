import React, { useState, useEffect } from 'react';
import { View, Alert, FlatList, Platform } from 'react-native';
import * as firebase from 'firebase';
import { get } from 'lodash';

import Modal from './Modal';
import { Body2Text } from './Texts';
import { PurpleTransparentButton } from './Buttons';
import Radio from './Inputs/Radio';

import { reportToAdmin } from '@utils';
import { Colors, Metrics, ReportReasons } from '@constants';


export default ({
  visible = false,
  onRequestClose,
  resourceId,
  type = 'user',
}) => {
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState(null);
  useEffect(() => {
    setReason(null);
  }, [visible]);
  const currentUserId = get(firebase.auth(), 'currentUser.uid');
  const report = async () => {
    if (reason) {
      setReporting(true);
      let reportData;
      switch (type) {
        case 'user':
          reportData = currentUserId ? {
            userId: resourceId,
            type,
            reporterUserId: currentUserId,
            reason,
          } : {
            userId: resourceId,
            type,
            reason,
          };
          break;
        case 'comment':
          reportData = currentUserId ? {
            commentId: type === resourceId,
            type,
            reporterUserId: currentUserId,
            reason,
          } : {
            commentId: type === resourceId,
            type,
            reason,
          };
          break;
        case 'post':
        default:
          reportData = currentUserId ? {
            postId: resourceId,
            type,
            reporterUserId: currentUserId,
            reason,
          } : {
            postId: resourceId,
            type,
            reason,
          };
          break;
      }
      try {
        await reportToAdmin(reportData);
      } finally {
        setReporting(false);
      }
      Alert.alert('Report submitted', 'Thanks for keeping Shopcam safe! We\'ll review your report as soon as possible.',
        [{ text: 'OK', onPress: onRequestClose }],
      );
    } else {
      Alert.alert('Please specify a reason for your report.');
    }
  };
  const selectReason = val => () => {
    setReason(val);
  };
  const keyExtractor = item => `report_reason_${item.value}`;
  const renderItem = ({ item }) => (
    <Radio selected={item.value === reason} onPress={selectReason(item.value)} label={item.label} />
  );
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.wrapper}>
        <Body2Text color={Colors.mediumGray} style={{ marginBottom: Metrics.Normal }}>Why are you reporting this?</Body2Text>
        <FlatList
          data={ReportReasons}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          extraData={reason}
        />
        <PurpleTransparentButton
          style={{ width: '100%' }}
          height={40}
          title="Submit"
          onPress={report}
          loading={reporting}
          disabled={reporting}
        />
      </View>
    </Modal>
  );
};

const styles = {
  wrapper: {
    flex: 1,
    alignItems: 'stretch',
    paddingBottom: Platform.OS === 'ios' ? Metrics.Normal : 0,
    paddingHorizontal: Metrics.Normal,
  },
  list: {
    flex: 1,
  },
};
