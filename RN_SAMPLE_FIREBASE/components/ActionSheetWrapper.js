import React, { useEffect } from 'react';
import { View, Animated, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { Colors, Fonts, Metrics } from '@constants';
import { showActionSheet, hideActionSheet } from '@actions';

const aniVal = new Animated.Value(0);
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = {
  sheetWrapper: {
    position: 'absolute',
    right: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    padding: Metrics.Normal,
    borderTopLeftRadius: Metrics.Small,
    borderTopRightRadius: Metrics.Small,
  },
  option: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: Metrics.Normal,
    marginVertical: Metrics.Normal,
    textAlign: 'center',
  }
}

export const useActionSheet = () => {
  const dispatch = useDispatch();
  const show = (options, callback) => dispatch(showActionSheet(options, callback));
  const hide = () => dispatch(hideActionSheet());
  return { show, hide }
}

export const ActionSheetWrapper = ({ children }) => {
  const actionSheet = useSelector(state => state.appState.actionSheet);
  const dispatch = useDispatch();
  useEffect(() => {
    if (actionSheet.show) {
      show();
    } else {
      hide();
    }
  }, [actionSheet.show]);
  const show = () => {
    Animated.timing(aniVal, {
      toValue: 1,
      duration: 300,
    }).start();
  }
  const hide = () => {
    Animated.timing(aniVal, {
      toValue: 0,
      duration: 300,
    }).start();
  }
  const select = (idx) => {
    actionSheet.callback(idx);
    dispatch(hideActionSheet());
  }
  const actionSheetHeight = Math.ceil(actionSheet.options.length * 52.5 + 32);
  return (
    <>
      {children}
      <TouchableWithoutFeedback onPress={() => dispatch(hideActionSheet())}>
        <Animated.View
          style={[
            styles.sheetWrapper,
            {
              top: actionSheet.show ? 0 : SCREEN_HEIGHT,
              backgroundColor: aniVal.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)'],
              }),
            }
          ]}
        >
          <Animated.View
            style={[
              styles.container,
              {
                top: aniVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_HEIGHT, SCREEN_HEIGHT - actionSheetHeight]
                })
              }
            ]}
          >
            {actionSheet.options.map((option, idx) => (
              <TouchableWithoutFeedback key={`item_${idx}`} onPress={() => select(idx)}>
                <Text style={styles.option}>{option}</Text>
              </TouchableWithoutFeedback>
            ))}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  )
};
