import React from "react";
import { Video } from 'expo-av';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, LayoutAnimation, ActivityIndicator } from "react-native";
import { TransitionPresets } from "react-navigation-stack";
import { Feather } from "@expo/vector-icons";

export default class PostScreen extends React.Component {
    state = {
        item: this.props.navigation.getParam('item')
    };

    constructor(props) {
        super(props);
    } 

    componentDidMount() {

    }

    static navigationOptions = {
        ...TransitionPresets.ModalPresentationIOS,
    };


    render() {
        const post = this.state.item;
        LayoutAnimation.easeInEaseOut();

        if (post) { 
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.back}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack() }>
                            <Feather name="arrow-left" color="#000000" size={26} />
                        </TouchableOpacity>
                    </View>
                    <Video
                        ref={ref => { this.video = ref; }}
                        source={{ uri: post.video480 }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay={true}
                        isLooping
                        style={{ 
                            backgroundColor: "#ffffff",
                            width: '100%', 
                            height: '100%', 
                        }}
                    />
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator size="large" color="#E954C5" />
                </SafeAreaView>);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    back: {
        top: 50,
        left: 50,
        position: 'absolute',
    },

});