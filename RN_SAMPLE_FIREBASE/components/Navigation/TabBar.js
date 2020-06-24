import React from 'react';
import { TabBar } from 'react-native-tab-view';

import { Fonts, Colors } from '@constants';

import { Body1Text } from '../Texts';

const styles = {
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.purple,
  },
  wrapper: {
    backgroundColor: Colors.white,
  },
};

const renderLabel = ({ route, color }) => (
  <Body1Text color={color} fontFamily={Fonts.primaryBold}>
    {route.title}
  </Body1Text>
);

export default props => (
  <TabBar
    {...props}
    renderLabel={renderLabel}
    indicatorStyle={styles.indicator}
    indicatorContainerStyle={styles.indicatorContainer}
    style={styles.wrapper}
    activeColor={Colors.purple}
    inactiveColor={Colors.mediumLightGray}
  />
);
