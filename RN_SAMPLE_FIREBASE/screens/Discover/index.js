import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { THEMES } from '@themes/index';
import { toggleTheme } from '@actions';

import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

export default () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      dispatch(toggleTheme(THEMES.primary));
    }
  }, [isFocused]);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
