import React from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import { isEmpty, get } from 'lodash';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import {
  NavBar,
  NavButton,
  CircleCheckButton,
  H6Text,
} from '@components';
import { Metrics, Colors, VideoConfig } from '@constants';
import {
  uploadVideo,
  setTempVideo,
} from '@actions';
import { showRootToast } from '@utils';

const styles = {
  wrapper: {
    position: 'relative',
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
    paddingTop: getStatusBarHeight(false),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  videoPlayer: {
    position: 'absolute',
    height: VideoConfig.Height,
    width: VideoConfig.Width,
    left: -VideoConfig.Offset,
    alignItems: 'center',
  },
  controlWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingBottom: Metrics.Normal,
    position: 'relative',
  },
  checkButtonWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.Normal,
    alignItems: 'center',
  },
  popupWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup: {
    width: 320,
    height: 178,
    padding: Metrics.Big,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
  },
};

class CheckVideoScreen extends React.Component {
  state = { loading: false, visible: false }

  componentDidMount() {
    MediaLibrary.requestPermissionsAsync();
    this.props.navigation.addListener('focus', this.handleNavFocus);
    this.props.navigation.addListener('blur', this.handleNavBlur);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.handleNavFocus);
    this.props.navigation.removeListener('blur', this.handleNavBlur);
  }

  setVideoRef = (ref) => {
    this.videoPlayer = ref;
  }

  handleBack = () => {
    Alert.alert(
      'Delete video?',
      'Your video will be deleted if you go back.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            this.props.setTempVideo(null);
            this.props.navigation.goBack();
          },
        },
      ],
    );
  }

  handleSave = async () => {
    const { tempVideoUri } = this.props;
    try {
      await MediaLibrary.saveToLibraryAsync(tempVideoUri);
      this.showToast();
    } catch (e) {
      console.log(e);
      Alert.alert('Video Save failed', 'There was an issue saving your video. Please try again.');
    }
  }

  handleCheck = async () => {
    const { tempVideoUri, uploadedVideo, docId } = this.props;
    const { loading } = this.state;
    if (!loading) {
      if (!isEmpty(uploadedVideo) && tempVideoUri === uploadedVideo.videoUri && docId === uploadedVideo.docId) {
        this.props.navigation.navigate('ProductDescription');
      } else {
        this.setState({ loading: true });
        try {
          await this.props.uploadVideo(tempVideoUri);
          this.props.navigation.navigate('ProductDescription');
        } catch (e) {
          Alert.alert('Video upload failed', 'There was an issue uploading your video. Please try again.');
        } finally {
          this.setState({ loading: false });
        }
      }
    }
  }

  handleNavFocus = () => {
    if (this.videoPlayer) {
      this.videoPlayer.playAsync();
    }
  }

  handleNavBlur = () => {
    if (this.videoPlayer) {
      this.videoPlayer.stopAsync();
    }
  }

  showToast = () => {
    showRootToast('Saved to Gallery!');
  }

  render() {
    const { tempVideoUri } = this.props;
    const { loading } = this.state;
    return (
      <View style={styles.wrapper}>
        <Video
          ref={this.setVideoRef}
          source={{ uri: tempVideoUri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.videoPlayer}
        />
        <View style={styles.controlWrapper}>
          <NavBar
            dark
            left="back"
            textAlign="left"
            title="How's it looking?"
            onLeft={this.handleBack}
            titleStyle={{ marginLeft: Metrics.Small }}
            ignoreStatusBarHeight
          />
          <View style={styles.checkButtonWrapper}>
            <NavButton dark size={32} type="download" onPress={this.handleSave} />
            <CircleCheckButton onPress={this.handleCheck} />
          </View>
        </View>
        {loading && (
          <View style={styles.popupWrapper}>
            <View style={styles.popup}>
              <H6Text>Uploading video...</H6Text>
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.purple} />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ createPost }) => ({
  tempVideoUri: createPost.tempVideoUri,
  docId: get(createPost, 'postDetails.id'),
  uploadedVideo: createPost.uploadedVideo,
});

const mapDispatchToProps = { uploadVideo, setTempVideo };

export default connect(mapStateToProps, mapDispatchToProps)(CheckVideoScreen);
