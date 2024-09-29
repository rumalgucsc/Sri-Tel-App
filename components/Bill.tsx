import * as React from 'react';
import { View, Text } from 'react-native';

interface BillProps {
  id: number;
  amount: number;
  invoiceNumber: string;
  status: string;
  billingDate: string;
  dueDate: string;
}

const Bill: React.FunctionComponent<BillProps> = ({ id, amount, invoiceNumber, status, billingDate, dueDate }) => {
  return (
    <View className="bg-gray-300 rounded-lg p-4 m-4">
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xl font-bold">Invoice #{invoiceNumber}</Text>
          <Text className="text-sm text-gray-700">Billing Date: {billingDate}</Text>
          <Text className="text-sm text-gray-700">Due Date: {dueDate}</Text>
        </View>
        <View>
          <Text className="text-xl font-bold">LKR{amount.toFixed(2)}</Text>
          <Text className="text-sm">{status}</Text>
        </View>
      </View>
    </View>
  );
};

export default Bill;
