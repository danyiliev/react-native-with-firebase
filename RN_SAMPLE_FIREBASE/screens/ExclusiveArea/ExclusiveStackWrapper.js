import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { setAuthRedirect } from '@actions';

const ExclusiveStack = ({ setAuthRedirect, redirect, children }) => {
  const [authenticated, setAuthState] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    if (firebase.auth().currentUser) {
      setAuthState(true);
    } else {
      setAuthState(false);
    }
  }, firebase.auth().currentUser);
  useFocusEffect(
    React.useCallback(() => {
      if (firebase.auth().currentUser) {
        setAuthState(true);
      } else {
        setAuthState(false);
        setAuthRedirect(redirect);
        navigation.navigate('Onboarding');
      }
    }, firebase.auth().currentUser)
  )
  return authenticated && (
    children
  )
}

const mapDispatchToProps = { setAuthRedirect };

export default connect(null, mapDispatchToProps)(ExclusiveStack);
