import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const CustomKeyboardAvoidingView = props => (
  <KeyboardAvoidingView
    style={{ flex: 1, position: 'relative' }}
    behavior={Platform.OS === 'android' ? undefined : 'padding'}
    {...props}
  />
);

CustomKeyboardAvoidingView.displayName = 'CustomKeyboardAvoidingView';

export default CustomKeyboardAvoidingView;
