import React from 'react';
import { View, Text, FlatList } from 'react-native';

interface Package {
    size: string;
    price: string;
    days: string;
}

interface VerticalScrollContainerProps {
    packages: Package[];
}

const VerticalScrollContainer: React.FC<VerticalScrollContainerProps> = ({ packages }) => {
    return (
        <FlatList
            data={packages}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
                <View
                    className="bg-slate-700 m-2 p-4 rounded-lg"
                    style={{ width: 200 }} // Adjust width as needed
                >
                    <Text className="text-lg font-bold text-white">{item.size}</Text>
                    <Text className="text-lg font-bold text-white">{item.price}</Text>
                    <Text className="text-lg font-bold text-white">{item.description}</Text>
                </View>
            )}
        />
    );
};

export default VerticalScrollContainer;
