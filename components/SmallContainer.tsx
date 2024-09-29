import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
interface SmallContainerProps {
    title: string;
    route: string;
    icon: string;
}
// export default function SmallContainer() {
//   return (
//     <View className='p-10 bg-gray-200 w-44 rounded-3xl items-center'>
//         <Text className='text-xl font-bold text-black top-4 '>Balance</Text>
//     </View>
//   )
// }
const SmallContainer: React.FC<SmallContainerProps> = ({ title, route, icon }) => {
    const router = useRouter();
    return (
        <TouchableOpacity
        onPress={() => router.push(route)}
        
      >
        <View className='p-7 bg-gray-200 w-30 rounded-3xl items-center'>
            <FontAwesome5 name={icon} size={32} color="black" />
            <Text className='text-xl font-bold text-black top-4 '>{title}</Text>
        </View>
        </TouchableOpacity>
    )
};

export default SmallContainer;