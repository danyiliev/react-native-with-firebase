import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  UIManager,
  Platform,
} from 'react-native';
import { Colors } from '@constants';
import { VideoCard } from '@components';
import { connect } from 'react-redux';

const COUNT_PER_PAGE = 10;
const FEED_URL = `https://api.shopcam.tv/feed?size=${COUNT_PER_PAGE}`;

class HomeScreen extends React.PureComponent {
  state = {
    data: [],
    isFetching: false,
    currentPage: 0,
    hasMore: true,
  }

  constructor(props) {
    super(props);
    this.bs = React.createRef();

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 51, // this setting seems to work better on Android and iOS
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.getFeed();
  }

  async getFeed() {
    try {
      const { user } = this.props;
      const { userId } = user || {};
      let apiUrl = `${FEED_URL}&page=1`;
      if (userId) {
        apiUrl = `${apiUrl}&id=${userId}`;
      }

      this.setState({ data: [] });

      const response = await fetch(apiUrl);
      const responseJson = await response.json();

      this.setState({
        data: responseJson,
        currentPage: 1,
        hasMore: responseJson.length === COUNT_PER_PAGE,
        isFetching: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  handleRefresh() {
    this.setState({ isFetching: true }, this.getFeed);
  }

  handleToggle = (cardKey) => {
    const { currentPlayingKey } = this.state;
    this.setState({ currentPlayingKey: currentPlayingKey ? null : cardKey });
  }

  async loadMore() {
    try {
      const { user } = this.props;
      const { currentPage, data } = this.state;
      const { userId } = user || {};
      let apiUrl = `${FEED_URL}&page=${currentPage + 1}`;
      // let apiUrl = `${FEED_URL}&page=${(currentPage % 2) + 1}`;
      if (userId) {
        apiUrl = `${apiUrl}&id=${userId}`;
      }

      this.setState({ isLoadingMore: true });

      const response = await fetch(apiUrl);
      const responseJson = await response.json();
      this.setState({
        data: [...data, ...responseJson],
        currentPage: currentPage + 1,
        hasMore: responseJson.length === COUNT_PER_PAGE,
        isLoadingMore: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  _renderItem = ({ item, index }) => {
    const { currentPlayingKey } = this.state;
    const key = this.keyExtractor(item, index);
    return (
      <VideoCard
        navigation={this.props.navigation}
        post={item}
        {...item}
        currentPlayingKey={currentPlayingKey}
        cardKey={key}
        onToggle={this.handleToggle}
      />
    );
  }

  keyExtractor = (item, index) => `${index}-${item.id}`

  handleViewableItemsChanged = (props) => {
    const { hasMore, currentPage, isLoadingMore } = this.state;
    const { changed } = props;
    changed.forEach((item) => {
      const key = this.keyExtractor(item.item, item.index);
      if (item.isViewable) {
        this.setState({ currentPlayingKey: key });

        // smooth pagination, if first item in current group(page) is opened, load next page
        if (hasMore && !isLoadingMore && item.index >= (currentPage - 1) * COUNT_PER_PAGE) {
          this.loadMore();
        }
      }
    });
  }

  renderContent = () => <Text>aaaaa</Text>

  renderHeader = () => {
    /* render */
  }

  render() {
    const { data, isFetching, currentPlayingKey } = this.state;
    // LayoutAnimation.easeInEaseOut();
    return (
      <SafeAreaView style={styles.container}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            onViewableItemsChanged={this.handleViewableItemsChanged}
            horizontal
            showsHorizontalScrollIndicator={false}
            // snapToAlignment="center"
            snapToInterval={Dimensions.get('window').width}
            decelerationRate={Platform.OS === 'android' ? 0.90 : 'fast'} // this setting seems to work better on Android
            disableIntervalMomentum
            pagingEnabled={false}
            onRefresh={this.handleRefresh}
            refreshing={isFetching}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={3}
            viewabilityConfig={this.viewabilityConfig}
            getItemLayout={(data, index) => (
              { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
            )}
            renderItem={this._renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={this.keyExtractor}
            extraData={currentPlayingKey}
          />
          ) : (
            <View style={styles.card}>
              <ActivityIndicator style={styles.spinner} color={Colors.purple} size="large" /> 
            </View>
          )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lightGray,
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
  spinner: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    top: '42%',
  },
  container: {
    paddingTop: 24,
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
});

const mapStateToProps = ({ auth }) => ({
  user: auth.credentials.user,
});

export default connect(mapStateToProps)(HomeScreen);
