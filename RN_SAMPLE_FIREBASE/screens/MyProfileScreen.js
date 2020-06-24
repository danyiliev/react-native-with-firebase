import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation, ActivityIndicator, ToastAndroid, FlatList, Dimensions, Platform, Share } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as firebase from "firebase";
import { ProfileHeader, VideoCardSmall } from '@components';

export default class ProfileScreen extends React.Component {
    state = {
        data: [],
        isFetching: false,
        user: ""
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            let user = firebase.auth().currentUser;
            if (user) {
                this.setState({ user: user });
                this.getPosts();
                this.focusListener.remove();
            } else {
                this.props.navigation.navigate("Login");
            }
        });

        // mostly used for when the user logs out
        firebase.auth().onAuthStateChanged(user => {
            if( !firebase.auth().currentUser ){
                this.props.navigation.navigate("Login");
            }
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    getPosts = async () => {
        try {
            let response = await fetch('https://api.shopcam.tv/user/posts?id=' + firebase.auth().currentUser.uid);
            let responseJson = await response.json();
            this.setState({ data: responseJson });
            this.setState({ isFetching: false });
        } catch (error) {
            console.error(error);
        }
    };

    signOutUser = () => {
        firebase.auth().signOut();
        ToastAndroid.show('Logged out', ToastAndroid.SHORT);
        this.props.navigation.navigate("Login");
    };

    _onRefresh() {
        this.setState({ isFetching: true }, function() { this.getPosts() });
    }

    _ListHeaderComponent = (item) => {
        return (
            <ProfileHeader item={{ item }} />
        );
    };

    _renderItem = (item) => {
        return ( <VideoCardSmall navigation={this.props.navigation} item={item} key={item.postId} /> );
    }

    render() {
        const user = this.state.user;
        LayoutAnimation.easeInEaseOut();
  
        if (this.state.data.length > 0) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.settings}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings') }>
                                <Feather name="settings" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <FlatList 
                      keyExtractor={post => post.postId}
                      data={this.state.data}
                      showsVerticalScrollIndicator={false}
                      ListHeaderComponent={({ item }) => ( this._ListHeaderComponent(item) )}
                      renderItem={({ item }) => ( this._renderItem(item) )}
                      contentContainerStyle = {{ alignItems: 'center', paddingBottom: 50 }}
                      style={styles.flatlist}
                      onRefresh={() => this._onRefresh()}
                      refreshing={this.state.isFetching}
                      showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
            );
        } else {
            return (<SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#E954C5" /></SafeAreaView>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: Dimensions.get('window').width
    },
    header: {
        backgroundColor: '#ffffff',
        height: 50,
        width: '100%'
    },
    settings: {
        top: 16,
        right: 16,
        position: 'absolute'
    },
    share: {
        top: 16,
        right: 16,
        position: 'absolute'
    },
    flatlist: {
        marginBottom: 70,
        width: Dimensions.get('window').width
    },
    profileHeader: {
        alignItems: 'center',
        width: Dimensions.get('window').width
    },
    profileAvatar: {
        backgroundColor: '#f0f0f0',
        borderRadius: 124,
        borderWidth: 5,
        borderColor: '#ffffff',
        elevation: 8,
        height: 124,
        marginBottom: 12,
        marginTop: 50,
        shadowOffset: { width: 0, height: 3 },
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 3,
        width: 124
    },
    profileAvatarImage: {
        borderRadius: 124,
        height: '100%',
        width: '100%'
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bio: {
        fontSize: 18,
        marginBottom: 16
    },
    stats: {
        flexDirection: 'row',
        marginBottom: 16,
        width: 360
    },
    statContainer: {
        width: '33.33%'
    },  
    statLarge: {
        fontSize: 20, 
        fontWeight: 'bold',
        textAlign: 'center'
    },
    statLabel: {
        textAlign: 'center'
    },
    primaryButton: {
        borderRadius: 8, 
        paddingVertical: 8,
        marginBottom: 16,
        width: 200,
    },
    primaryButtonText: {
        color: '#fff', 
        fontSize: 15,
        fontWeight: 'bold', 
        textAlign: 'center', 
        width: '100%'
    }
});