import React, { useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Video } from 'expo-av';
import { Viewport } from '@skele/components';
import * as VideoThumbnails from 'expo-video-thumbnails';

import { Metrics, Colors, Fonts } from '@constants';
import { cacheVideo } from '@utils';

import { CaptionText, Body2Text } from './Texts';

const Wrapper = Viewport.Aware(View);

const { width } = Dimensions.get('screen');
const videoWidth = (width - Metrics.Big * 2 - Metrics.Normal) / 2;

const styles = {
  wrapper: {
    width: videoWidth,
    marginBottom: Metrics.Big
  },
  caption: {
    marginTop: Metrics.Smaller
  },
  videoWrapper: {
    position: 'relative',
    width: videoWidth,
    height: videoWidth * 4 / 3,
    borderRadius: Metrics.XSmall,
    overflow: 'hidden',
    backgroundColor: Colors.mediumLighterGray
  },
  loadingWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: videoWidth,
    height: videoWidth * 4 / 3,
    borderRadius: Metrics.XSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: videoWidth,
    height: videoWidth * 4 / 3,
  },
  videoPlayer: {
    width: videoWidth,
    height: videoWidth * 4 / 3,
  }
}

export default ({ post }) => {
  const [loading, setLoading] = useState('loading');
  const [focused, setFocusState] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailInfo, setThumbnail] = useState(undefined);
  useEffect(() => {
    fetchVideo();
  }, [post]);
  const fetchVideo = async () => {
    setLoading('loading');
    try {
      const cachedUri = await cacheVideo(post.videoClip, post.id, 'clip');
      if (cachedUri) {
        const thumbnail = await VideoThumbnails.getThumbnailAsync(cachedUri);
        setThumbnail(thumbnail);
        setVideoUri(cachedUri);
        setLoading('loaded');
      } else {
        setLoading('error');
      }
    } catch (err) {
      setLoading('error');
    }
  }
  const handleFocus = () => {
    setTimeout(() => {
      setFocusState(true);
    }, 100);
  }
  const handleBlur = () => {
    setFocusState(false);
  }
  return (
    <Wrapper style={styles.wrapper} onViewportEnter={handleFocus} onViewportLeave={handleBlur}>
      <View style={styles.videoWrapper}>
        {loading === 'loading' && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color={Colors.purple} />
          </View>
        )}
        {loading === 'error' && (
          <View style={styles.loadingWrapper}>
            <Body2Text color={Colors.red}>Loading error!</Body2Text>
          </View>
        )}
        {loading === 'loaded' && (
          <>
            <Image source={{ uri: thumbnailInfo.uri }} style={styles.thumbnail} />
            {focused && (
              <Video
                style={styles.videoPlayer}
                source={{ uri: videoUri }}
                resizeMode={Video.RESIZE_MODE_COVER}
                isMuted
                isLooping
                shouldPlay={true}
              />
            )}
          </>
        )}
      </View>
      <CaptionText style={styles.caption}>{post.title}</CaptionText>
      <Body2Text fontFamily={Fonts.primarySemiBold} fontSize={12} color={Colors.green}>${post.price}</Body2Text>
    </Wrapper>
  )
};
