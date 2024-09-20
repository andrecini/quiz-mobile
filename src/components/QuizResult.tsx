import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { styles } from '../styles/style';

interface QuizResultProps {
  route: {
    params: {
      userAnswers: number[];
      questions: {
        question: string;
        correctAnswer: number;
        answers: string[];
      }[];
    };
  };
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const QuizResult: React.FC<QuizResultProps> = ({ route, navigation }) => {
  const { userAnswers, questions } = route.params;

  const calculateResults = () => {
    let correctCount = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++;
      }
    });
    return {
      correctCount,
      totalQuestions: questions.length,
      percentage: ((correctCount / questions.length) * 100).toFixed(2),
    };
  };

  const results = calculateResults();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      <Text style={styles.resultText}>
        Correct Answers: {results.correctCount} / {results.totalQuestions}
      </Text>
      <Text style={styles.resultText}>Accuracy: {results.percentage}%</Text>

      <Text style={styles.breakdownTitle}>Question Breakdown:</Text>
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.answerText}>
            Your Answer: {userAnswers[index] === question.correctAnswer ? 'Correct' : 'Wrong'}
          </Text>
          {userAnswers[index] !== question.correctAnswer && (
            <Text style={styles.correctAnswerText}>
              Correct Answer: {question.answers[question.correctAnswer]}
            </Text>
          )}
        </View>
      ))}

      <Button title="Play Again" onPress={() => navigation.navigate('HomeScreen')} />
    </ScrollView>
  );
};
