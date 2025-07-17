import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab2Screen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="mb-6 px-4 pt-4">
          <Text>Tab 2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
