import React from 'react';
import { View, Text } from 'react-native';
import { ThemeForm } from '../components/ThemeForm';
import { styles } from '../styles/style';

export const AddThemeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Theme</Text>
      <ThemeForm />
    </View>
  );
};
