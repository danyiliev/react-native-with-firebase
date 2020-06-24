import React from 'react';
import { connect } from 'react-redux';
import { TextInput, View, ScrollView } from 'react-native';
import * as _ from 'lodash';

import { Colors, Metrics, Fonts } from '@constants';
import {
  BaseScreen,
  NavBar,
  CaptionText,
  PurpleTransparentButton,
  Avatar,
} from '@components';
import { setPostDetail } from '@actions';

const styles = {
  wrapper: {
    flex: 1,
    marginBottom: Metrics.Normal,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    marginBottom: Metrics.Normal,
  },
  bodyText: {
    marginBottom: Metrics.Large,
  },
  button: {
    height: 40,
  },
  highlight: {
    color: Colors.purple,
  },
  controlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: Fonts.primary,
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'top',
    marginTop: Metrics.Smaller,
    marginLeft: Metrics.Small,
  },
};

class ProductDescription extends BaseScreen {
  state = {
    description: '',
    error: null,
  }

  componentDidMount() {
    const description = _.get(this.props, 'postDetails.description', '');
    this.setState({ description });
  }

  componentDidUpdate(prevProps) {
    const description = _.get(this.props, 'postDetails.description', '');
    if (_.get(prevProps, 'postDetails.description', '') !== description) {
      this.setState({ description });
    }
  }

  handleBack = () => {
    this.props.navigation.goBack();
  }

  handleChange = (description) => {
    this.setState({ description });
  }

  handleNext = () => {
    const { description } = this.state;
    this.props.setPostDetail({ description });
    this.props.navigation.navigate('ProductDetails');
  }

  renderNavigation() {
    return (
      <NavBar left="back" onLeft={this.handleBack} />
    );
  }

  renderContent() {
    const { profileImage } = this.props;
    const { description } = this.state;
    return (
      <View style={{ flex: 1, paddingHorizontal: Metrics.Normal }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          styles={styles.wrapper}
          contentContainerStyle={{ paddingTop: Metrics.Normal }}
          removeClippedSubviews={Platform.OS !== 'ios'}
        >
          <View style={styles.content}>
            <Avatar uri={profileImage} />
            <TextInput
              value={description}
              style={styles.input}
              onChangeText={this.handleChange}
              multiline
              placeholder="Write a video description (and don’t forget to include #tags!)"
              maxLength={250}
              autoFocus
            />
          </View>
        </ScrollView>
        <View style={styles.controlWrapper}>
          <CaptionText color={Colors.mediumGray}>{description.length}/250</CaptionText>
          <PurpleTransparentButton title="Next" height={Metrics.Bigger} onPress={this.handleNext} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  profileImage: _.get(state, 'userProfile.profileImage', null),
  postDetails: _.get(state, 'createPost.postDetails'),
});

const mapDispatchToProps = { setPostDetail };

export default connect(mapStateToProps, mapDispatchToProps)(ProductDescription);
