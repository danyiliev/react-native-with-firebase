import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Body2Text } from '@components';
import { Colors, Metrics } from '@constants';

const styles = {
  wrapper: {
    paddingHorizontal: Metrics.Normal,
    paddingVertical: Metrics.Bigger,
    borderBottomWidth: 0.3,
    borderColor: Colors.gray,
    borderStyle: 'solid',
  },
  content: {
    paddingTop: Metrics.Bigger,
  },
  subsection: {
    paddingBottom: Metrics.Bigger,
  }
}

export const SubSection = ({ onPress, last, children }) => (
  <TouchableOpacity style={last ? {} : styles.subsection} onPress={onPress} disabled={!onPress}>
    {children}
  </TouchableOpacity>
);

SubSection.displayName = 'SubSection';

const Section = ({ title, children }) => (
  <View style={styles.wrapper}>
    {title && <Body2Text color={Colors.mediumGray}>{title}</Body2Text>}
    <View style={title && styles.content}>
      {children}
    </View>
  </View>
);

Section.displayName = 'Section';

export default Section;