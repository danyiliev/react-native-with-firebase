import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class SettingsScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Settings Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});