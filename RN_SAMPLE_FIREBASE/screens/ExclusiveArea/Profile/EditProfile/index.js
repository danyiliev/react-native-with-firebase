import React, { useState, useEffect } from "react";
import { View, SafeAreaView, TouchableOpacity, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from 'firebase';
import moment from 'moment';

import {
  BaseScreenWrapper,
  NavBar,
  Avatar,
  Body2Text,
  TextInput
} from '@components';
import { Metrics, Colors, Fonts } from '@constants';
import { fetchProfile, updateProfile } from '@actions';
import { selectProfile, getEditProfileFormValues } from '@selectors';
import { Validators, Normalizers, uploadAvatar, cacheAvatar } from '@utils';

const styles = {
  wrapper: {
    flex: 1
  },
  contentWrapper: {
    flex: 1,
    paddingTop: Metrics.Big,
    paddingHorizontal: Metrics.Normal,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: Metrics.Big,
  },
  changeButton: {
    marginTop: Metrics.Small,
  }
}

const NameLengthValidator = Validators.lengthCheck(6);

const EditProfile = ({ profile, fetchProfile, updateProfile, handleSubmit, anyTouched }) => {
  const navigation = useNavigation();
  const [avatar, changeAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  const currentUserId = firebase.auth().currentUser.uid;
  const handlePick = async () => {
    try {
      const img = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [512, 512],
      });
      changeAvatar(img);
    } catch {
      Alert.alert('Error', `Can't select your avatar`);
    }
  }

  const submitEditing = async (form) => {
    setLoading(true);
    if (avatar && avatar.cancelled === false) {
      try {
        const avatarUrl = await uploadAvatar(avatar.uri);
        await cacheAvatar(avatarUrl, currentUserId);
        await updateProfile({ avatarUpdated: moment().format('ss') })
      } catch(err) {
        console.log(err);
      }
    }
    if (anyTouched || (avatar && avatar.cancelled === false)) {
      try {
        await updateProfile(form);
        navigation.goBack();
      } catch {
        Alert.alert('Error', `Can't update your profile`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigation.goBack();
    }
  }

  const handleBack = () => {
    if ((avatar && avatar.cancelled === false) || anyTouched) {
      Alert.alert(
        'Discard changes?',
        'Your changes will be lost if you proceed.',
        [
          { text: 'CANCEL' },
          { text: 'OK', onPress: () => { navigation.goBack(); } }
        ]
      )
    } else {
      navigation.goBack();
    }
  }

  const renderNavigation = () => {
    return (
      <NavBar
        left="close"
        title="Edit Profile"
        onLeft={handleBack}
        right={loading ? 'loading' : 'check'}
        onRight={handleSubmit(submitEditing)}
        textAlign="left"
      />
    )
  }

  return (
    <BaseScreenWrapper renderNavigation={renderNavigation} fullWidth>
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView style={styles.contentWrapper} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrapper}>
            <Avatar
              size={160}
              userId={avatar ? undefined : currentUserId}
              source={avatar ? { uri: avatar.uri } : undefined}
            />
            <TouchableOpacity style={styles.changeButton} onPress={handlePick}>
              <Body2Text
                color={Colors.purple}
                fontFamily={Fonts.primaryBold}
              >
                change
              </Body2Text>
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <Field
              name="name"
              label="name"
              component={TextInput}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ autoCapitalize: 'words', placeholder: 'Name' }}
            />
            <Field
              name="username"
              label="username"
              component={TextInput}
              required
              validate={[
                Validators.required,
                NameLengthValidator,
                Validators.usernameMatch,
              ]}
              normalize={Normalizers.lower}
              style={{ marginBottom: Metrics.Bigger }}
              props={{ placeholder: 'Username (at least 6 chars)', showAsyncIcon: true }}
            />
            <Field
              name="bio"
              label="bio"
              component={TextInput}
              style={{ marginBottom: Metrics.Bigger }}
              props={{
                placeholder: 'Write a short bio',
                multiline: true,
                autoGrow: true,
                maxLength: 150,
                autoCapitalize: 'sentences',
                showCounter: true,
              }}
            />
            <Field
              name="website"
              label="website"
              component={TextInput}
              validate={[
                Validators.url,
              ]}
              style={{ marginBottom: Metrics.Bigger }}
              props={{
                placeholder: 'Add your website',
                multiline: true,
                autoGrow: true,
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </BaseScreenWrapper>
  );
}

const mapStateToProps = (state) => ({
  initialValues: getEditProfileFormValues(state),
  profile: selectProfile(state),
});

const mapDispatchToProps = { fetchProfile, updateProfile };

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'profile.edit',
    asyncValidate: Validators.asyncUsernameCheck,
    asyncChangeFields: ['username'],
    touchOnChange: true,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditProfile)
);
