import React, { useState } from 'react';
import { TextInput } from 'react-native';

const BaseInput = ({ value, onChange, style, autoGrow, onContentSizeChange, multiline, autoCapitalize, ...props }) => {
  const [height, setHeight] = useState(64);
  return (
    <TextInput
      value={value}
      onChange={onChange}
      autoCapitalize={autoCapitalize || 'none'}
      style={[style, autoGrow && { height }]}
      onContentSizeChange={autoGrow ? (e) => {
        setHeight(e.nativeEvent.contentSize.height + 8);
        onContentSizeChange(e.nativeEvent.contentSize.height + 8);
      } : () => {}}
      multiline={multiline}
      {...props}
    />
  );
};

BaseInput.displayName = 'BaseInput';

export default BaseInput;
