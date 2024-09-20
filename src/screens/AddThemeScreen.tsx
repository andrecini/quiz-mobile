// AddThemeScreen.tsx

import React, { useState } from 'react';
import { Box, VStack, Heading } from 'native-base';
import { ThemeForm } from '../components/ThemeForm';
import { ThemeList } from '../components/ThemeList';

export const AddThemeScreen: React.FC = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<{ id: number; name: string } | null>(null);

  const handleThemeAdded = () => {
    setRefreshList(!refreshList); // Alterna o estado para forçar a recarga da lista
    // Não é mais necessário redefinir themeToEdit aqui
  };

  const handleEditTheme = (theme: { id: number; name: string }) => {
    setThemeToEdit(theme); // Define o tema a ser editado
  };

  return (
    <Box flex={1} p={5} safeArea>
      <VStack space={4}>
        <Heading>
          Gerenciar Temas
        </Heading>

        {/* Componente do formulário de tema */}
        <ThemeForm
          themeToEdit={themeToEdit}
          onThemeAdded={handleThemeAdded}
        />

        {/* Lista de temas */}
        <ThemeList
          key={refreshList.toString()}
          onEdit={handleEditTheme}
        />
      </VStack>
    </Box>
  );
};
