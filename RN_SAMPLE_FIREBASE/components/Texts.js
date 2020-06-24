import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import { Colors, Fonts } from '@constants';

const CustomText = props => {
  const {
    align,
    fontFamily,
    fontSize,
    lineHeight,
    color,
    weight,
    style,
    children,
    ...otherProps
  } = props;

  const textStyle = {
    fontFamily,
    fontSize,
    fontWeight: weight,
    color,
    textAlign: align,
  };
  if (lineHeight) {
    textStyle.lineHeight = lineHeight;
  }
  Object.assign(textStyle, style);
  return (
    <Text style={textStyle} {...otherProps}>
      {children}
    </Text>
  );
};

CustomText.propTypes = {
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  weight: PropTypes.string,
  align: PropTypes.string,
  style: PropTypes.any, //eslint-disable-line
  children: PropTypes.node,
};

CustomText.defaultProps = {
  fontFamily: Fonts.primary,
  fontSize: 14,
  color: Colors.black,
  weight: 'normal',
  align: 'left',
  style: {},
  children: null,
};

const H1Text = props => (
  <CustomText fontSize={96} lineHeight={131} {...props} />
);
const H2Text = props => (
  <CustomText fontSize={60} lineHeight={82} {...props} />
);
const H3Text = props => (
  <CustomText fontSize={48} lineHeight={65} {...props} />
);
const H4Text = props => (
  <CustomText fontSize={34} lineHeight={46} {...props} />
);
const H5Text = props => (
  <CustomText fontSize={24} lineHeight={33} {...props} />
);
const H6Text = props => (
  <CustomText fontSize={20} lineHeight={27} {...props} />
);
const Body1Text = props => <CustomText fontSize={16} lineHeight={22} {...props} />;
const Body2Text = props => <CustomText fontSize={14} lineHeight={19} {...props} />;
const ButtonText = props => (
  <CustomText
    fontSize={14}
    fontFamily={Fonts.primaryBold}
    fontWeight="bold"
    lineHeight={19}
    {...props}
  />
);
const CaptionText = props => <CustomText fontSize={12} lineHeight={16} {...props} />;
const OverlineText = props => <CustomText fontSize={10} lineHeight={14} {...props} />;
const NavTitle = ({ dark, ...props }) => <CustomText fontSize={18} fontFamily={Fonts.primarySemiBold} color={dark ? Colors.white : Colors.black} {...props} />

export {
  H1Text,
  H2Text,
  H3Text,
  H4Text,
  H5Text,
  H6Text,
  Body1Text,
  Body2Text,
  ButtonText,
  CaptionText,
  OverlineText,
  NavTitle,
};
