import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Metrics, Fonts } from '@constants';
import { CaptionText } from '../Texts';
import BaseInput from './BaseInput';

const getIcon = (meta) => {
  const { asyncValidating, touched, error } = meta;
  if (asyncValidating) {
    return <ActivityIndicator size="small" color={Colors.purple} />;
  }
  if (touched && error) {
    return <Ionicons name="md-close" size={18} color={Colors.red} />;
  }
  if (touched) {
    return <Ionicons name="md-checkmark-circle" size={18} color={Colors.green} />;
  }
  return false;
};

const CustomTextInput = (props) => {
  const {
    style,
    label,
    labelStyle,
    required,
    refFunc,

    inputStyle,
    color,
    fontSize,
    borderColor,

    input,
    meta,
    disabled,
    icon,
    showAsyncIcon,
    description,
    showCounter,
    ...otherProps
  } = props;

  const mergedInputStyle = {
    color,
    fontSize,
    ...inputStyle,
  };
  const [height, setHeight] = useState(64);
  return (
    <View style={[styles.default, style]}>
      {!!label && (
        <Text style={[styles.defaultLabel, labelStyle]}>{label}{required ? <Text style={{ color: Colors.red }}>*</Text> : ''}</Text>
      )}
      <View
        style={[
          styles.content,
          {
            borderBottomColor: borderColor,
          },
          meta && meta.touched && meta.error ? styles.errorBorder : {},
          otherProps.autoGrow && { height, paddingBottom: 8 },
        ]}
      >
        <BaseInput
          value={input.value}
          style={[styles.input, mergedInputStyle]}
          autoCorrect={false}
          ref={refFunc}
          onEndEditing={input ? input.onBlur : () => {}}
          {...input}
          {...otherProps}
          editable={!disabled}
          placeholderTextColor={Colors.mediumLightGray}
          onContentSizeChange={(size) => { otherProps.autoGrow && setHeight(size); }}
        />
        {showAsyncIcon ? getIcon(meta, input.value) : icon}
      </View>
      {showCounter && (
        <CaptionText color={Colors.mediumGray} style={styles.counter}>{input.value.length || 0}/{otherProps.maxLength}</CaptionText>
      )}
      {(meta && meta.touched && meta.error) ? (
        <CaptionText color={Colors.red} style={styles.error}>{meta.error}</CaptionText>
      ) : description && (
        <CaptionText color={Colors.mediumGray} style={styles.error}>{description}</CaptionText>
      )}
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
  mask: PropTypes.any, //eslint-disable-line
};

CustomTextInput.defaultProps = {
  label: null,
  propTypes: false,
  color: Colors.black,
  fontSize: 18,
  style: {},
  labelStyle: {},
  refFunc: null,
  borderColor: Colors.lightGray,
  mask: null,
};

const styles = StyleSheet.create({
  default: {
    //
  },
  defaultLabel: {
    color: Colors.mediumGray,
    fontSize: 12,
  },
  lightLabel: {
    color: Colors.mediumLightGray,
    opacity: 1,
    textTransform: 'lowercase',
  },
  content: {
    borderBottomColor: Colors.lightGray,
    height: 40,
    fontSize: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBorder: {
    borderBottomColor: Colors.red,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    fontFamily: Fonts.primary,
  },
  error: {
    paddingLeft: Metrics.Smaller,
    paddingTop: Metrics.Tiny,
  },
  counter: {
    paddingLeft: Metrics.Smaller,
    paddingTop: Metrics.Tiny,
    textAlign: 'right',
  },
});

CustomTextInput.displayName = 'TextInput';

export default CustomTextInput;
