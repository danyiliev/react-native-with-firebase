import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { CaptionText } from '../Texts';

import { Colors, Fonts } from '@constants';

class CustomDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isModalOpen: false, dob: '' };
  }

  handleDatePicked = (val) => {
    const mval = moment(val).format('YYYY-MM-DD');

    this.hideDateTimePicker();
    this.setState({ dob: mval });

    this.props.input.onChange(mval);
  };

  showDateTimePicker = () => {
    this.props.input.onFocus();
    this.props.input.onBlur();

    this.setState({ isModalOpen: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const {
      label,
      color,
      fontSize,
      style,
      labelStyle,
      placeholder,
      inputStyle,
      meta,
      input: { value },
      disabled,
      borderColor,
    } = this.props;
    const { dob } = this.state;

    const mergedInputStyle = {
      color,
      fontSize,
      ...inputStyle,
    };

    return (
      <TouchableWithoutFeedback
        onPress={this.showDateTimePicker}
        disabled={disabled}
      >
        <View style={[styles.default, style]}>
          {!!label && (
            <Text style={[styles.defaultLabel, labelStyle]}>{label}</Text>
          )}
          <View
            style={[
              styles.content,
              meta && meta.touched && meta.error ? styles.errorBorder : { borderColor },
            ]}
          >
            <Text
              style={[
                styles.input,
                mergedInputStyle,
                value ? null : styles.placeholder,
              ]}
            >
              {value ? moment(value).format('MM/DD/YYYY') : placeholder}
            </Text>
          </View>
          {meta && meta.touched && meta.error && (
            <CaptionText color={Colors.red} style={styles.error}>{meta.error}</CaptionText>
          )}
          <DateTimePicker
            isVisible={this.state.isModalOpen}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

CustomDateInput.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  style: PropTypes.any, //eslint-disable-line
  labelStyle: PropTypes.any, //eslint-disable-line
  borderColor: PropTypes.string,
  refFunc: PropTypes.func,
};

CustomDateInput.defaultProps = {
  label: null,
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
    color: Colors.white,
    opacity: 0.6,
    fontFamily: Fonts.primary,
    fontSize: 15,
  },
  content: {
    height: 36,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  errorBorder: {
    borderBottomColor: Colors.red,
  },
  input: {
    flex: 1,
    lineHeight: 38,
    fontFamily: Fonts.primary,
  },
  placeholder: {
    color: Colors.mediumGray,
  },
});

CustomDateInput.displayName = 'CustomDateInput';

export default CustomDateInput;
