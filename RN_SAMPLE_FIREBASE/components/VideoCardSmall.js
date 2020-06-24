import React from "react";
import { Video } from 'expo-av';
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default class VideoCardSmall extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            item: this.props.item
        }
    };

    componentDidMount() {
    };

    render() {
        const post = this.state.item;
        return (
            <TouchableOpacity activeOpacity={0.85} onPress={() => this.props.navigation.navigate("Post", { item: post })}>
                <View style={styles.card}>
                        <Video
                            ref={(component) => { 
                                this.video = component;
                            }}
                            source={{ uri: post.videoClip }}
                            rate={1.0}
                            volume={0}
                            isMuted={true}
                            resizeMode="cover"
                            shouldPlay={true}
                            isLooping
                            style={styles.video}
                        />
                    

                    <View style={styles.postDetails}>
                        <Image source={{uri: post.userAvatar }} style={styles.postDetailsAvatar} />
                        <View style={{ marginLeft: 6, marginTop: 2 }}>
                            <Text style={styles.postDetailsUsername}>@{post.username}</Text>
                            <Text style={styles.postDetailsDescription}>{post.description}</Text>
                        </View>
                    </View>

                    <View style={styles.productDetails} >
                        <Feather style={styles.productDetailsIcon} name="tag" size={18} />
                        <Text style={styles.productDetailsText}>{post.title}</Text>
                        <Text style={styles.priceButtonText}>${post.price}</Text>
                    </View> 
                </View>
            </TouchableOpacity>
        )
    };
}

const styles = StyleSheet.create({
    card: {
        elevation: 10,
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 12,
        borderRadius: 16, 
        position: 'relative',
        marginVertical: 16,
        marginHorizontal: 12,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: '#000000',
        shadowOpacity: 0.35,
        shadowRadius: 3,
        width: 308,
        height: 520,
    },
    video: {
        backgroundColor: "#f0f0f0",
        width: 284, 
        height: 425, 
        borderRadius: 16, 
        marginBottom: 0, 
        borderColor: '#fff', 
    },
    postDetails: {
        flex: 1,
        flexDirection: 'row',
        top: 10,
        width: '100%'
    },
    postDetailsAvatar: {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderRadius: 40,
        height: 48,
        width: 48
    },
    postDetailsUsername: {
        color: '#000000',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 4
    },
    postDetailsDescription: {
        color: '#000',
        fontSize: 15,
    },
    productDetails: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        bottom: 86,
        height: 42,
        marginHorizontal: 12,
        position: 'absolute',
        alignContent: 'space-around',
        flexDirection: 'row',
        width: 260 
    },
    productDetailsIcon: {
        color: '#14CB94',
        height: 42,
        marginLeft: 10,
        lineHeight: 42
    },
    productDetailsText: {
        fontSize: 15,
        height: 42,
        lineHeight: 42,
        marginLeft: 4,
        width: 'auto'
    },
    priceButtonText: {
        fontSize: 14,
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 12,
        color: '#46D666',
        height: 42,
        lineHeight: 42,
        fontWeight: 'bold'
    }
});