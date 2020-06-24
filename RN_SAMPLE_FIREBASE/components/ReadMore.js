import React, { useState, useCallback } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

import { Colors } from '@constants';

export default ({ children, TextObject, style, textStyle }) => {
  const [initLayout, setInitLayout] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [readMore, toggleReadMore] = useState(false);
  const onTextLayout = ({ nativeEvent }) => {
    if (!initLayout) {
      setInitLayout(true);
      setShowReadMore(nativeEvent.lines.length > 3);
    }
  };
  return (
    <View style={style}>
      <TextObject
        onTextLayout={onTextLayout}
        style={textStyle}
        numberOfLines={(showReadMore && !readMore) ? 3 : undefined}
        ellipsizeMode={(showReadMore && !readMore) ? 'tail' : undefined}
      >
        {children}
      </TextObject>
      {showReadMore && (
        <TouchableWithoutFeedback onPress={() => toggleReadMore(!readMore)}>
          <View>
            <TextObject style={textStyle} color={Colors.purple}>{readMore ? 'Read Less' : 'Read More'}</TextObject>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};
