import React, { useState } from 'react';
import { Box, VStack, Heading } from 'native-base';
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
    <Box flex={1} p={5} safeArea bg={Theme.colors.background}>
      <VStack space={4}>
        <Heading color={Theme.colors.textPrimary}>
          Gerenciar Temas
        </Heading>

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
