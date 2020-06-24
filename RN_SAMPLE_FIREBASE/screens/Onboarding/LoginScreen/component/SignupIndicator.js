import React from 'react';
import { View, TouchableWithoutFeedback, Dimensions } from 'react-native';

import { Body1Text } from '@components';
import { Colors, Fonts, Metrics } from '@constants';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default ({ onPress }) => (
  <View style={styles.wrapper}>
    <Body1Text
      color={Colors.darkGray}
      fontFamily={Fonts.primaryBold}
      fontSize={15}
      style={styles.text}
    >
      Don't have an account? 
    </Body1Text>
    <TouchableWithoutFeedback onPress={onPress}>
      <Body1Text color={Colors.purple} fontFamily={Fonts.primaryBold} fontSize={15} >
        Sign up
      </Body1Text>
    </TouchableWithoutFeedback>
  </View>
)

const styles = {
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: WINDOW_WIDTH,
    height: 80,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  text: {
    marginRight: Metrics.Smaller
  }
}
