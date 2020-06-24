import React from 'react';
import { View, SafeAreaView, Alert, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import {
  NavBar,
  NavButton,
  RecordButton,
} from '@components';
import { Metrics, Colors, VideoConfig } from '@constants';
import {
  setPostCreationStatus,
  createPost,
  resumeCreation,
  cancelPostCreation,
  setTempVideo,
  fetchProfile,
} from '@actions';

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
  outerCamera: {
    position: 'absolute',
    height: VideoConfig.Height,
    width: VideoConfig.Width,
    left: -VideoConfig.Offset,
    alignItems: 'center',
  },
  innerCamera: {
    flex: 1,
    width: Metrics.ScreenWidth,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  flipCameraButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.Bigger,
    paddingBottom: Metrics.Normal,
  },
  controlButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Metrics.Bigger,
    paddingBottom: Metrics.Normal,
  },
  progressWrapper: {
    backgroundColor: Colors.white,
    height: Metrics.Small,
    width: '100%',
  },
  progressBar: {
    height: Metrics.Small,
  },
  progressBarGradient: {
    height: Metrics.Small,
    width: '100%',
  },
};

class VideoRecorderScreen extends React.Component {
  state = {
    camType: Camera.Constants.Type.back,
    recording: false,
    duration: 0,
    timerId: null,
    videoUri: '',
    recorded: false,
    navigationFocused: false,
    canceled: false,
  }

  aniVal = new Animated.Value(0);

  componentDidMount() {
    this.props.fetchProfile();
    this.props.navigation.addListener('focus', this.handleFocus);
    this.props.navigation.addListener('blur', this.handleBlur);
    this.askPermission();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.handleFocus);
    this.props.navigation.removeListener('blur', this.handleBlur);
  }

  askPermission = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  }

  setCamRef = (ref) => {
    this.camRef = ref;
  }

  handleBack = () => {
    const { timerId } = this.state;
    clearInterval(timerId);
    Animated.timing(this.aniVal).stop();
    this.setState({ canceled: true }, () => {
      this.camRef && this.camRef.stopRecording();
    });
    this.props.cancelPostCreation();
    this.props.navigation.navigate('Discover');
  }

  handleFocus = () => {
    this.setState({ navigationFocused: true, canceled: false, recording: false });
    this.aniVal.setValue(0);
  }

  handleBlur = () => {
    this.setState({ navigationFocused: false });
  }

  handleRevertCam = () => {
    const { camType } = this.state;
    this.setState({
      camType: camType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  handleRecord = () => {
    const { recording } = this.state;
    if (recording) {
      this.camRef.stopRecording();
      this.setState({ recording: false });
    } else {
      this.aniVal.setValue(0);
      Animated.timing(this.aniVal, {
        duration: 15000,
        toValue: 1,
      }).start();
      const timerId = setInterval(this.updateDuration, 1000);
      this.setState({ recording: true, duration: 0, timerId });
      this.recordVideo();
    }
  }

  recordVideo = async () => {
    try {
      const videoUri = await this.camRef.recordAsync({
        maxDuration: VideoConfig.MaxDuration,
        maxFileSize: VideoConfig.MaxFileSize,
      });
      const { canceled } = this.state;
      if (!canceled) {
        Animated.timing(this.aniVal).stop();
        const { timerId } = this.state;
        clearInterval(timerId);
        this.props.setTempVideo(videoUri.uri);
        this.setState({ recording: false, recorded: true, timerId: null });
        this.props.navigation.navigate({
          name: 'CheckVideo',
          params: { recorded: true },
        });
      }
    } catch (e) {
      Alert.alert('Error while recording', JSON.stringify(e));
      Animated.timing(this.aniVal).stop();
      const { timerId } = this.state;
      clearInterval(timerId);
      this.aniVal.setValue(0);
      this.setState({ recording: false, duration: 0, timerId: null });
    }
  }

  checkVideo = () => {
    if (this.state.videoUri) {
      this.props.setTempVideo(this.state.videoUri);
      this.props.navigation.navigate({
        name: 'CheckVideo',
        params: {
          recorded: this.state.recorded,
        },
      });
    } else {
      Alert.alert('Record a Video', 'Record or upload a video to continue.');
    }
  }

  selectVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      const { duration, uri } = result;
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      const ext = uri.substr(uri.lastIndexOf('.') + 1).toLowerCase();
      if (fileInfo.size > VideoConfig.MaxFileSize || Math.floor(duration / 1000) > VideoConfig.MaxDuration) {
        Alert.alert(
          'Video too large',
          `Your video must be less than ${VideoConfig.MaxDuration} seconds and under ${VideoConfig.MaxFileSize / 1000000}MB. Please decrease the size and try again.`);
      } else if (ext !== 'mov' && ext !== 'mp4') {
        Alert.alert(
          'Wrong format',
          'Your video must be a MP4 or MOV file. Please change the file type and try again.',
        );
      } else {
        this.setState({ videoUri: uri, recorded: false });
        this.props.setTempVideo(uri);
        this.props.navigation.navigate({
          name: 'CheckVideo',
          params: { recorded: false },
        });
      }
    } catch (e) {
      console.log({ e });
    }
  }

  updateDuration = () => {
    const { duration } = this.state;
    this.setState({ duration: duration + 1 });
  }

  render() {
    const { camType, recording, navigationFocused } = this.state;
    return (
      <View style={styles.wrapper}>
        <Camera
          style={styles.outerCamera}
          type={camType}
          ratio={VideoConfig.VideoRatio}
          ref={this.setCamRef}
          key={navigationFocused ? 'focused' : 'blurred'}
        >
          <SafeAreaView style={styles.innerCamera}>
            <View style={styles.flipCameraButtonWrapper}>
              <NavButton type="refresh" size={32} dark onPress={this.handleRevertCam} />
            </View>
            <View style={styles.controlButtonWrapper}>
              <NavButton type="film" size={32} dark onPress={this.selectVideo} />
              <RecordButton recording={recording} onPress={this.handleRecord} />
              <NavButton type="forward" size={32} dark onPress={this.checkVideo} />
            </View>
            <View style={styles.progressWrapper}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: this.aniVal.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              >
                <LinearGradient
                  {...Colors.purpleGradient}
                  style={styles.progressBarGradient}
                />
              </Animated.View>
            </View>
          </SafeAreaView>
        </Camera>
        <NavBar dark left="close" onLeft={this.handleBack} ignoreStatusBarHeight />
      </View>
    );
  }
}

const mapStateToProps = ({ appState }) => ({ creatingPost: appState.creatingPost });

const mapDispatchToProps = {
  setPostCreationStatus,
  createPost,
  resumeCreation,
  cancelPostCreation,
  setTempVideo,
  fetchProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoRecorderScreen);
