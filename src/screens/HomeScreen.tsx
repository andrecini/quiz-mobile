import React from 'react';
import { View, Button, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationProp } from '@react-navigation/native';
import { Theme } from '../styles/Theme';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor: Theme.colors.background }]}>
      <Text style={[styles.title, { color: Theme.colors.textPrimary }]}>
        Bem vindo ao Quiz!
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Temas"
          onPress={() => navigation.navigate('AddThemeScreen')}
          color={Theme.colors.primary}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Perguntas"
          onPress={() => navigation.navigate('AddQuestionScreen')}
          color={Theme.colors.primary}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Jogar"
          onPress={() => navigation.navigate('PlayQuizScreen')}
          color={Theme.colors.primary}
        />
      </View>
    </View>
  );
};
