import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import {
  setPostCreationStatus,
  createPost,
  resumeCreation,
} from '@actions';

import VideoRecorder from './VideoRecorder';
import CheckVideo from './CheckVideo';
import ProductDescription from './ProductDescription';
import ProductDetails from './ProductDetails';

const Stack = createStackNavigator();

const CreatePostStack = ({ navigation, creatingPost, setPostCreationStatus, createPost, resumeCreation }) => {
  const handleFocus = () => {
    if (creatingPost) {
      resumeCreation();
    } else {
      setPostCreationStatus(true);
      createPost();
    }
  };
  useEffect(() => {
    navigation.addListener('focus', handleFocus);
    return () => {
      navigation.removeListener('focus', handleFocus);
    };
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="VideoRecorder" component={VideoRecorder} />
      <Stack.Screen name="CheckVideo" component={CheckVideo} />
      <Stack.Screen name="ProductDescription" component={ProductDescription} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
    </Stack.Navigator>
  );
};

const mapStateToProps = ({ appState }) => ({ creatingPost: appState.creatingPost });

const mapDispatchToProps = {
  setPostCreationStatus,
  createPost,
  resumeCreation,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostStack);
