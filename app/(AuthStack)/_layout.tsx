import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
   <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" />
    <Stack.Screen name="SignUp"  />
    <Stack.Screen name="ResetPassword"  />
    <Stack.Screen name="VerifyOTP" />
    </Stack>
  )
}