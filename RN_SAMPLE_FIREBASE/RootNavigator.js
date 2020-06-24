import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';
import { setAuthRedirect } from '@actions';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { THEMES } from './themes/index';
import { toggleTheme } from '@actions';
import { selectTheme } from '@selectors';

import {
  OnboardingStack,
  DiscoverStack,
  CreatePostStack,
  ProfileStack,
  ProfileScreen,
  ConnectionsScreen,
  BlockedScreen,
} from '@screens';
import NotificationScreen from '@screens/NotificationScreen';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const EmptyView = () => <View />;

const MainNavTab = () => {
  const theme = useSelector(selectTheme) || THEMES.primary;
  const dispatch = useDispatch();
  const getVisibility = (route) => {
    const { state } = route;
    if (state) {
      const { index, routes } = state;
      const screenName = routes[index].name;
      const screenToHideNavBar = ['EditProfile', 'SocialConnection', 'ExternalConnection', 'Settings'];
      if (screenToHideNavBar.includes(screenName)) {
        return false;
      }
    }
    return true;
  };
  return (
    <BottomTab.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderTopColor: '#f0f0f0',
          borderTopWidth: THEMES.primary.borderTopWidth,
          borderStyle: 'solid',
          position: 'absolute',
          bottom: isIphoneX() ? 16 : 0,
          left: 0,
          width: '100%',
          height: 70,
          shadowOpacity: 0,
          shadowColor: 'transparent',
          elevation: 0,
        },
        lazy: true,
        showLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Discover"
        component={DiscoverStack}
        options={{
          tabBarIcon: props => <Feather name="home" size={24} color={props.focused ? theme.activeTintColor : theme.inactiveTintColor} />,
        }}
      />
      <BottomTab.Screen
        name="Blank"
        component={EmptyView}
        options={{
          tabBarOptions: tabBarOptions(theme.activeTintColor, theme.inactiveTintColor),
        }}
        listeners={() => ({
          tabPress: e => e.preventDefault(),
          tabLongPress: e => e.preventDefault(),
        })}
      />
      <BottomTab.Screen
        name="CreatePost"
        component={CreatePostStack}
        options={{
          unmountOnBlur: true,
          tabBarVisible: false,
          tabBarIcon: () =>
            (
              <LinearGradient style={styles.postButton} colors={['#E954C5', '#FB479D']} start={[1, 0.1]}>
                <Feather name="plus" size={28} style={{ color: '#ffffff', padding: 8 }} />
              </LinearGradient>
            ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!firebase.auth().currentUser) {
              e.preventDefault();
              dispatch(setAuthRedirect('CreatePost'));
              navigation.navigate('Onboarding');
            }
          },
        })}
      />
      <BottomTab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: props => <Feather name="mail" size={24} color={props.focused ? theme.activeTintColor : theme.inactiveTintColor} />,
        }}
        listeners={() => ({
          tabPress: () => {
            dispatch(toggleTheme(THEMES.secondary));
          },
        })}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStack}
        options={({ route }) => ({
          tabBarIcon: props => <Feather name="user" size={24} color={props.focused ? theme.activeTintColor : theme.inactiveTintColor} />,
          tabBarVisible: getVisibility(route),
        })}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!firebase.auth().currentUser) {
              e.preventDefault();
              dispatch(setAuthRedirect('Profile'));
              navigation.navigate('Onboarding');
            } else {
              dispatch(toggleTheme(THEMES.secondary));
            }
          },
        })}
      />
    </BottomTab.Navigator>
  );
};

const Transition = Platform.select({
  ios: TransitionPresets.ModalSlideFromBottomIOS,
  android: TransitionPresets.FadeFromBottomAndroid,
});
const HorizontalTransition = Platform.select({
  ios: TransitionPresets.SlideFromRightIOS,
  android: TransitionPresets.DefaultTransition,
});

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{ ...HorizontalTransition, headerShown: false }}
  >
    <Stack.Screen
      name="Main"
      component={MainNavTab}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Onboarding"
      component={OnboardingStack}
      options={{ headerShown: false, ...Transition }}
    />
    <Stack.Screen
      name="ExternalProfile"
      component={ProfileScreen}
      options={{ headerShown: false, ...Transition }}
    />
    <Stack.Screen
      name="ExternalConnection"
      component={ConnectionsScreen}
      options={{ headerShown: false, ...Transition }}
    />
    <Stack.Screen
      name="BlockedUsers"
      component={BlockedScreen}
      options={{ headerShown: false, ...Transition }}
    />
  </Stack.Navigator>
);

const tabBarOptions = (active, inactive) => ({
  activeTintColor: active,
  inactiveTintColor: inactive,
});

const styles = StyleSheet.create({
  postButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});

export default () => (
  <NavigationContainer>
    <MainNavigator />
  </NavigationContainer>
);
