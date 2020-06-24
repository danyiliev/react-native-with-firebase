import React from 'react';
import { connect } from 'react-redux';
import { Alert, Text, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';
import 'firebase/firestore';

import { Colors, Metrics, Countries } from '@constants';
import {
  BaseScreen,
  GradientButton,
  NavBar,
  OverlineText,
  TextInput,
  Selector,
} from '@components';
import { signup, setAuthRedirect } from '@actions';
import { Validators, Normalizers, checkUsername } from '@utils';

const styles = {
  wrapper: {
    flex: 1,
    marginBottom: Metrics.Normal,
  },
  title: {
    marginBottom: Metrics.Normal,
  },
  bodyText: {
    marginBottom: Metrics.Large,
  },
  button: {
    height: 40,
  },
  highlight: {
    color: Colors.purple,
  }
}

const NameLengthValidator = Validators.lengthCheck(6);
const PasswordLengthValidator = Validators.lengthCheck(6, 'Use at least 6 characters for your password.');

const asyncValidate = async (values) => {
  try {
    const isValid = await checkUsername(values.username);
    if (isValid) {
      return true;
    } else {
      throw {username: 'This username is already taken.'}
    }
  }catch {
    throw {username: 'This username is already taken.'}
  }
}

class Signup extends BaseScreen {
  state = {
    username: '',
    validUsername: true,
    validatingUsername: false,
    error: null,
  }

  handleBack = () => {
    this.props.navigation.goBack();
  }

  handleUsernameChange = async (username) => {
    if (username !== '') {
      this.setState({ username });
      if (username.length >= 6 && !Validators.usernameMatch(username)) {
        try {
          this.setState({ validatingUsername: true });
          const isUniq = await checkUsername(username);
          if (isUniq) {
            this.setState({ validUsername: true });
          } else {
            this.setState({ validUsername: false });
          }
        } catch (err) {
          this.setState({ validUsername: false, error: err });
        } finally {
          this.setState({ validatingUsername: false });
        }
      } else {
        this.setState({ validUsername: false });
      } 
    }
  }

  submitEditing = async (form) => {
    const { navigation, route, signup, setAuthRedirect, redirect } = this.props;
    const birthday = route.params || {};
    const { email, username, password, country } = form;
    try {
      await signup(email, password, username, birthday, country);
      if (redirect) {
        if (redirect === 'origin') {
          navigation.pop();
        } else if (typeof redirect === 'string') {
          navigation.pop();
          navigation.navigate(redirect);
        } else {
          const { routeName, params } = redirect;
          navigation.pop();
          navigation.navigate(routeName, params);
        }
        setAuthRedirect(null);
      } else {
        navigation.navigate('Profile');
      }
    } catch(err) {
      console.log(err);
      Alert.alert('Sign up failed', err);
    }
  }

  renderNavigation() {
    return (
      <NavBar left="back" onLeft={this.handleBack} />
    )
  }

  renderContent() {
    return (
      <View style={{ flex: 1, paddingBottom: Metrics.Normal, paddingHorizontal: Metrics.Normal }}>
        <KeyboardAwareScrollView
          style={styles.wrapper}
          contentContainerStyle={{ paddingTop: Metrics.Normal }}
          showsVerticalScrollIndicator={false}
        >
          <Field
            name="email"
            label="email"
            component={TextInput}
            required
            validate={[Validators.required, Validators.email]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{ placeholder: 'Email' }}
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
            name="password"
            label="password"
            component={TextInput}
            required
            validate={[
              Validators.required,
              PasswordLengthValidator,
              Validators.correctPassword,
            ]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{ secureTextEntry: true, placeholder: 'Password (at least 6 chars)' }}
          />
          <Field
            name="country"
            label="country"
            component={Selector}
            required
            validate={[Validators.required]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{
              placeholder: 'Select your country',
              options: Countries,
            }}
          />
          <OverlineText>
            By signing up, you agree to Shopcam’s <Text style={styles.highlight}>terms</Text> and confirm that you have read our <Text style={styles.highlight}>privacy policy</Text> and <Text style={styles.highlight}>content policy</Text>.
          </OverlineText>
        </KeyboardAwareScrollView>
        <GradientButton
          gradient="purpleGradient"
          height={40}
          fullWidth
          title="Create account"
          style={styles.button}
          onPress={this.props.handleSubmit(this.submitEditing)}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  redirect: state.auth.redirect,
})

const mapDispatchToProps = { signup, setAuthRedirect };

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'auth.signup',
    asyncValidate,
    asyncChangeFields: ['username'],
  })(Signup)
);
