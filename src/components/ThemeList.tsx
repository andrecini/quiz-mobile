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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
      setMessage("Erro ao buscar os temas");
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
      setMessage("Erro ao deletar o tema");
    }
  };

  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <Pressable
    paddingBottom={3}
    borderBottomColor="blue.500"
    borderBottomWidth={2}
    marginBottom={3}
    >
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            fontSize={Theme.fontSizes.lg}
            fontWeight="800"
            color={Theme.colors.textPrimary}
          >
            {item.name}
          </Text>
          <HStack space={4}>
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.success}
              leftIcon={<Icon as={MaterialIcons} name="edit" size="sm" />}
              onPress={() => onEdit(item)}
              _text={{ fontWeight: "bold", color: Theme.colors.textButton }}
            >
            </Button>
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.errorLight}
              leftIcon={<Icon as={MaterialIcons} name="delete" size="sm" />}
              onPress={() => handleDeleteTheme(item.id)}
              _text={{ fontWeight: "bold", color: Theme.colors.textButton }}
            >
            </Button>
          </HStack>
        </HStack>
    </Pressable>
  );

  return (
    <VStack space={5} py={5}>
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
