import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const VerifyOTP: React.FC = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);

    // Define the ref with proper typing
    const inputs = useRef<(TextInput | null)[]>([null, null, null, null]);

    const focusNext = (index: number, value: string) => {
        if (index < 3 && value) {
            inputs.current[index + 1]?.focus();
        }
        if (index === 3) {
            inputs.current[index]?.blur();
        }
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const focusPrev = (key: string, index: number) => {
        if (key === 'Backspace' && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="mb-5 text-lg text-blue-500 font-bold" adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Enter OTP</Text>
            <View className="flex-row">
                {Array.from({ length: 4 }).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={el => inputs.current[index] = el}
                        className="bg-gray-200 h-10 w-10 text-center mx-1.5 rounded"
                        value={otp[index]}
                        onChangeText={value => focusNext(index, value)}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Backspace') {
                                focusPrev(nativeEvent.key, index);
                            }
                        }}
                        maxLength={1}
                        keyboardType="numeric"
                    />
                ))}
            </View>
            <TouchableOpacity className="mt-5 bg-blue-500 px-10 py-3 rounded" >
                <Text className="text-white text-lg" adjustsFontSizeToFit={true} numberOfLines={2} ellipsizeMode="tail">Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyOTP;
