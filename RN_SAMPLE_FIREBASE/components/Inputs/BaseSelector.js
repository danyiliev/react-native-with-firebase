import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Modal, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Metrics, Colors, Fonts } from '@constants';

import { Body1Text } from '../Texts';
import { NavBar } from '../Navigation';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Metrics.Small,
  },
  modalNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: Metrics.Normal,
  },
  itemWrapper: {
    height: Metrics.Large,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bodyText: {
    fontSize: 18,
    marginRight: Metrics.Small,
  },
};

export default ({ placeholder, placeholderTextColor, disabled, onChange, options, value, showFullLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const keyExtractor = item => `option_${item.value}`;
  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback
      disabled={disabled}
      onPress={() => {
        setShowModal(false);
        onChange(item.value);
      }}
    >
      <View style={styles.itemWrapper}>
        <Body1Text
          color={value === item.value ? Colors.purple : Colors.black}
          fontFamily={Fonts.primarySemiBold}
        >
          {showFullLabel ? item.fullLabel : item.label}
        </Body1Text>
      </View>
    </TouchableWithoutFeedback>
  );
  const selectedOption = value ? options.find(({ value: val }) => val === value) : null;
  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={() => setShowModal(true)} disabled={disabled}>
        <View style={styles.wrapper}>
          <Body1Text
            color={value ? Colors.black : placeholderTextColor}
            style={styles.bodyText}
          >
            {value ? selectedOption.label : placeholder || 'Select'}
          </Body1Text>
          <Ionicons name="md-arrow-dropdown" color={Colors.black} size={Metrics.Small} />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={showModal} onRequestClose={() => setShowModal(false)} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <SafeAreaView style={{ flex: 1 }}>
            <NavBar left="close" onPress={() => setShowModal(false)} ignoreStatusBarHeight />
            <View style={{ flex: 1 }}>
              <FlatList
                contentContainerStyle={{ paddingHorizontal: Metrics.Normal }}
                data={options}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </React.Fragment>
  );
};
