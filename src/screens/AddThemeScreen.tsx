import React, { useState } from 'react';
import { Box, VStack, Heading, Divider, Text } from 'native-base';
import { ThemeForm } from '../components/ThemeForm';
import { ThemeList } from '../components/ThemeList';
import { Theme } from '../styles/Theme';

export const AddThemeScreen: React.FC = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<{ id: number; name: string } | null>(null);

  const handleThemeAdded = () => {
    setRefreshList(!refreshList);
  };

  const handleEditTheme = (theme: { id: number; name: string }) => {
    setThemeToEdit(theme);
  };

  return (
    <Box flex={1} p={6} safeArea bg={Theme.colors.background}>
      <VStack space={6}>
        <Heading color={Theme.colors.textPrimary} fontSize="3xl" textAlign="center" fontWeight="bold" mb={4}>
          Configuração de Categorias
        </Heading>
        
        <Divider bg={Theme.colors.secondary} thickness="3" mb={6} />

        <Text fontSize="lg" color={Theme.colors.textSecondary} textAlign="center">
          Adicione, edite ou remova categorias para personalizar o quiz.
        </Text>

        <ThemeForm
          themeToEdit={themeToEdit}
          onThemeAdded={handleThemeAdded}
        />

        <ThemeList
          key={refreshList.toString()}
          onEdit={handleEditTheme}
        />
      </VStack>
    </Box>
  );
};
