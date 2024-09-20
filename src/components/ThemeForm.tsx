// ThemeForm.tsx

import React, { useState, useEffect } from "react";
import { Box, VStack, Input, Button, Text, Icon, HStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { runQuery } from "../database/Database";

interface ThemeFormProps {
  themeToEdit?: { id: number; name: string } | null;
  onThemeAdded: () => void;
}

export const ThemeForm: React.FC<ThemeFormProps> = ({
  themeToEdit,
  onThemeAdded,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [themeName, setThemeName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (themeToEdit) {
      setIsEditing(true);
      setThemeName(themeToEdit.name);
    } else {
      setIsEditing(false);
      setThemeName("");
    }
  }, [themeToEdit]);

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      setMessage("O nome do tema não pode ser vazio");
      return;
    }

    try {
      if (isEditing && themeToEdit) {
        await runQuery("UPDATE themes SET name = ? WHERE id = ?", [
          themeName,
          themeToEdit.id,
        ]);
        setMessage("Tema atualizado com sucesso!");
      } else {
        await runQuery("INSERT INTO themes (name) VALUES (?)", [themeName]);
        setMessage("Tema salvo com sucesso!");
      }

      // Limpa os campos e volta ao modo de adição
      setThemeName("");
      setIsEditing(false);
      onThemeAdded();
    } catch (error) {
      console.error("Erro ao salvar o tema:", error);
      setMessage("Erro ao salvar o tema");
    }
  };

  const handleCancel = () => {
    setThemeName("");
    setIsEditing(false);
    setMessage("");
  };

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white" maxW="400px">
      <VStack space={4}>
        <HStack alignItems="center" space={2}>
          <Icon as={Ionicons} name="albums" size="md" color="black" />
          <Text fontSize="lg" bold>
            {isEditing ? "Editar Tema" : "Adicionar Novo Tema"}
          </Text>
        </HStack>

        <Input
          variant="outline"
          placeholder="Nome do tema"
          value={themeName}
          onChangeText={setThemeName}
        />

        <HStack space={2}>
          <Button
            flex={1}
            onPress={handleSaveTheme}
            leftIcon={<Icon as={Ionicons} name="save-sharp" size="md" />}
          >
            <Text fontWeight={700} color="white">
              {isEditing ? "Atualizar Tema" : "Salvar Tema"}
            </Text>
          </Button>

          {isEditing && (
            <Button
              flex={1}
              variant="outline"
              colorScheme="secondary"
              onPress={handleCancel}
              leftIcon={<Icon as={Ionicons} name="close-circle" size="md" />}
            >
              <Text fontWeight={700} color="secondary.500">
                Cancelar
              </Text>
            </Button>
          )}
        </HStack>

        {message ? (
          <Text color={message.includes("Erro") ? "red.500" : "green.500"}>
            {message}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
