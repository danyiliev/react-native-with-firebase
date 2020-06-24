import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

import { Body1Text } from '../Texts';

import { Colors, Metrics, Fonts } from '@constants';

export default ({ selected, label, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.wrapper}>
      <View style={[styles.dotWrapper, selected && styles.selectedWrapper]}>
        {selected && <View style={styles.dot} />}
      </View>
      <Body1Text fontFamily={Fonts.primarySemiBold} color={Colors.black}>{label}</Body1Text>
    </View>
  </TouchableWithoutFeedback>
);

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: Metrics.Normal,
  },
  dotWrapper: {
    width: Metrics.Big,
    height: Metrics.Big,
    borderRadius: Metrics.Big / 2,
    borderWidth: 3,
    borderColor: Colors.darkTransparent(0.54),
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Metrics.Small,
  },
  selectedWrapper: {
    borderColor: Colors.purple,
  },
  dot: {
    width: Metrics.Small,
    height: Metrics.Small,
    borderRadius: Metrics.Small / 2,
    backgroundColor: Colors.purple,
  },
};
