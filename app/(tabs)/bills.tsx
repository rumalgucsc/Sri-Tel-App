import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import Bill from "@/components/Bill";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library

// Main Bills component
export default function Bills() {
  const [selectedOption, setSelectedOption] = useState("Bill Summary");
  const [bills, setBills] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const getBills = async () => {
    console.log("Fetching bills...");
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token from AsyncStorage
      if (!token) {
        console.error("Token not available");
        setRefreshing(false);
        return;
      }

      // Decode the token to extract the user ID (Sritel_No)
      const decoded = jwtDecode(token);
      const userId = decoded.Sritel_No; // This is the user ID from the token
      console.log("Decoded User ID:", userId);

      // Make an API call to fetch bills for the specific user
      const response = await axios.get(`http://10.0.2.2:8222/api/v1/billing/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data); // Store fetched bills in state
      console.log("Fetched bills:", response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setRefreshing(false); // Always stop the refresh animation
    }
  };

  useEffect(() => {
    getBills(); // Fetch bills when component mounts
  }, []);

  const onRefresh = () => {
    getBills(); // Refresh the list of bills
  };

  return (
    <SafeAreaView className="mt-11 justify-center">
      <Text className="text-center text-3xl">Bills</Text>
      <View className="flex-row justify-center">
        <TouchableOpacity
          onPress={() => setSelectedOption("Bill Summary")}
          className={`p-4 text-center text-lg rounded-3xl ${selectedOption === "Bill Summary" ? "bg-blue-500 text-white" : "border-2 border-blue-500 text-blue-500 bg-white"}`}
        >
          <Text>Bill Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedOption("Bill History")}
          className={`p-4 text-center text-lg rounded-3xl ${selectedOption === "Bill History" ? "bg-blue-500 text-white" : "border-2 border-blue-500 text-blue-500 bg-white"}`}
        >
          <Text>Bill History</Text>
        </TouchableOpacity>
      </View>

      {selectedOption === "Bill Summary" && (
        <FlatList
          className="p-1 h-6/7"
          data={bills.filter(bill => bill.status.toLowerCase() === "pending")}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '../Bills/PayBill',
                params: { billId: item.id, amount: item.amount } // Pass billId and amount as query parameters
              })}
            >
              <Bill
                id={item.id}
                amount={item.amount}
                invoiceNumber={item.invoiceNumber}
                status={item.status}
                billingDate={item.billingDate}
                dueDate={item.dueDate}
              />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
      {selectedOption === "Bill History"  && (
        <FlatList
          className="p-1 h-6/7"
          data={bills.filter(bill => bill.status.toLowerCase() === "paid")}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Bill
                id={item.id}
                amount={item.amount}
                invoiceNumber={item.invoiceNumber}
                status={item.status}
                billingDate={item.billingDate}
                dueDate={item.dueDate}
              />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
