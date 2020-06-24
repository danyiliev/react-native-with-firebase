import React, { useState } from 'react';
import { View, Modal, Alert, Platform } from 'react-native';
import { reduxForm, Field } from 'redux-form';

import {
  TextInput,
  H6Text,
  Body2Text,
  BaseScreenWrapper,
  NavBar,
} from '@components';
import { Metrics, Colors } from '@constants';

import {
  Validators,
  checkPassword,
  updatePassword,
} from '@utils';

const PasswordLengthValidator = Validators.lengthCheck(6, 'Use at least 6 characters for your password.');
const PasswordConfirmValidator = (values) => {
  const errors = {};
  if (values.confirmPassword != values.newPassword) {
    errors.confirmPassword = 'Passwords don\'t match. Try again.';
  }
  return errors;
};

const PasswordModal = ({
  visible = false,
  onRequestClose,
  handleSubmit,
  reset,
}) => {
  const [loading, setLoading] = useState(false);
  const submitPassword = async (form) => {
    try {
      setLoading(true);
      await checkPassword(form.currentPassword);
      await updatePassword(form.newPassword);
      setLoading(false);
      onRequestClose();
      reset();
    } catch (err) {
      setLoading(false);
      Alert.alert('Incorrect password', 'The current password you entered is incorrect. Please try again.');
    }
  };
  const renderNavigation = () => (
    <NavBar
      left="close"
      onLeft={() => { reset(); onRequestClose(); }}
      right={loading ? 'loading' : 'check'}
      onRight={loading ? undefined : handleSubmit(submitPassword)}
      ignoreStatusBarHeight={Platform.OS === 'android'}
    />
  );
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent animationType="slide">
      <BaseScreenWrapper renderNavigation={renderNavigation}>
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <Field
              label="current password"
              name="currentPassword"
              component={TextInput}
              validate={[Validators.required]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ secureTextEntry: true, placeholder: 'Enter current password' }}
            />
            <Field
              label="new password"
              name="newPassword"
              component={TextInput}
              validate={[
                Validators.required,
                PasswordLengthValidator,
                Validators.correctPassword,
              ]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ secureTextEntry: true, placeholder: 'Enter new password' }}
            />
            <Field
              label="confirm new password"
              name="confirmPassword"
              component={TextInput}
              validate={[Validators.required]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ secureTextEntry: true, placeholder: 'Confirm new password' }}
            />
          </View>
        </View>
      </BaseScreenWrapper>
    </Modal>
  );
};

const styles = {
  modalWrapper: {
    flex: 1,
    padding: Metrics.Normal,
  },
  modal: {
    backgroundColor: Colors.white,
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  button: {
    width: 64,
  },
};

export default reduxForm({
  form: 'settings.password',
  validate: PasswordConfirmValidator,
})(PasswordModal);
