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
  const [themeName, setThemeName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (themeToEdit) {
      setThemeName(themeToEdit.name);
    } else {
      setThemeName("");
    }
  }, [themeToEdit]);

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      setMessage("Theme name cannot be empty");
      return;
    }

    try {
      if (themeToEdit) {
        await runQuery("UPDATE themes SET name = ? WHERE id = ?", [
          themeName,
          themeToEdit?.id,
        ]);
        setMessage("Theme updated successfully!");
      } else {
        await runQuery("INSERT INTO themes (name) VALUES (?)", [themeName]);
        setMessage("Theme saved successfully!");
      }

      setThemeName("");
      onThemeAdded();
    } catch (error) {
      console.error("Error saving theme:", error);
      setMessage("Error saving theme");
    }
  };

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white" maxW="400px">
      <VStack space={4}>
        <HStack alignItems="center" space={2}>
          <Icon as={Ionicons} name="albums" size="md" color="black" />
          <Text fontSize="lg" bold>
            {themeToEdit ? "Edit Theme" : "Add a new Theme"}
          </Text>
        </HStack>

        <Input
          variant="outline"
          placeholder="Theme name"
          value={themeName}
          onChangeText={setThemeName}
        />

        <Button
          onPress={handleSaveTheme}
          leftIcon={<Icon as={Ionicons} name="save-sharp" size="md" />}
        >
          <Text fontWeight={700} color='white'>
            {themeToEdit ? "Update Theme" : "Save Theme"}
          </Text>
        </Button>

        {message ? (
          <Text color={message.includes("Error") ? "red.500" : "green.500"}>
            {message}
          </Text>
        ) : null}
      </VStack>
    </Box>
  );
};
