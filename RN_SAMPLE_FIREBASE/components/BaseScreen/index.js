import React, { useEffect } from 'react';
import { View, BackHandler } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { withNavigation } from '@react-navigation/compat';

import { Colors, Metrics } from '@constants';
import { getRouteParams } from '@utils';

import KeyboardAvoidingView from '../KeyboardAvoidingView';

const styles = {
  wrapper: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
};

export const BaseScreenWrapper = ({ renderNavigation, fullWidth, children, goBack }) => {
  const navigation = useNavigation();
  const navState = useNavigationState(({ index, routes }) => ({ index, routes }));
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleHardwareBackPress);
    };
  }, []);
  const handleHardwareBackPress = () => {
    if (goBack) {
      goBack();
      return true;
    } else {
      if (navState.index > 0) {
        navigation.pop();
      } else {
        navigation.navigate('Discover');
      }
      return true;
    }
  };
  const { wrapperStyle = {} } = getRouteParams(navState) || {};
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {renderNavigation()}
      <KeyboardAvoidingView>
        <View style={[styles.content, fullWidth && { padding: 0 }]}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default class BaseScreen extends React.Component {
  fullWidth = false;

  renderNavigation() {
    return false;
  }

  renderContent() {
    return false;
  }

  render() {
    return (
      <BaseScreenWrapper renderNavigation={this.renderNavigation} goBack={this.goBack} fullWidth={this.fullWidth}>
        {this.renderContent()}
      </BaseScreenWrapper>
    );
  }
}
