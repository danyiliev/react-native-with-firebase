import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

import { Colors, Metrics } from '@constants';

const NavButton = ({ type, dark, style, size = 24, ...props }) => {
  const renderNavIcon = (type) => {
    if (type === 'loading') {
      return (
        <View style={[styles.wrapper, style, { width: size + 2, height: size + 2 }]}>
          <ActivityIndicator
            size="small"
            color={dark ? Colors.white : Colors.purple}
          />
        </View>
      )
    }
    switch (type) {
      case 'setting':
        return <Feather name="settings" color={dark ? Colors.white : Colors.mediumGray} size={size} />;
      case 'more':
        return <Ionicons name="md-more" color={dark ? Colors.white : Colors.gray1} size={size} />;
      case 'check':
        return <Ionicons name="md-checkmark" color={dark ? Colors.white : Colors.purple} size={size} />;
      case 'back':
        return <Ionicons name="md-arrow-back" color={dark ? Colors.white : Colors.black} size={size} />;
      case 'forward':
        return <Feather name="arrow-right" color={dark ? Colors.white : Colors.black} size={size} />;
      case 'film':
        return <Feather name="film" color={dark ? Colors.white : Colors.black} size={size} />;
      case 'refresh':
        return <Feather name="refresh-ccw" color={dark ? Colors.white : Colors.black} size={size} />;
      case 'download':
        return <Feather name="download" color={dark ? Colors.white : Colors.black} size={size} />;
      case 'close':
      default:
        return <Ionicons name="md-close" color={dark ? Colors.white : Colors.black} size={size} />;
    }
  }
  return(
    <TouchableOpacity style={[styles.wrapper, style, { width: size + 2, height: size + 2 }]} {...props}>
      {renderNavIcon(type)}
    </TouchableOpacity>
  );
}

const styles = {
  wrapper: {
    width: 26,
    height: 26,
    marginVertical: Metrics.Tiny,
    alignItems: 'center',
    justifyContent: 'center',
  }
}

NavButton.displayName = 'NavButton';

export default NavButton;