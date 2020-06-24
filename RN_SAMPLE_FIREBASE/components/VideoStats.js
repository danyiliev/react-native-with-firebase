import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Fonts } from '@constants';

export default ({
  post: {
    viewCount, commentCount, reactionCount,
  },
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.itemContainer}>
      <Feather name="eye" color={Colors.white} size={20} />
      <Text style={styles.text}>{viewCount}</Text>
    </View>
    <View style={styles.itemContainer}>
      <Feather name="message-circle" color={Colors.white} size={20} />
      <Text style={styles.text}>{commentCount}</Text>
    </View>
    <View style={styles.itemContainer}>
      <Feather name="heart" color={Colors.white} size={20} />
      <Text style={styles.text}>{reactionCount}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 32,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    fontFamily: Fonts.primaryBold,
    fontSize: 13,
    color: Colors.white,
  },
});
