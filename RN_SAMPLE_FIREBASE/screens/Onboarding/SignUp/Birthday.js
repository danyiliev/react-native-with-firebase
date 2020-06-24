import React from 'react';
import { connect } from 'react-redux';
import { View, Alert, Text } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { CommonActions } from '@react-navigation/native';
import * as _ from 'lodash';
import moment from 'moment';

import { Colors, Fonts, Metrics } from '@constants';
import {
  BaseScreen,
  Body1Text,
  NavBar,
  OverlineText,
  PurpleTransparentButton,
  DateInput,
} from '@components';
import { restorePassword } from '@actions';
import { Validators, dateMask } from '@utils';

const styles = {
  wrapper: {
    position: 'relative',
    flex: 1,
    padding: Metrics.Normal,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '60%',
  },
  title: {
    flexDirection: 'row',
    marginBottom: Metrics.Large,
    textAlign: 'center',
  },
  bodyText: {
    textAlign: 'center',
  },
};

class Birthday extends BaseScreen {
  handleBack = () => {
    this.props.navigation.goBack();
  }

  submitEditing = (form) => {
    if (_.isEmpty(form)) {
      Alert.alert('Please fill out all required fields');
    } else {
      const { birthday } = form;
      const year = moment().diff(moment(birthday), 'years');
      if (year >= 13) {
        this.props.navigation.navigate({
          name: 'Signup',
          params: { birthday },
        });
      } else {
        Alert.alert(
          'Sorry!',
          'It looks like you\'re not eligible to use Shopcam. Thanks for checking us out though!',
        );
      }
    }
  }

  renderNavigation() {
    return (
      <NavBar left="close" onLeft={this.handleBack} />
    );
  }

  renderContent() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Body1Text fontFamily={Fonts.primaryBold} style={styles.title}>
            When's your birthday?<Text style={{ color: Colors.red }}>*</Text>
          </Body1Text>
          <View style={{ width: 125 }}>
            <Field
              name="birthday"
              component={DateInput}
              validate={[Validators.required]}
              style={{ marginBottom: Metrics.Smaller, textAlign: 'center' }}
              props={{ placeholder: 'MM/DD/YYYY' }}
            />
          </View>
          <OverlineText color={Colors.mediumGray} style={styles.bodyText}>This won’t be shown publicly.</OverlineText>
        </View>
        <PurpleTransparentButton
          height={40}
          fullWidth
          title="Next"
          onPress={this.props.handleSubmit(this.submitEditing)}
        />
      </View>
    );
  }
}

const mapDispatchToProps = { restorePassword };

export default connect(null, mapDispatchToProps)(
  reduxForm({
    form: 'auth.birthday',
  })(Birthday),
);
