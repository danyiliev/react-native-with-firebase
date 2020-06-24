import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import { Colors, Metrics, Fonts } from '@constants';

const CustomTextInput = (props) => {
  const {
    style,
    required,
    refFunc,

    inputStyle,
    color,
    fontSize,
    borderColor,

    input,
    meta,
    disabled,
    ...otherProps
  } = props;

  const mergedInputStyle = {
    color,
    fontSize,
    ...inputStyle,
  };

  return (
    <View style={[styles.default, style]}>
      <View
        style={[
          styles.content,
          meta && meta.touched && meta.error ? styles.errorBorder : {},
        ]}
      >
        <TextInput
          style={[styles.input, mergedInputStyle]}
          autoCorrect={false}
          ref={refFunc}
          onEndEditing={input ? input.onBlur : () => {}}
          autoCapitalize="none"
          {...input}
          {...otherProps}
          editable={!disabled}
          placeholderTextColor={color}
        />
      </View>
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  style: PropTypes.any, //eslint-disable-line
  labelStyle: PropTypes.any, //eslint-disable-line
  refFunc: PropTypes.func,
  borderColor: PropTypes.string,
};

CustomTextInput.defaultProps = {
  label: null,
  propTypes: false,
  color: Colors.white,
  fontSize: 18,
  style: {},
  labelStyle: {},
  refFunc: null,
  borderColor: Colors.gray,
};

const styles = StyleSheet.create({
  content: {
    height: 48,
    fontSize: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: Metrics.Normal,
  },
  errorBorder: {
    borderColor: Colors.red,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.primary,
  },
});

CustomTextInput.displayName = 'LightTextInput';

export default CustomTextInput;
