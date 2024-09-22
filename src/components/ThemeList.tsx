import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Icon,
  Alert,
  Pressable,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAllRows, runQuery } from "../database/Database";
import { Theme } from "../styles/Theme";

interface ThemeListProps {
  onEdit: (theme: { id: number; name: string }) => void;
}

export const ThemeList: React.FC<ThemeListProps> = ({ onEdit }) => {
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchThemes = async () => {
    try {
      const result = await getAllRows("SELECT * FROM themes");
      setThemes(result as { id: number; name: string }[]);
    } catch (error) {
      setMessage("Error fetching themes");
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleDeleteTheme = async (id: number) => {
    try {
      await runQuery("DELETE FROM themes WHERE id = ?", [id]);
      fetchThemes();
    } catch (error) {
      setMessage("Error deleting theme");
    }
  };

  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <Pressable>
      <Box
        p={4}
        bg={Theme.colors.secondary}
        borderRadius="lg"
        shadow={3}
        mb={3}
        borderColor={Theme.colors.border}
        bgColor={Theme.colors.card}
        borderWidth={1}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            fontSize={Theme.fontSizes.md}
            fontWeight="700"
            color={Theme.colors.textPrimary}
          >
            {item.name}
          </Text>
          <HStack space={3}>
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.primary}
              leftIcon={<Icon as={Ionicons} name="pencil" size="sm" />}
              onPress={() => onEdit(item)}
              _text={{ fontWeight: "700", color: Theme.colors.textPrimary }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.error}
              leftIcon={<Icon as={Ionicons} name="trash" size="sm" />}
              onPress={() => handleDeleteTheme(item.id)}
              _text={{ fontWeight: "700", color: Theme.colors.textPrimary }}
            >
              Deletar
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <VStack space={4} py={4}>
      {message && (
        <Alert w="100%" status="error">
          <Text color={Theme.colors.error}>{message}</Text>
        </Alert>
      )}
      <FlatList
        data={themes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </VStack>
  );
};
