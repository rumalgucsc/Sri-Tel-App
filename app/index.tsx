import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Token removed');
    } catch (error) {
      console.error('Error removing token', error);
    }
  };
  removeToken();
}, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();
          if (!isExpired) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
      setIsChecking(false);
    };

    checkToken();
  }, []);

  if (isChecking) {
    return null; // Or some loading component
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/" />;
  } else {
    return <Redirect href="/(AuthStack)/SignIn" />;
  }
}
