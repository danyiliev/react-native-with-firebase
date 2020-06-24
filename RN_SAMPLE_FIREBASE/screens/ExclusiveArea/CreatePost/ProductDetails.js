import React from 'react';
import { connect } from 'react-redux';
import { View, Alert, ScrollView } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { Metrics, Categories } from '@constants';
import {
  BaseScreen,
  GradientButton,
  NavBar,
  TextInput,
  Selector,
} from '@components';
import { submitPostData, setPostDetail } from '@actions';
import { getCreatingProductDetails, getPostDetailsFormValues } from '@selectors';
import { Validators, Normalizers } from '@utils';

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
};

class ProductDetails extends BaseScreen {
  handleBack = () => {
    const { inputValues } = this.props;
    this.props.setPostDetail(inputValues);
    this.props.navigation.goBack();
  }

  submitEditing = async (form) => {
    try {
      await this.props.submitPostData(form);
      this.props.navigation.navigate('Discover');
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Can\'t save post details');
    }
  }

  renderNavigation() {
    return (
      <NavBar left="back" onLeft={this.handleBack} />
    );
  }

  renderContent() {
    return (
      <View style={{ flex: 1, paddingHorizontal: Metrics.Normal }}>
        <ScrollView
          style={styles.wrapper}
          contentContainerStyle={{ paddingTop: Metrics.Normal }}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        >
          <Field
            name="title"
            label="product title"
            component={TextInput}
            required
            validate={[Validators.required]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{ autoCapitalize: 'sentences', placeholder: 'e.g. Nike Air Max 2090' }}
          />
          <Field
            name="url"
            label="product url"
            component={TextInput}
            required
            validate={[
              Validators.required,
              Validators.url,
            ]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{
              placeholder: 'e.g. https://amazon....',
              description: 'Feel free to include your affiliate code!💸',
              multiline: true,
              autoGrow: true,
            }}
          />
          <Field
            name="price"
            label="price(USD)"
            component={TextInput}
            required
            validate={[
              Validators.required,
            ]}
            style={{ marginBottom: Metrics.Bigger }}
            format={Normalizers.price}
            props={{
              placeholder: 'e.g. $25',
              description: 'Get the price from your URL above and enter it here',
              keyboardType: 'decimal-pad',
            }}
          />

          <Field
            name="category"
            label="category"
            component={Selector}
            required
            validate={[
              Validators.required,
            ]}
            style={{ marginBottom: Metrics.Bigger }}
            props={{
              placeholder: 'Select category',
              options: Categories,
            }}
          />
        </ScrollView>
        <GradientButton
          gradient="purpleGradient"
          height={40}
          fullWidth
          title="Post"
          onPress={this.props.handleSubmit(this.submitEditing)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: getCreatingProductDetails(state),
  inputValues: getPostDetailsFormValues(state),
});

const mapDispatchToProps = { submitPostData, setPostDetail };

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'product.detail' })(ProductDetails),
);
