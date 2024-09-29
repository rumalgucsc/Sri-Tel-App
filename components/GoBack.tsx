import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // Import useRouter

export default function GoBack() {
    const router = useRouter();  // Destructure goBack from useRouter
  return (
    <Pressable onPress={()=> router.back()} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
      <Text style={{ fontSize: 20, marginLeft: 10 }}>Go Back</Text>
    </Pressable>
  )
}