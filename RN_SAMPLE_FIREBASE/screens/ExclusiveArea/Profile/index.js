import React from 'react';
import { View, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';

import { Colors } from '@constants';
import { toggleTheme } from '@actions';

import { THEMES } from '../../../themes/index';
import { SettingsScreen } from './Settings';
import ProfileScreen from '../../Profile';
import ConnectionScreen from '../../SocialConnections';
import EditProfile from './EditProfile';

const Stack = createStackNavigator();

export default ProfileStack = () => {
  const dispatch = useDispatch();
  const Transition = Platform.select({ ios: TransitionPresets.ModalSlideFromBottomIOS, android: TransitionPresets.FadeFromBottomAndroid });
  const HorizontalTransition = Platform.select({ ios: TransitionPresets.SlideFromRightIOS, android: TransitionPresets.SlideFromRightIOS });

  useFocusEffect(() => {
    dispatch(toggleTheme(THEMES.secondary));
  });
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ wrapperStyle: { paddingBottom: 70 } }}
        />
        <Stack.Screen
          name="SocialConnection"
          component={ConnectionScreen}
          options={{ headerShown: false, ...Transition }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          initialParams={{ wrapperStyle: { paddingBottom: Platform.OS === 'ios' ? 70 : 0 } }}
          options={{ headerShown: false, ...Transition }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false, ...HorizontalTransition }}
        />
      </Stack.Navigator>
    </View>
  );
};
