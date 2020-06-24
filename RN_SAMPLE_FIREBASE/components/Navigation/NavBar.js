import React from 'react';
import { View, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { Colors, Metrics } from '@constants';
import { NavTitle } from '../Texts';
import NavButton from './NavButton';

const NavBar = ({ dark, left, right, title, textAlign = 'center', titleStyle = {}, onLeft, onRight, ignoreStatusBarHeight = false }) => (
  <View style={styles.wrapper(ignoreStatusBarHeight)}>
    {left && <NavButton type={left} dark={dark} onPress={onLeft} />}
    <View style={styles.center}>
      {title && <NavTitle dark={dark} style={{ textAlign, ...titleStyle }}>{title}</NavTitle>}
    </View>
    {right && <NavButton type={right} dark={dark} onPress={onRight} />}
  </View>
);

const styles = {
  wrapper: ignoreStatusBarHeight => ({
    flexDirection: 'row',
    width: '100%',
    marginTop: (ignoreStatusBarHeight ? 0 : getStatusBarHeight(false)),
    height: Platform.OS === 'ios' ? Metrics.Large : Metrics.Larger,
    alignItems: 'center',
    paddingHorizontal: Metrics.Normal,
    backgroundColor: Colors.transparent,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: Colors.purple,
  }),

  center: {
    flex: 1,
    paddingHorizontal: Metrics.Normal,
  },
};

NavBar.displayName = 'NavBar';

export default NavBar;
