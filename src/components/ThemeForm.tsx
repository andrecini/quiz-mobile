import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { runQuery } from '../database/Database'; // Importa a função correta para executar queries
import { styles } from '../styles/style';

export const ThemeForm: React.FC = () => {
  const [themeName, setThemeName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSaveTheme = async () => {
    if (!themeName.trim()) {
      setMessage('Theme name cannot be empty');
      return;
    }

    try {
      // Usa a função `runQuery` para salvar o tema no banco de dados
      await runQuery('INSERT INTO themes (name) VALUES (?)', [themeName]);
      setMessage('Theme saved successfully!');
      setThemeName(''); // Reseta o campo após o salvamento
    } catch (error) {
      console.error('Error saving theme:', error);
      setMessage('Error saving theme');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter a new theme:</Text>
      <TextInput
        style={styles.input}
        placeholder="Theme name"
        value={themeName}
        onChangeText={setThemeName}
      />
      <Button title="Save Theme" onPress={handleSaveTheme} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};
