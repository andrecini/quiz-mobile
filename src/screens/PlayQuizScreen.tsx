import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { getAllRows } from '../database/Database'; // Importando função correta
import { styles } from '../styles/style';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Routes'; // Importe o tipo de navegação

// Defina os parâmetros da rota para PlayQuizScreen
type PlayQuizScreenRouteProp = RouteProp<RootStackParamList, 'PlayQuizScreen'>;
type PlayQuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlayQuizScreen'>;

interface PlayQuizScreenProps {
  route: PlayQuizScreenRouteProp;
  navigation: PlayQuizScreenNavigationProp;
}

interface Question {
  id: number;
  themeId: number;
  question: string;
  correctAnswer: number;
  answers: string[];
}

export const PlayQuizScreen: React.FC<PlayQuizScreenProps> = ({ route, navigation }) => {
  const { themeId, questionCount } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await getAllRows(
          'SELECT * FROM questions WHERE themeId = ? LIMIT ?',
          [themeId, questionCount]
        );
        setQuestions(result as Question[]); // Fazendo o casting para Question[]
      } catch (error) {
        console.error('Error fetching questions', error);
      }
    };
    fetchQuestions();
  }, [themeId, questionCount]);

  const handleAnswer = (answerIndex: number) => {
    setUserAnswers([...userAnswers, answerIndex]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigation.navigate('ResultScreen', { userAnswers, questions });
    }
  };

  return (
    <View style={styles.container}>
      {questions.length > 0 ? (
        <>
          <Text>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].answers.map((answer, index) => (
            <Button key={index} title={answer} onPress={() => handleAnswer(index)} />
          ))}
        </>
      ) : (
        <Text>Loading questions...</Text>
      )}
    </View>
  );
};
