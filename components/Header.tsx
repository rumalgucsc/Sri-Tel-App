import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [userDetails, setUserDetails] = useState({
    given_name: '',
    Sritel_No: '',
  });

  useEffect(() => {
    const getUserToken = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (token !== null) {
          // Decode the token
          const decoded = jwtDecode(token);
          console.log('Decoded JWT:', decoded);
          // Set the decoded details in state
          setUserDetails({
            given_name: decoded.given_name,
            Sritel_No: decoded.Sritel_No,
          });
        }
      } catch (error) {
        console.error('Failed to load user token:', error);
      }
    };

    getUserToken();
  }, []);

  return (
    <SafeAreaView className="mt-14">
      <View className="flex-row">
        {/* Image Section (optional) */}
        {/* <Image
            source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600' }}
            className="w-14 h-14 rounded-full ml-2"
        /> */}
        <View className="flex-col">
          <Text className="text-sm font-bold ml-1 top-1">
            {userDetails.Sritel_No}
          </Text>
          <Text className="flex-col text-25 text-gray-700 ml-1">
            {userDetails.given_name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
