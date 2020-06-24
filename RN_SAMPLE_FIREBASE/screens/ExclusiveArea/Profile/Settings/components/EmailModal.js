import React from 'react';
import { View, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { reduxForm, Field } from 'redux-form';

import {
  TextInput,
  H6Text,
  Body2Text,
} from '@components';
import { Metrics, Colors, Fonts } from '@constants';

import { Validators } from '@utils';

const EmailModal = ({
  visible = false,
  onUpdateEmail = () => {},
  onRequestClose,
  handleSubmit,
}) => {
  const submitEmail = (form) => {
    onUpdateEmail(form.email);
    onRequestClose();
  }
  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true}>
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <H6Text fontFamily={Fonts.primarySemiBold}>Email</H6Text>
            <Field
              name="email"
              component={TextInput}
              required
              validate={[Validators.required, Validators.email]}
              style={{ marginBottom: Metrics.Smaller }}
              props={{ placeholder: 'Email', autoFocus: true }}
            />
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit(submitEmail)}>
                <Body2Text fontFamily={Fonts.primarySemiBold} color={Colors.purple}>OK</Body2Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = {
  modalWrapper: {
    flex: 1,
    backgroundColor: Colors.darkTransparent(0.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    width: 320,
    height: 205,
    padding: Metrics.Big,
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    alignItems: 'flex-end',
  },
  button: {
    width: 64,
  }
}

export default reduxForm({
  form: 'settings.email',
  enableReinitialize: true,
  destroyOnUnmount: false,
})(EmailModal);
