import { useEffect, useState } from "react";
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
import { toggleFavorite, isFavorite } from "@/utils/favorites";

type ListingCardProps = {
  id: string;
  image: string;
  title: string;
  description: string;
  beds: string;
  rating: number;
  reviews: number;
  pricePerNight: string;
  type: string;
  location: string;
  filters: string[];
};

export function ListingCard({
  id,
  image,
  title,
  description,
  beds,
  rating,
  reviews,
  pricePerNight,
  type,
  location,
  filters,
}: ListingCardProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      isFavorite(id).then(setFavorited);
    }
  }, [id]);

  const handleFavorite = async () => {
    const result = await toggleFavorite(id);
    setFavorited(result);
  };

  return (
    <Card className="p-0 overflow-hidden shadow-md">
      {/* Image Section */}
      <View className="relative">
        <Image source={{ uri: image }} className="w-full h-48" />
        <TouchableOpacity
          onPress={handleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
        >
          <Heart size={18} color={favorited ? "red" : "black"} fill={favorited ? "red" : "none"} />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <CardHeader className="px-4 pt-3">
        <Text className="text-xs text-gray-500">{location}</Text>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 pt-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Text className="text-sm text-gray-600 mt-1">{description}</Text>
        <CardDescription className="mt-1">
          {beds} · {type}
        </CardDescription>

        {/* Filters */}
        <View className="flex-row flex-wrap mt-2">
          {filters.map((filter, index) => (
            <Text
              key={index}
              className="text-xs bg-gray-200 rounded px-2 py-0.5 mr-1 mb-1"
            >
              {filter}
            </Text>
          ))}
        </View>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-row justify-between items-center px-4 pb-3">
        <Text className="text-sm">⭐ {rating} ({reviews})</Text>
        <View className="flex-col items-end">
          <Text className="font-semibold">{pricePerNight}</Text>
        </View>
      </CardFooter>
    </Card>
  );
}
