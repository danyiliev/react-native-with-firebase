import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import * as firebase from "firebase";

export default class RegisterScreen extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        errorMessage: null
    };

    handleSignUp = () => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredentials => {
                return userCredentials.user.updateProfile({
                    displayName: this.state.name
                });
                saveAdditionalInformation();
            })
            .catch(error => 
                this.setState({ errorMessage: error.message })
            );
    };

    saveAdditionalInformation = async () => {
        return new Promise((res, rej) => {
            this.firestore
                .collection("users")
                .add({
                    email: this.state.email,
                    updated: this.timestamp,
                    created: this.timestamp
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    timestamp() {
        return Date.now();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>

                    <View>
                        <Text style={styles.inputTitle}>email*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>username*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            autoCapitalize="none"
                            onChangeText={username => this.setState({ username })}
                            value={this.state.username}
                        ></TextInput>
                    </View>

                    <View style={{ marginTop: 32 }}>
                        <Text style={styles.inputTitle}>password*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="******"
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <Text style={{ fontSize: 10, marginHorizontal: 20, marginBottom: 20 }}>By signing up, you agree to Shopcam's terms and confirm that you have read our privacy policy and content policy.</Text>

                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{ color: "#FFF", fontWeight: "500" }}>Create account</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 20
    },
    inputTitle: {
        color: "#808285",
        fontSize: 12, 
        textTransform: "lowercase"
    },
    input: {
        borderBottomColor: "#808285",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    button: {
        marginHorizontal: 20,
        backgroundColor: "#E9446A",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    }
});