import React from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { Colors, Metrics } from '@constants';
import { ButtonText } from '../Texts';

export const RecordButton = ({
  size = Metrics.Larger,
  color = Colors.white,
  gradient = 'purpleGradient',
  recording = false,
  ...props
}) => {
  const outerSize = size + Metrics.Small * 2;
  const innerSize = size * 0.75;
  return (
    <TouchableWithoutFeedback {...props}>
      <View style={styles.circleButtonWrapper(outerSize)}>
        <LinearGradient
          {...Colors[gradient]}
          style={styles.recordButtonBG}
        >
          {recording ? (
            // <>
            //   <View style={styles.recordButtonPausePart(innerSize, color)} />
            //   <View style={styles.recordButtonPausePart(innerSize, color)} />
            // </>
            <View style={styles.recordButtonStop(innerSize, color)} />
          ) : (
            <View style={styles.recordButtonInner(size, color)} />
          )}
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const CircleCheckButton = ({
  size = Metrics.Larger,
  iconSize = Metrics.Bigger,
  color = Colors.white,
  gradient = 'purpleGradient',
  ...props
}) => (
  <TouchableWithoutFeedback {...props}>
    <View style={styles.circleButtonWrapper(size)}>
      <LinearGradient
        {...Colors[gradient]}
        style={styles.circleButtonBG}
      >
        <Feather name="check" size={iconSize} color={color} />
      </LinearGradient>
    </View>
  </TouchableWithoutFeedback>
);

export const CustomButton = ({
  title,
  backgroundColor,
  height,
  fullWidth,
  color = Colors.black,
  transparent,
  style,
  loading,
  ...props
}) => (
  <TouchableWithoutFeedback {...props}>
    <View
      style={[
        styles.buttonWrapper,
        { height, backgroundColor },
        fullWidth && styles.fullWidth,
        transparent && styles.transparentButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.purple} size="small" />
      ) : (
        <ButtonText color={color}>{title}</ButtonText>
      )}
    </View>
  </TouchableWithoutFeedback>
);

export const Button40 = props => (
  <CustomButton height={40} {...props} />
);

export const Button32 = props => (
  <CustomButton height={32} {...props} />
);

export const TransparentButton = props => (
  <CustomButton transparent color={Colors.white} {...props} />
);

export const PurpleTransparentButton = ({ style, ...restProps }) => (
  <TransparentButton
    style={[{ borderColor: Colors.purple }, style]}
    color={Colors.purple}
    {...restProps}
  />
);

export const GradientButton = ({ title, gradient = 'greenGradient', fullWidth, style, onPress, loading = false }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <LinearGradient
      {...Colors[gradient]}
      style={[
        styles.gradientButtonWrapper,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <ButtonText color={Colors.white}>{title}</ButtonText>
      )}
    </LinearGradient>
  </TouchableWithoutFeedback>
);

const styles = {
  buttonWrapper: {
    heigh: 32,
    borderRadius: 4,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    overflow: 'hidden',
  },
  fullWidth: {
    width: 'auto',
  },
  gradientButtonWrapper: {
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 92,
    overflow: 'hidden',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.white,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  circleButtonWrapper: size => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
  }),
  circleButtonBG: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonBG: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonInner: (size, color) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  }),
  recordButtonStop: (size, color) => ({
    width: size,
    height: size,
    borderRadius: 3,
    backgroundColor: color,
  }),
  recordButtonPausePart: (innerSize, color) => ({
    width: (innerSize - Metrics.Smaller) / 2,
    height: innerSize,
    backgroundColor: color,
    borderRadius: 3,
    margin: Metrics.Tiny,
  }),
};
