import React, { useState, useEffect } from "react";
import { Box, VStack, Input, Button, Text, Icon, HStack } from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { runQuery } from "../database/Database";
import { Theme } from "../styles/Theme";

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

      setThemeName("");
      setIsEditing(false);
      onThemeAdded();
    } catch (error) {
      setMessage("Erro ao salvar o tema");
    }
  };

  const handleCancel = () => {
    setThemeName("");
    setIsEditing(false);
    setMessage("");
  };

  return (

      <VStack space={5}>

        <Input
          value={themeName}
          onChangeText={setThemeName}
          color={Theme.colors.textPrimary}
          borderColor={Theme.colors.primary}
          borderWidth={2}
          py={3}
        />

        <HStack space={3}>
          <Button
            flex={1}
            onPress={handleSaveTheme}
            bg={Theme.colors.primary}
            _pressed={{ bg: Theme.colors.primaryLight }}
          >
            <Text fontWeight={700} color={Theme.colors.textButton}>
              {isEditing ? "Salvar Alterações" : "Adicionar Tema"}
            </Text>
          </Button>

          {isEditing && (
            <Button
              flex={1}
              variant="outline"
              onPress={handleCancel}
              borderColor={Theme.colors.error}
              _text={{ color: Theme.colors.error }}
            >
              Cancelar
            </Button>
          )}
        </HStack>

        {message ? (
          <Text
            fontWeight="bold"
            color={
              message.includes("Erro") ? Theme.colors.error : Theme.colors.success
            }
          >
            {message}
          </Text>
        ) : null}
      </VStack>
  );
};
