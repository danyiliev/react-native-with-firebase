import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, Modal, Alert, Platform, Text } from 'react-native';
import { reduxForm, Field } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  TextInput,
  Body1Text,
  BaseScreenWrapper,
  NavBar,
  Button40,
  GradientButton,
} from '@components';
import { Metrics, Colors, Fonts } from '@constants';
import { logout } from '@actions';

import {
  Validators,
  checkPassword,
  deleteMyAccount,
} from '@utils';

const DeleteAccountModal = ({
  visible = false,
  onRequestClose,
  handleSubmit,
  reset,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const submitPassword = async (form) => {
    try {
      setLoading(true);
      await checkPassword(form.password, form.email);
      await deleteMyAccount();
      setLoading(false);
      Alert.alert(
        'Account deleted',
        'Your account has been deleted. We hope to see you again soon!',
        [{ text: 'OK',
          onPress: () => {
            onRequestClose();
            navigation.navigate('Discover');
          },
        }],
      );
    } catch (err) {
      setLoading(false);
      Alert.alert(
        'Incorrect email or password',
        'Sorry, the email or password you entered is incorrect. Please try again.',
        [{
          text: 'TRY AGAIN',
        }],
      );
    }
  };
  const handleClose = () => {
    onRequestClose();
    reset();
  };
  const renderNavigation = () => (
    <NavBar
      left="close"
      onLeft={handleClose}
      ignoreStatusBarHeight={Platform.OS === 'android'}
      title="Delete account"
      textAlign="left"
    />
  );
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent animationType="slide">
      <BaseScreenWrapper renderNavigation={renderNavigation}>
        <View style={styles.modalWrapper}>
          <KeyboardAwareScrollView
            style={styles.modal}
            showsVerticalScrollIndicator={false}
          >
            <Body1Text style={styles.paragraph}>
              We’re so sorry to see you go! 😢
            </Body1Text>
            <Body1Text style={styles.paragraph}>
              If you delete your account, your profile, posts, connections, wishlist, and all other data will be removed. Information stored outside of your account might still be visible to others.
            </Body1Text>
            <Body1Text style={styles.paragraph}>
              <Text style={{ fontFamily: Fonts.primaryBold }}>
                {'Deleting your account is permanent. '}
              </Text>
               You won’t be able to reactivate it. If you’re sure you want to delete, please enter your email and password below.
            </Body1Text>
            <Field
              name="email"
              component={TextInput}
              validate={[Validators.required, Validators.email]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ placeholder: 'Email' }}
            />
            <Field
              name="password"
              component={TextInput}
              validate={[Validators.required]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ secureTextEntry: true, placeholder: 'Password' }}
            />
            <GradientButton
              title="Delete account"
              gradient="purpleGradient"
              style={{ height: 40, marginTop: Metrics.Normal }}
              fullWidth
              onPress={handleSubmit(submitPassword)}
              loading={loading}
            />
            <Button40
              title="Cancel"
              transparent
              fullWidth
              color={Colors.purple}
              style={{ marginTop: Metrics.Normal }}
              onPress={handleClose}
            />
          </KeyboardAwareScrollView>
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
  paragraph: {
    marginBottom: Metrics.Big,
  },
};

export default reduxForm({ form: 'settings.deleteAccount' })(DeleteAccountModal);
