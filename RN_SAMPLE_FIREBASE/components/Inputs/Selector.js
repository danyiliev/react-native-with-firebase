import React from 'react';
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
import BaseSelector from './BaseSelector';

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

const CustomSelector = (props) => {
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
    ...otherProps
  } = props;

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
        ]}
      >
        <BaseSelector
          ref={refFunc}
          {...input}
          {...otherProps}
          editable={!disabled}
          placeholderTextColor={Colors.mediumLightGray}
        />
      </View>
      {meta && meta.touched && meta.error && (
        <CaptionText color={Colors.red} style={styles.error}>{meta.error}</CaptionText>
      )}
    </View>
  );
};

CustomSelector.propTypes = {
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

CustomSelector.defaultProps = {
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
    alignItems: 'stretch',
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
    height: 46,
    fontSize: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'stretch',
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
});

CustomSelector.displayName = 'TextInput';

export default CustomSelector;
