import React from 'react';
import * as firebase from 'firebase';
import { View, Text, StyleSheet } from 'react-native';

export default class NotificationScreen extends React.Component {
  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {

    } else {
      this.props.navigation.navigate('Onboarding');
    }

    // mostly used for when the user logs out
    firebase.auth().onAuthStateChanged((user) => {
      if (!firebase.auth().currentUser) {
        this.props.navigation.navigate('Login');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Notification Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
