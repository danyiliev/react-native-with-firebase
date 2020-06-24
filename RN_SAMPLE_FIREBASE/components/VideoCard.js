import React from 'react';
import { Video } from 'expo-av';
import { connect } from 'react-redux';
import { View, Share, Image, Text, StyleSheet, TouchableOpacity, TouchableHighlight, TouchableWithoutFeedback, Dimensions, Platform, Clipboard, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as _ from 'lodash';
import { withNavigation } from '@react-navigation/compat';
import firebase from 'firebase';

import FollowButton from './FollowButton';
import VideoStats from './VideoStats';
import ReportModal from './ReportModal';
import { Colors, Fonts } from '@constants';
import { showActionSheet } from '@actions';
import {
  incrementVideoViewCount,
  incrementVideoClickCount,
  addToWishlist,
  removeFromWishlist,
  checkIsInWishlist,
  showRootToast,
  blockUser,
  unblockUser,
  checkBlocked,
} from '@utils';


class VideoCard extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    const { currentPlayingKey, cardKey } = props;
    return { isPlaying: currentPlayingKey === cardKey };
  }

  state = {
    isFirstPlay: true,
    wishlistItem: false,
    wishlistLoading: false,
    blockInfo: false,
    showReport: false,
  }

  componentDidMount() {
    const { isPlaying } = this.state;
    const { video } = this;
    if (isPlaying) {
      video.playAsync();
    }
    this.fetchWishlistState();
    this.fetchBlockedState();
  }

  componentDidUpdate(prevProps, prevState) {
    const { post } = this.props;
    const { currentPlayingKey, cardKey } = this.props;
    const { isPlaying, isFirstPlay } = this.state;
    const { video } = this;

    if (!prevState.isPlaying && isPlaying) {
      video.playAsync();
      incrementVideoViewCount(post.id);
    } else if (prevState.isPlaying && !isPlaying) {
      video.pauseAsync();
    }

    if (prevProps.currentPlayingKey !== currentPlayingKey && cardKey === currentPlayingKey && !isFirstPlay) {
      this.setState({ isFirstPlay: true });
    }
  }

  fetchWishlistState = async () => {
    const { post } = this.props;
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    if (currentUserId) {
      try {
        const wishlistItem = await checkIsInWishlist(post.id);
        this.setState({ wishlistItem });
      } catch {
        this.setState({ wishlistItem: false });
      }
    }
  }

  fetchBlockedState = async () => {
    const { post } = this.props;
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    if (currentUserId) {
      try {
        const blockInfo = await checkBlocked(currentUserId, post.userId);
        this.setState({ blockInfo });
      } catch {
        this.setState({ blockInfo: false });
      }
    }
  }

  handleBlockUser = async () => {
    const { post } = this.props;
    const { blockInfo } = this.state;
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    try {
      if (blockInfo) {
        await unblockUser(blockInfo.id);
        this.setState({ blockInfo: false });
        showRootToast('User unblocked', 'center');
      } else {
        const result = await blockUser(currentUserId, post.userId, post.username);
        this.setState({ blockInfo: result });
        showRootToast('User blocked', 'center');
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleAddToWishlist = async () => {
    const { post } = this.props;
    const { wishlistItem } = this.state;
    try {
      this.setState({ wishlistLoading: true });
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id);
        this.setState({ wishlistItem: false });
        showRootToast('Removed from wishlist', 'center');
      } else {
        const result = await addToWishlist(post.id);
        this.setState({ wishlistItem: result });
      }
    } finally {
      this.setState({ wishlistLoading: false });
    }
  }

  handleGoToProfile = () => {
    const { post } = this.props;
    this.props.navigation.navigate('Profile', { userId: post.userId });
  }

  getVideoUrl = () => {
    const { id, title } = this.props;
    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    const url = `https://shopcam.tv/${slug}-video-${id}`;
    return url;
  }

  handleShare = () => {
    const url = this.getVideoUrl(0);
    Share.share({ message: url, url });
  }

  handleCopyLink = () => {
    const url = this.getVideoUrl(0);
    Clipboard.setString(url);
  }

  handleMore = () => {
    const { showActionSheet } = this.props;
    const { blockInfo } = this.state;
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    showActionSheet(
      currentUserId ?
        ['Share', 'Copy link', 'Report', blockInfo ? 'Unblock user' : 'Block User'] 
      : ['Share', 'Copy link', 'Report'],
      this.handleActionSheet);
  }

  handleActionSheet = (idx) => {
    switch (idx) {
      case 0:
        this.handleShare();
        break;
      case 1:
        this.handleCopyLink();
        break;
      case 2:
        this.showReportModal();
      case 3:
      default:
        this.handleBlockUser();
        break;
    }
  }

  showReportModal = () => {
    this.setState({ showReport: true });
  }

  hideReportModal = () => {
    this.setState({ showReport: false });
  }

  handleOpenExternalWebsite = async () => {
    const { url } = this.props.post;
    const { post } = this.props;
    if (url) {
      const result = await WebBrowser.openBrowserAsync(url);
      this.setState({ result });
      incrementVideoClickCount(post.id);
    } else {
      alert('URL missing');
    }
  };

  handleToggleVideo = () => {
    const { onToggle, cardKey } = this.props;
    this.setState({ isFirstPlay: false });
    onToggle(cardKey);
  };

  handleUserProfile = () => {
    const { post } = this.props;
    const { isPlaying } = this.state;
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    if (isPlaying) {
      this.handleToggleVideo();
    }
    if (post.userId === currentUserId) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props.navigation.navigate({
        name: 'ExternalProfile',
        params: { userId: post.userId },
      });
    }
  }

  renderMoreSheetContent = () => {
  /* render */
  };

  renderMoreSheetHeader = () => {
  /* render */
  };

  render() {
    const { post } = this.props;
    const {
      isPlaying,
      isFirstPlay,
      wishlistItem,
      wishlistLoading,
      showReport,
    } = this.state;
    const shareIcon = Platform.OS === 'ios' ? 'share' : 'share-2';
    const currentUserId = _.get(firebase.auth(), 'currentUser.uid');
    return (
      <View style={[styles.card, {backgroundColor: post.colors ? post.colors[0] : Colors.gray}]}>
        <ActivityIndicator style={styles.spinner} color={Colors.white} size="large" />
        <TouchableHighlight style={styles.touchVideo} onPress={this.handleToggleVideo}>
          <Video
            ref={(ref) => { this.video = ref; }}
            source={{ uri: post.video480 }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={false}
            isLooping
            style={[styles.video, {backgroundColor: post.colors ? post.colors[0] : Colors.gray}]}
          />
        </TouchableHighlight>

        {(!isPlaying && !isFirstPlay) ? (
          <View style={styles.play}>
            <TouchableOpacity onPress={this.handleToggleVideo}>
              <Feather name="play" color={Colors.white} size={30} />
            </TouchableOpacity>
          </View>
              ) : null}

        <View style={styles.postDetails}>
          <TouchableWithoutFeedback onPress={this.handleUserProfile}>
            <Image source={{ uri: post.userAvatar }} style={styles.postDetailsAvatar} />
          </TouchableWithoutFeedback>
          <View style={styles.userContent}>
            <TouchableWithoutFeedback onPress={this.handleUserProfile}>
              <Text style={styles.postDetailsUsername}>{post.username}</Text>
            </TouchableWithoutFeedback>
            <Text style={styles.postDetailsDescription} numberOfLines={2}>{post.description}</Text>
            <VideoStats post={post} style={styles.videoStats} />
          </View>
          <FollowButton connection={post} userId={currentUserId} style={styles.followContainer} />
        </View>

        <TouchableWithoutFeedback onPress={this.handleOpenExternalWebsite} >
          <View style={styles.productDetails}>
            <Feather style={styles.productDetailsIcon} name="tag" size={22} />
            <Text style={styles.productDetailsText} numberOfLines={1}>{post.title}</Text>
            <LinearGradient style={styles.priceButton} colors={['#46D666', '#14CB94']} start={[1, 0.1]}>
              <Text style={styles.priceButtonText}>${post.price}</Text>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={this.handleOpenSimiliarItems} style={styles.action}>
            <Feather name="shopping-bag" color={Colors.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleAddToWishlist}
            style={styles.action}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <MaterialIcons
                name={wishlistItem ? "bookmark" : "bookmark-border"}
                color={Colors.white}
                size={28}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleShare} style={styles.action}>
            <Feather name={shareIcon} color={Colors.white} size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.rightCorner} onPress={this.handleMore}>
          <Feather style={styles.more} name="more-vertical" size={28} />
        </TouchableOpacity>

        {/* <View>
          <BottomSheet
            snapPoints={[450, 300, 0]}
            renderContent={this.renderContent}
            renderHeader={this.renderHeader}
          />
        </View> */}
        <ReportModal
          type="video"
          visible={showReport}
          onRequestClose={this.hideReportModal}
          resourceId={post.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    elevation: 3,
    borderRadius: 16,
    position: 'relative',
    marginVertical: 6,
    marginHorizontal: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 3,
    width: Dimensions.get('window').width - 24,
  },
  video: {
    borderColor: '#fff',
    borderRadius: 16,
    height: '100%',
    marginBottom: 0,
    width: '100%'
  },
  play: {
    backgroundColor: 'rgba(0,0,0,.4)',
    borderRadius: 50,
    paddingTop: 20,
    paddingLeft: 4,
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    top: Dimensions.get('window').height / 2 - 70,
    width: 70,
    height: 70,
    zIndex: 5,
  },
  touchVideo: {
    borderRadius: 16,
  },
  spinner: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    top: '42%'
  },
  postDetails: {
    bottom: 124,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    position: 'absolute',
    width: Dimensions.get('window').width - 80,
  },
  postDetailsAvatar: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    borderRadius: 40,
    borderWidth: 2,
    height: 50,
    width: 50,
  },
  followContainer: {
    position: 'absolute',
    left: 14,
    top: 36,
  },
  userContent: {
    marginLeft: 6,
    marginTop: 2,
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoStats: {
    marginTop: 4,
  },
  postDetailsUsername: {
    fontFamily: Fonts.primaryBold,
    color: '#ffffff',
    fontSize: 14,
  },
  postDetailsDescription: {
    fontFamily: Fonts.primary,
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
    marginRight: 0,
  },
  productDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    bottom: 64,
    height: 52,
    marginHorizontal: 12,
    flex: 1,
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 48,
  },
  productDetailsIcon: {
    color: '#14CB94',
    height: 56,
    marginLeft: 14,
    lineHeight: 56,
  },
  productDetailsText: {
    fontFamily: Fonts.primaryMedium,
    marginLeft: 6,
    height: 56,
    fontSize: 14,
    lineHeight: 56,
    flex: 1,
  },
  priceButton: {
    marginHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 10,
    height: 32,
    width: 89,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceButtonText: {
    fontFamily: Fonts.primaryBold,
    backgroundColor: 'transparent',
    color: '#ffffff',
    height: 38,
    lineHeight: 38,
    fontSize: 13,
    textAlign: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 172,
    right: 16,
  },
  action: {
    marginTop: 30,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCorner: {
    flexDirection: 'row',
    position: 'absolute',
    top: 16,
    right: 12,
  },
  views: {
    flexDirection: 'row',
    top: 7,
    right: 6,
  },
  eye: {
    color: '#ffffff',
  },
  viewCount: {
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: 'bold',
    marginTop: -2,
  },
  more: {
    color: '#ffffff',
  },
});

const mapDispatchToProps = { showActionSheet };

export default withNavigation(connect(null, mapDispatchToProps)(VideoCard));
