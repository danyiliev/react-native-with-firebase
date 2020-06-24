import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

import { Colors, Metrics, Fonts } from '@constants';

import { CaptionText, Body1Text } from '../Texts';
import BaseCountryPicker from './BaseCountryPicker';

const CountrySelector = (props) => {
  const {
    style,
    required,
    label,
    labelStyle,
    fontSize,
    borderColor,
    input,
    meta,
  } = props;

  const onSelect = (country) => {
    input.onChange(country.cca2);
  };

  return (
    <View style={[styles.default, style]}>
      {!!label && (
        <Text style={[styles.defaultLabel, labelStyle]}>{label}{required ? <Text style={{ color: Colors.red }}>*</Text> : ''}</Text>
      )}
      <View
        style={[
          styles.content,
          meta && meta.touched && meta.error ? styles.errorBorder : { borderColor },
        ]}
      >
        <BaseCountryPicker
          value={input.value}
          onSelect={onSelect}
          fontSize={fontSize}
          
        />
      </View>
      {meta && meta.touched && meta.error && (
        <CaptionText color={Colors.red} style={styles.error}>{meta.error}</CaptionText>
      )}
    </View>
  );
}

CountrySelector.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  style: PropTypes.any, //eslint-disable-line
  labelStyle: PropTypes.any, //eslint-disable-line
  refFunc: PropTypes.func,
  borderColor: PropTypes.string,
};

CountrySelector.defaultProps = {
  label: null,
  propTypes: false,
  color: Colors.black,
  fontSize: 18,
  style: {},
  labelStyle: {},
  refFunc: null,
  borderColor: Colors.lightGray,
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
    textTransform: "lowercase",
  },
  content: {
    height: 36,
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
});

CountrySelector.displayName = 'CountrySelector';

export default CountrySelector;
