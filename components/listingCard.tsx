import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Heart } from "lucide-react-native";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  image: string;
  dateRange: string;
  title: string;
  description: string;
  beds: string;
  rating: number;
  reviews: number;
  price: string;
  nights: string;
};

export function ListingCard({
  image,
  dateRange,
  title,
  description,
  beds,
  rating,
  reviews,
  price,
  nights,
}: ListingCardProps) {
  return (
    <Card className="p-0 overflow-hidden">
      {/* Image Section */}
      <View className="relative">
        <Image source={{ uri: image }} className="w-full h-48" />
        <TouchableOpacity className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
          <Heart size={18} color="black" />
        </TouchableOpacity>
      </View>

      {/* Date */}
      <CardHeader className="flex-row justify-between items-center px-4 pt-3">
        <Text className="text-xs bg-black/80 text-white px-2 py-0.5 rounded">
          {dateRange}
        </Text>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 pt-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Text className="text-sm text-gray-600 mt-1">{description}</Text>
        <CardDescription className="mt-1">{beds}</CardDescription>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-row justify-between items-center px-4 pb-3">
        <Text className="text-sm">⭐ {rating} ({reviews})</Text>
        <View className="flex-col items-end">
          <Text className="font-semibold">{price}</Text>
          <Text className="text-xs text-gray-500">{nights}</Text>
        </View>
      </CardFooter>
    </Card>
  );
}
