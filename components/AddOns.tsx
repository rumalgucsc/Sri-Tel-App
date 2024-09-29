import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, Button, Switch, RefreshControl, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Ensure correct JWT import
import { useNavigation } from "expo-router";

// Main AddOns component
export default function AddOns() {
  const [allServices, setAllServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleStatuses, setToggleStatuses] = useState({}); // Store toggle statuses for each service
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: "Addons", // Set your custom title here
    });
  }, [navigation]);

  // Function to fetch both all services and user-specific services
  const getServices = async () => {
    console.log("Fetching services...");
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("userToken"); // Get the user token from AsyncStorage
      if (!token) {
        console.error("Token not available");
        setRefreshing(false);
        return;
      }

      // Decode the token to get the user ID (Sritel_No)
      const decoded = jwtDecode(token);
      const userId = decoded.Sritel_No;

      // Fetch all services
      const allServicesResponse = await axios.get("http://10.0.2.2:8222/api/v1/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allServicesData = allServicesResponse.data;

      // Fetch user-specific services
      const userServicesResponse = await axios.get(`http://10.0.2.2:8222/api/v1/service/getServicesByUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userServicesData = userServicesResponse.data;

      // Initialize toggle states for user-specific services
      const initialToggleStatuses = {};
      userServicesData.forEach((service) => {
        initialToggleStatuses[service.serviceId] = service.serviceStatus === "ACTIVE";
      });

      setAllServices(allServicesData);
      setUserServices(userServicesData);
      setToggleStatuses(initialToggleStatuses);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setRefreshing(false); // Stop the refresh animation
    }
  };

  // Function to add a new service for the user
  const addService = async (serviceId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.error("Token not available");
        return;
      }

      // Decode the token to get the user ID (Sritel_No)
      const decoded = jwtDecode(token);
      const userId = decoded.Sritel_No;

      // Send a POST request to add the service with status "ACTIVE"
      await axios.post(
        "http://10.0.2.2:8222/api/v1/service/addCustomerService",
        {
          customerId: userId,
          serviceId: serviceId,
          serviceStatus: "ACTIVE", // Set the status to ACTIVE
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Service added and activated successfully!");
      getServices(); // Refresh services after adding a new service
    } catch (error) {
      console.error("Error adding service:", error);
      Alert.alert("Error", "Failed to add service.");
    }
  };

  // Function to update an existing service's status
  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      // Update toggle state in UI
      const updatedToggleStatuses = { ...toggleStatuses, [serviceId]: !currentStatus };
      setToggleStatuses(updatedToggleStatuses);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.error("Token not available");
        return;
      }

      // Decode the token to get the user ID (Sritel_No)
      const decoded = jwtDecode(token);
      const userId = decoded.Sritel_No;

      // Send a PATCH request to update the service status
      const newStatus = !currentStatus ? "ACTIVE" : "INACTIVE";
      await axios.patch(
        "http://10.0.2.2:8222/api/v1/service/updateCustomerService",
        {
          customerId: userId,
          serviceId: serviceId,
          serviceStatus: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", `Service ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully!`);
      getServices(); // Refresh services after updating
    } catch (error) {
      console.error("Error updating service status:", error);
      Alert.alert("Error", "Failed to update service.");
    }
  };

  // Get the services that are not yet activated or deactivated by the user
  const inactiveServices = allServices.filter(
    (service) => !userServices.some((userService) => userService.serviceId === service.id)
  );

  useEffect(() => {
    getServices(); // Fetch services when component mounts
  }, []);

  const onRefresh = () => {
    getServices(); // Refresh the list of services
  };

  return (
    <SafeAreaView className="mt-11 justify-center">
      <Text className="text-center text-3xl">AddOns</Text>

      <Text className="text-center text-2xl mt-4">Add New Services</Text>
      {inactiveServices.length === 0 ? ( // Conditional rendering if no new services
        <Text className="text-center text-gray-500 mt-4">No new services available</Text>
      ) : (
        <FlatList
          className="p-1 h-6/7"
          data={inactiveServices} // Show services not activated or deactivated by the user
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <View>
                <Text className="text-lg font-bold">{item.serviceName}</Text>
                <Text className="text-gray-500">{item.description}</Text>
                <Text className="text-gray-500">Price: Rs. {item.price}</Text>
              </View>
              <Button
                title="Add"
                onPress={() => addService(item.id)}
                color="#28a745" // Customize button color
              />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <Text className="text-center text-2xl mt-4">Manage Activated Services</Text>
      <FlatList
        className="p-2 h-28 m-1"
        data={userServices} // Show services already activated or deactivated by the user
        keyExtractor={(item) => item.serviceId.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-lg font-bold">{item.serviceName}</Text>
              <Text className="text-gray-500">Status: {item.serviceStatus}</Text>
            </View>
            <Switch
              value={toggleStatuses[item.serviceId]} // Set the switch value based on current status
              onValueChange={() => toggleServiceStatus(item.serviceId, toggleStatuses[item.serviceId])}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
