import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CountryPicker, { DEFAULT_THEME, FlagButton } from 'react-native-country-picker-modal';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Fonts, Metrics, Images } from '@constants';
import { Body1Text } from '../Texts';

const renderFlagButton = hideArrow => (props) => {
  try {
    return (
      <View style={styles.flagButton}>
        <FlagButton {...props} />
        {!hideArrow && (
          <Ionicons
            style={styles.dropdownIcon}
            name="md-arrow-dropdown"
            color={Colors.black}
            size={Metrics.Big}
          />
        )}
      </View>
    );
  } catch (err) {
    return false;
  }
};

const renderItem = (onSelect, selected) => ({ item }) => {
  try {
    const { name } = item;
    return (
      <TouchableWithoutFeedback onPress={() => onSelect(item)}>
        <View>
          <Body1Text
            style={{
              ...styles.countryItem,
              ...(item.cca2 === selected && styles.highlight),
            }}
          >
            {name}
          </Body1Text>
        </View>
      </TouchableWithoutFeedback>
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default (props) => {
  try {
    const { fontSize, value, hideArrow } = props;
    const [open, setOpen] = useState(false);
    const theme = {
      ...defaultTheme,
      fontSize,
      onBackgroundTextColor: (!open && !value) ? Colors.mediumLightGray : Colors.black,
    };

    const onSelect = (country) => {
      setOpen(false);
      props.onSelect(country.cca2);
    };
    return (
      <CountryPicker
        countryCode={value}
        visible={open}
        withFilter
        withFlagButton={false}
        withFlag={false}
        withEmoji={false}
        withCountryNameButton
        withModal
        withCloseButton
        theme={theme}
        renderFlagButton={renderFlagButton(hideArrow)}
        onOpen={() => { setOpen(true); }}
        onClose={() => { setOpen(false); }}
        filterProps={{ style: styles.filter }}
        closeButtonImage={Images.CloseIcon}
        closeButtonStyle={styles.closeButtonWrapper}
        closeButtonImageStyle={styles.closeButton}
        flatListProps={{
          renderItem: renderItem(onSelect, value),
          ItemSeparatorComponent: null,
          contentContainerStyle: styles.modalContent,
          showsVerticalScrollIndicator: false,
        }}
      />
    );
  } catch (err) {
    console.log(err);
    return false;
  }
};

const defaultTheme = {
  ...DEFAULT_THEME,
  fontFamily: Fonts.primary,
  filterPlaceholderTextColor: Colors.mediumLightGray,
  primaryColor: Colors.black,
  primaryColorVariant: Colors.mediumLightGray,
  onBackgroundTextColor: Colors.mediumLightGray,
};

const styles = StyleSheet.create({
  flagButton: {
    position: 'relative',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
  },
  filter: {
    flex: 1,
    padding: Metrics.Small,
    marginRight: Metrics.Normal,
    backgroundColor: Colors.lightGrayOpacity,
    borderRadius: Metrics.Tiny,
    fontFamily: Fonts.primary,
    fontSize: Metrics.Normal,
    color: Colors.mediumGray,
    marginTop: Metrics.Big,
  },
  closeButton: {
    width: Metrics.Normal,
    height: Metrics.Normal,
    tintColor: Metrics.black,
  },
  closeButtonWrapper: {
    marginTop: Metrics.Big,
    width: Metrics.Big,
    height: Metrics.Big,
    padding: Metrics.Smaller,
    marginRight: Metrics.Normal,
    marginLeft: Metrics.Normal,
  },
  countryItem: {
    paddingVertical: Metrics.Normal,
    fontFamily: Fonts.primarySemiBold,
    color: Colors.black,
  },
  modalContent: {
    padding: Metrics.Normal,
  },
  highlight: {
    color: Colors.purple,
  },
});
