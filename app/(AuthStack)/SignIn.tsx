import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
const SignInScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const storeToken = async (token:string) => {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (e) {
      console.error('Saving token failed');
    }
  };

  const handleLogin = async () => {
    const keycloakUrl = 'https://keycloak.raviyax.site/realms/sritel/protocol/openid-connect/token';
    const clientId = 'next-js'; // Your Keycloak client ID
    const client_secret = 'POMBGjPYLkFSYlCGXSgExKQnHrxve4rV'

    const details = {
      client_id: clientId,
      client_secret: client_secret,
      username: username,
      password: password,
      grant_type: 'password'
    };

    const formBody = Object.entries(details)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    try {
      const response = await axios.post(keycloakUrl, formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      // Save token to storage or state
      console.log('Token:', response.data.access_token);
      storeToken(response.data.access_token);
      Alert.alert("Login Successful", "You are now logged in.");
      router.replace("/(tabs)/");
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert("Login Failed", "Check your credentials and try again.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-semibold mb-6 text-blue-600">Sign-In</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        className="w-full h-12 px-4 mb-4 bg-gray-100 rounded-lg border border-gray-300"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="w-full h-12 px-4 mb-6 bg-gray-100 rounded-lg border border-gray-300"
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center"
      >
        <Text className="text-white text-lg font-medium">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
