import React from 'react';

import { Body1Text } from '@components';
import { Fonts, Colors } from '@constants';

export default ({ color = Colors.black, children }) => (
  <Body1Text color={color} fontFamily={Fonts.primarySemiBold}>{children}</Body1Text>
)