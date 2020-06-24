import React from 'react';
import { connect } from 'react-redux';
import { View, Alert } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { Colors, Fonts, Metrics } from '@constants';
import {
  BaseScreen,
  Body1Text,
  Body2Text,
  NavBar,
  PurpleTransparentButton,
  TextInput,
} from '@components';
import { restorePassword } from '@actions';
import { Validators } from '@utils';

const styles = {
  wrapper: {
    position: 'relative',
    flex: 1,
    padding: Metrics.Normal,
  },
  title: {
    marginBottom: Metrics.Normal,
  },
  bodyText: {
    marginBottom: Metrics.Large,
  },
};

class ForgotPassword extends BaseScreen {
  handleBack = () => {
    this.props.navigation.goBack();
  }

  submitEditing = (form) => {
    this.props.restorePassword(form.email);
    Alert.alert(
      'Sent',
      'If your email is connected to a Shopcam account, we’ve sent you a password reset link. Please follow the directions in the email.',
      [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
    );
  }

  renderNavigation() {
    return (
      <NavBar left="close" onLeft={this.handleBack} />
    );
  }

  renderContent() {
    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 1 }}>
          <Body1Text fontFamily={Fonts.primaryBold} style={styles.title}>Trouble logging in?</Body1Text>
          <Body2Text style={styles.bodyText}>Enter the email address you use for Shopcam and we’ll send you a link to reset your password.</Body2Text>
          <Field
            name="email"
            component={TextInput}
            required
            validate={[Validators.required, Validators.email]}
            style={{ marginBottom: Metrics.Smaller }}
            props={{ placeholder: 'Email', autoFocus: true }}
          />
        </View>
        <PurpleTransparentButton
          height={40}
          fullWidth
          title="Send"
          onPress={this.props.handleSubmit(this.submitEditing)}
        />
      </View>
    );
  }
}

const mapDispatchToProps = { restorePassword };

export default connect(null, mapDispatchToProps)(
  reduxForm({
    form: 'auth.forgotPassword',
  })(ForgotPassword),
);
