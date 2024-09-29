import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import Header from "@/components/Header";
import ImageContainer from "@/components/ImageContainer";
import SmallContainer from "@/components/SmallContainer";
import HorizontalScrollContainer from "@/components/HorizontalScrollContainer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For retrieving the token

export default function Index() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageUrls = [
    "https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg",
    "https://www.vershinin.biz/pictures/960/sacramentum.jpg",
    "https://www.vershinin.biz/pictures/960/sacramentum.jpg",
  ];

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not available');
          return;
        }

        // Make the API request with the token
        const response = await axios.get("http://10.0.2.2:8222/api/v1/service", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(response.data); // Store the services data
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchServices(); // Call the fetch function when component mounts
  }, []);

  return (
    <SafeAreaView>
      <Header />
      <View className="mt-4">
        <ImageContainer imageUrls={imageUrls} />
        <Text className="ml-2 font-bold">Quick Actions</Text>
        <View className="flex-row mt-2 items-center justify-center">
          <View className="p-1">
            <SmallContainer title="Balance" route="balance" icon="chart-pie" />
          </View>
          <View className="p-1">
            <SmallContainer title="Addons" route="/CustomerData/addons" icon="archive" />
          </View>
          <View className="p-1">
            <SmallContainer title="History" route="topup" icon="history" />
          </View>
        </View>
        <Text className="ml-2 font-bold mt-2">Featured Packages</Text>
      </View>

      <View className="mt-2">
        {loading ? (
          <Text>Loading services...</Text>
        ) : (
          <HorizontalScrollContainer
            packages={services.map(service => ({
              size: service.serviceName,
              price: `Rs. ${service.price}`,
              description: service.description, // You can pass more details if required
            }))}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
