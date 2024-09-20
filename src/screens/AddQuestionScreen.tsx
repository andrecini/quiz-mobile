import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Box, VStack, Input, Button, Text, Modal, Icon, HStack, Center } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAllRows, runQuery } from '../database/Database'; // Importando funções corretas do Database

interface Theme {
  id: number;
  name: string;
}

export const AddQuestionScreen: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getAllRows('SELECT * FROM themes');
        setThemes(result as Theme[]); // Fazendo o casting para Theme[]
      } catch (error) {
        setMessage('Error fetching themes');
      }
    };
    fetchThemes();
  }, []);

  const saveQuestion = async () => {
    if (question && answers.every((a) => a !== '') && selectedTheme) {
      try {
        const themeId = selectedTheme.id;
        const result = await runQuery(
          'INSERT INTO questions (themeId, question, correctAnswer) VALUES (?, ?, ?)',
          [themeId, question, correctAnswer]
        );
        const questionId = result.lastInsertRowId; // Obtém o ID da pergunta inserida

        for (let i = 0; i < answers.length; i++) {
          await runQuery(
            'INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)',
            [questionId, answers[i], i === correctAnswer ? 1 : 0]
          );
        }

        setMessage('Question saved successfully!');
        setQuestion('');
        setAnswers(['', '', '', '']);
      } catch (error) {
        setMessage('Error saving question');
      }
    } else {
      setMessage('Please fill out all fields');
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setModalVisible(false);
  };

  return (
    <Box p={4}>
      <Center my={5}>
        <Text fontSize="xl" bold>
          Add a New Question
        </Text>
      </Center>

      <VStack space={4}>
        <Text>Select a Theme:</Text>
        <Button onPress={() => setModalVisible(true)} leftIcon={<Icon as={Ionicons} name="ios-list" />}>
          {selectedTheme ? selectedTheme.name : 'Choose a theme'}
        </Button>

        {/* Modal para selecionar o tema */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Select a Theme</Modal.Header>
            <Modal.Body>
              <FlatList
                data={themes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Button
                    mb={2}
                    variant="outline"
                    onPress={() => handleThemeSelect(item)}
                  >
                    {item.name}
                  </Button>
                )}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Input
          placeholder="Enter the question"
          value={question}
          onChangeText={setQuestion}
          InputLeftElement={<Icon as={Ionicons} name="ios-help-circle-outline" size="md" ml={2} />}
        />

        {answers.map((ans, index) => (
          <Input
            key={index}
            placeholder={`Answer ${index + 1}`}
            value={ans}
            onChangeText={(text) => {
              const newAnswers = [...answers];
              newAnswers[index] = text;
              setAnswers(newAnswers);
            }}
            InputLeftElement={<Icon as={Ionicons} name="ios-create-outline" size="md" ml={2} />}
          />
        ))}

        <Text>Select the correct answer (0-3):</Text>
        <Input
          placeholder="Correct Answer"
          keyboardType="numeric"
          value={correctAnswer.toString()}
          onChangeText={(value) => setCorrectAnswer(parseInt(value))}
          InputLeftElement={<Icon as={Ionicons} name="ios-checkmark-circle-outline" size="md" ml={2} />}
        />

        <Button onPress={saveQuestion} leftIcon={<Icon as={Ionicons} name="ios-save" size="md" />}>
          Save Question
        </Button>

        {message && (
          <Text color={message.includes('Error') ? 'red.500' : 'green.500'}>{message}</Text>
        )}
      </VStack>
    </Box>
  );
};
