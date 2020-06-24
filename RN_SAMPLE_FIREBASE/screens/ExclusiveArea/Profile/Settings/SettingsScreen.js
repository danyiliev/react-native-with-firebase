import React, { useState, useEffect } from 'react';
import { View, Switch, ScrollView, Alert, Platform, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as _ from 'lodash';
import moment from 'moment';
import Constants from 'expo-constants';

import {
  BaseScreenWrapper,
  NavBar,
  Body2Text,
  BaseCountrySelector as CountrySelector,
} from '@components';
import { logout, toggleTheme } from '@actions';
import { THEMES } from '@themes';
import {
  getUserEmail,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
} from '@utils';
import { Colors } from '@constants';

import {
  EmailModal,
  PasswordModal,
  DeleteAccountModal,
  Section,
  SubSection,
  Subtitle
} from './components';

const styles = {
  switchInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  switch: {
    paddingLeft: 16,
  }
}

export default () => {
  const [email, setEmail] = useState('');
  const [emailEditing, setEmailEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [country, setCountry] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const profile = useSelector((state) => ({ ...state.profile.mainInfo.data }));
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    setEmail(getUserEmail());
    setCountry(_.get(profile, 'country', 'US'));
    setCurrency(_.get(profile, 'currency', 'USD'));
    setBirthday(_.get(profile, 'birthday'));
  }, [profile.country]);
  const handleBack = () => {
    navigation.goBack();
  }
  const showEmailModal = () => {
    setEmailEditing(true);
  }
  const closeEmailModal = () => {
    setEmailEditing(false);
  }
  const showPasswordModal = () => {
    setPasswordEditing(true);
  }
  const closePasswordModal = () => {
    setPasswordEditing(false);
  }
  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  }
  const handleHideDatePicker = () => {
    setShowDatePicker(false);
  }
  const handleLogout = () => {
    Alert.alert(
      `Log out of ${profile.username}?`,
      '',
      [
        { text: Platform.OS === 'ios' ? 'Cancel' : 'CANCEL' },
        { text: Platform.OS === 'ios' ? 'Log Out' : 'LOG OUT', onPress: () => {
          dispatch(logout());
          navigation.navigate('Discover');
        }}
      ]
    )
  }
  const renderNavigation = () => <NavBar left="back" onLeft={handleBack} />
  const handleInfoChange = (name) => async (value) => {
    if (name !== 'password') {
      switch (name) {
        case 'email':
          setEmail(value);
          break;
        case 'currency':
          setCurrency(value);
          break;
        case 'country':
          setCountry(value);
          break;
        case 'country':
          setCountry(value);
          break;
        case 'birthday':
        default:
          setCountry(value);
          break;
      }
    }
    if (name === 'birthday') {
      hideDatePicker();
    }
    try {
      switch (name) {
        case 'email':
          updateUserEmail(value);
          break;
        case 'password':
          updateUserPassword(value);
          break;
        case 'birthday':
          updateUserProfile({ 'birthday': moment(value).format('YYYY-MM-DD') });
          break;
        default:
          updateUserProfile({ [name]: value });
          break;
      }
    } catch {
      Alert.alert('Error', `Can't update your profile`);
    }
  }
  const toEditProfile = () => {
    navigation.navigate('EditProfile');
  }
  const toBlocked = () => {
    navigation.navigate('BlockedUsers')
  }
  const reportBug = async () => {
    const platform = Platform.OS;
    try {
      await Linking.openURL(`mailto:hello@shopcam.tv?subject=Shopcam Bug:&body=Build: ${Constants.nativeAppVersion}\nOS: ${platform}`);
    } catch {
      Alert.alert('Mail App Error', `Can't send mail due to issue with your mail app.`);
    }
  }
  const contactUs = async () => {
    Linking.openURL(`mailto:hello@shopcam.tv?cc=&subject='Shopcam Bug:'&body=''`);
    try {
      await Linking.openURL('mailto:hello@shopcam.tv');
    } catch {
      Alert.alert('Mail App Error', `Can't send mail due to issue with your mail app.`);
    }
  }
  const deleteAccount = () => {
    setDeletingAccount(true);
  }
  const closeDeleteAccountModal = () => {
    setDeletingAccount(false);
  }
  return (
    <BaseScreenWrapper renderNavigation={renderNavigation} fullWidth goBack={handleBack}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Section title="Account">
            <SubSection onPress={toEditProfile}>
              <Subtitle>Edit Profile</Subtitle>
            </SubSection>
            <SubSection onPress={showEmailModal}>
              <Subtitle>Email</Subtitle>
              <Body2Text>{email}</Body2Text>
            </SubSection>
            <SubSection onPress={showPasswordModal}>
              <Subtitle>Password</Subtitle>
              <Body2Text>********</Body2Text>
            </SubSection>
            <SubSection>
              <Subtitle>Country/Region</Subtitle>
              <CountrySelector
                label="Country/Region"
                value={country}
                hideArrow
                onSelect={handleInfoChange('country')}
              />
            </SubSection>
            {/* <SubSection>
              <Subtitle>Currency</Subtitle>
              <BaseSelector
                label="Currency"
                showFullLabel
                value={currency}
                hideArrow
                options={Currencies}
                onChange={handleInfoChange('currency')}
              />
            </SubSection>
            <SubSection onPress={handleShowDatePicker}>
              <Subtitle>Birthday</Subtitle>
              <Body2Text>{moment(birthday).format('MM/DD/YYYY')}</Body2Text>
            </SubSection> */}
            <SubSection onPress={toBlocked}>
              <Subtitle>Blocked</Subtitle>
            </SubSection>
            <SubSection onPress={handleLogout} last>
              <Subtitle color={Colors.purple}>Log Out</Subtitle>
            </SubSection>
          </Section>
          <Section title="Push notifications">
            <SubSection>
              <View style={styles.switchInput}>
                <View style={styles.switchLabel}>
                  <Subtitle>Activity</Subtitle>
                  <Body2Text>Views, reacts, new followers, etc.</Body2Text>
                </View>
                <View style={styles.switch}>
                  <Switch />
                </View>
              </View>
            </SubSection>
            <SubSection last>
              <View style={styles.switchInput}>
                <View style={styles.switchLabel}>
                  <Subtitle>Recommended</Subtitle>
                  <Body2Text>New posts, trending videos, etc.</Body2Text>
                </View>
                <View style={styles.switch}>
                  <Switch />
                </View>
              </View>
            </SubSection>
          </Section>
          <Section title="Support">
            <SubSection onPress={reportBug}>
              <Subtitle>Report a bug</Subtitle>
            </SubSection>
            <SubSection onPress={contactUs} last>
              <Subtitle>Contact us</Subtitle>
            </SubSection>
          </Section>
          <Section>
            <SubSection onPress={deleteAccount} last>
              <Subtitle color={Colors.red}>Delete account</Subtitle>
            </SubSection>
          </Section>
        </ScrollView>
        <EmailModal
          visible={emailEditing}
          initialValues={{ email }}
          onRequestClose={closeEmailModal}
          onUpdateEmail={handleInfoChange('email')}
        />
        <PasswordModal
          visible={passwordEditing}
          onRequestClose={closePasswordModal}
        />
        <DeleteAccountModal
          visible={deletingAccount}
          onRequestClose={closeDeleteAccountModal}
        />
        <DateTimePicker
          isVisible={showDatePicker}
          onConfirm={handleInfoChange('birthday')}
          onCancel={handleHideDatePicker}
        />
      </View>
    </BaseScreenWrapper>
  )
}
