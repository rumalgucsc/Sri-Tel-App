import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams and useNavigation
import axios from "axios"; // Import axios for the PATCH request
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function PayBill() {
  const navigation = useNavigation();
  const { billId, amount: initialAmount } = useLocalSearchParams(); // Get billId and amount from query params
  const [amount, setAmount] = useState(initialAmount || ""); // Initialize amount with the passed value
  const [cardnumber, setCardnumber] = useState(""); 
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const router = useRouter();

  const handleCardInput = (text) => {
    let formattedText = text.replace(/\D/g, "");
    if (formattedText.length > 16) {
      formattedText = formattedText.substring(0, 16);
    }
    formattedText = formattedText.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardnumber(formattedText);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Pay Your Bill", // No billId in the title
    });
  }, [navigation]);

  const validateFields = () => {
    if (!amount || !cardnumber || !expMonth || !expYear || !cvv) {
      Alert.alert("Error", "Please fill all the fields");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (validateFields()) {
      try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert("Error", "User token is missing.");
          return;
        }
  
        // Send a PATCH request to update payment status
        const response = await axios.patch(
          `http://10.0.2.2:8222/api/v1/billing/updatePayment/${billId}`,
          {}, // Body of the request, empty for this PATCH request
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("billId:", billId);
  
        if (response.status === 200) {
          // Payment was successful, show success alert
          Alert.alert("Payment Successful", `Amount Paid: Rs. ${amount}`);
  
          // Navigate back to the index (Bills list) after successful payment
          router.push('/(tabs)'); // This will navigate back to the main Bills screen
        } else {
          // Handle unsuccessful payment
          Alert.alert("Payment Failed", "Failed to update the payment status. Please try again.");
        }
      } catch (error) {
        console.error("Payment error:", error);
        Alert.alert("Payment Failed", "An error occurred during the payment process.");
      }
    }
  };

  return (
    <View className="justify-items-start ml-3 w- mr-3">
      <Text className="font-semibold mb-2 text-base">Pay Amount</Text>
      <View className="flex-row items-center border-gray-300 rounded-lg bg-white w-96 h-12">
        <Text className="ml-3 text-gray-500">Rs.</Text>
        <TextInput
          placeholder="0.00"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
          className="flex-1 h-full px-2 bg-transparent"
        />
      </View>

      <Text className="mt-2 font-semibold mb-2 text-base">Card Number</Text>
      <View className="flex-row items-center border-gray-300 rounded-lg bg-white w-96 h-12">
        <TextInput
          placeholder="0000 0000 0000 0000"
          value={cardnumber}
          onChangeText={handleCardInput}
          keyboardType="numeric"
          className="flex-1 h-full px-2 bg-transparent"
          maxLength={19}
        />
      </View>

      <Text className="font-semibold mb-2 text-base">Exp Month/Year             CVV</Text>
      <View className="flex-row items-center">
        <TextInput
          placeholder="MM"
          value={expMonth}
          onChangeText={setExpMonth}
          keyboardType="numeric"
          maxLength={2}
          className="w-16 h-12 text-center border border-gray-300 rounded-lg bg-white mr-1"
        />
        <Text className="text-xl text-gray-400">/</Text>
        <TextInput
          placeholder="YY"
          value={expYear}
          onChangeText={setExpYear}
          keyboardType="numeric"
          maxLength={2}
          className="w-16 h-12 text-center border border-gray-300 rounded-lg bg-white ml-1"
        />
        <TextInput
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={3}
          className="w-16 h-12 text-center border border-gray-300 rounded-lg bg-white ml-5"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-3xl mt-2 items-center w-full"
        onPress={handlePayment}
      >
        <Text className="font-bold text-white">Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}
