import React from 'react';
import { View, Modal, Platform } from 'react-native';

import { BaseScreenWrapper } from './BaseScreen';
import { NavBar } from './Navigation';
import { Colors } from '@constants';

export default ({
  visible = false,
  onRequestClose,
  children
}) => {
  const renderNavigation = () => (
    <NavBar
      left="close"
      onLeft={onRequestClose}
      ignoreStatusBarHeight={Platform.OS === 'android'}
    />
  )
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true} animationType="slide">
      <BaseScreenWrapper renderNavigation={renderNavigation}>
        <View style={styles.modal}>
          {children}
        </View>
      </BaseScreenWrapper>
    </Modal>
  );
}

const styles = {
  modal: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  button: {
    width: 64,
  }
}
