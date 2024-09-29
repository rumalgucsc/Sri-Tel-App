import React from 'react';
import { View, Image, ScrollView, Dimensions } from 'react-native';
import 'nativewind';

interface ImageContainerProps {
  imageUrls: string[];
}

const ImageContainer: React.FC<ImageContainerProps> = ({ imageUrls }) => {
  

  return (
    <ScrollView
      horizontal
      pagingEnabled={false} // Disable fixed paging to allow free scrolling
      showsHorizontalScrollIndicator={false}
       // Use NativeWind for background color
      style={{
        height: 200, // Adjust height to fit content
      }}
      contentContainerStyle={{
        paddingHorizontal: 10 // Adds padding to the start and end of the ScrollView
      }}
    >
      {imageUrls.map((url, index) => (
        <View key={index} style={{ marginRight: 20 }}>
          <Image
            source={{ uri: url }}
             // Use NativeWind to set width and height
             className='rounded-3xl'
            style={{
              width: 400, // Adjust width to be less than the screen width to show part of next image
              height: 160, // Adjust height as needed
              resizeMode: 'cover' // Ensure the image covers the set dimensions without stretching
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default ImageContainer;
