import React from 'react';
import { View, Button, Text } from 'react-native';
import { styles } from '../styles/style';
import { NavigationProp } from '@react-navigation/native';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Quiz App!</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Themes"
          onPress={() => navigation.navigate('AddThemeScreen')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Questions"
          onPress={() => navigation.navigate('AddQuestionScreen')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Play Quiz"
          onPress={() => navigation.navigate('PlayQuizScreen')}
        />
      </View>
    </View>
  );
};
