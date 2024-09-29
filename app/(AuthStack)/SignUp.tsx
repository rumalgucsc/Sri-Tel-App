// SignInScreen.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const SignUpScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-semibold mb-6 text-blue-600"adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Sign-Up</Text>

      <TextInput
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        className="w-full h-12 px-4 mb-4 bg-gray-100 rounded-lg border border-gray-300"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        className="w-full h-12 px-4 mb-6 bg-gray-100 rounded-lg border border-gray-300"
      />
      <TextInput
        placeholder="Retype Password"
        secureTextEntry
        className="w-full h-12 px-4 mb-6 bg-gray-100 rounded-lg border border-gray-300"
      />

      <TouchableOpacity className="w-full h-12 bg-blue-600 rounded-lg justify-center items-center">
        <Text className="text-white text-lg font-medium"adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Sign Up</Text>
      </TouchableOpacity>
      
      <View className="flex-row w-full justify-center">
        <Text className="text-gray-400 mt-2"adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Already have an account? </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 w-12 mt-2 "adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Sign In</Text>
        </TouchableOpacity>
        </View>
      
    </View>
   
    
  );
};

export default SignUpScreen;
