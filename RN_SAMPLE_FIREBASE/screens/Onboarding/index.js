import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import ForgotPassword from './ForgotPassword';
import { BirthdayScreen, SignupScreen } from './SignUp';

const Transition = Platform.select({
  ios: TransitionPresets.ModalSlideFromBottomIOS,
  android: TransitionPresets.FadeFromBottomAndroid,
});

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
        headerShown: false,
        mode: 'modal',
        ...Transition,
      }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Birthday" component={BirthdayScreen} options={{ ...Transition }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ ...TransitionPresets.SlideFromRightIOS }} />
  </Stack.Navigator>
);
