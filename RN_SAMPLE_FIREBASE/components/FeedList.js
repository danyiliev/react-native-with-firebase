import React from 'react';
import { FlatList } from 'react-native';
import { Viewport } from '@skele/components';

import PostPreviewCard from './PostPreviewCard';
import { EmptyPosts, EmptyWishlist } from './EmptyStates';

import { Metrics } from '@constants';

const styles = {
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.Big,
  },
};

export default ({ keyPrefix = 'post', loading, type, ...props }) => {
  const keyExtractor = item => `${keyPrefix}_list_item_${item.id}`;
  const renderPost = ({ item }) => (
    <PostPreviewCard post={item} />
  );
  return (
    <Viewport.Tracker>
      <FlatList
        style={{ flex: 1, paddingTop: Metrics.Big }}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderPost}
        numColumns={2}
        keyExtractor={keyExtractor}
        ListEmptyComponent={type === 'posts' ? <EmptyPosts loading={loading} /> : <EmptyWishlist loading={loading} />}
        onEndReachedThreshold={0.9}
        initialNumToRender={4}
        {...props}
        showsVerticalScrollIndicator={false}
      />
    </Viewport.Tracker>
  );
};

