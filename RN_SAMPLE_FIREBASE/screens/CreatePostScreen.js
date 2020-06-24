import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class CreatePostScreen extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Create post</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});