import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { dbExecute } from '../database/Database';
import { styles } from '../styles/style';

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
      const result = await dbExecute('SELECT * FROM themes');
      setThemes(result.rows._array);
    };
    fetchThemes();
  }, []);

  const saveQuestion = async () => {
    if (question && answers.every(a => a !== '') && selectedTheme) {
      const themeId = selectedTheme.id;
      const result = await dbExecute(
        'INSERT INTO questions (themeId, question, correctAnswer) VALUES (?, ?, ?)',
        [themeId, question, correctAnswer]
      );
      const questionId = result.insertId;
      for (let i = 0; i < answers.length; i++) {
        await dbExecute(
          'INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)',
          [questionId, answers[i], i === correctAnswer ? 1 : 0]
        );
      }
      setMessage('Question saved successfully!');
      setQuestion('');
      setAnswers(['', '', '', '']);
    } else {
      setMessage('Please fill out all fields');
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Question</Text>

      <Text>Select a Theme:</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
        <Text>{selectedTheme ? selectedTheme.name : 'Choose a theme'}</Text>
      </TouchableOpacity>

      {/* Modal para selecionar o tema */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Theme</Text>
            <FlatList
              data={themes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleThemeSelect(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        placeholder="Enter the question"
        value={question}
        onChangeText={setQuestion}
      />

      {answers.map((ans, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Answer ${index + 1}`}
          value={ans}
          onChangeText={(text) => {
            const newAnswers = [...answers];
            newAnswers[index] = text;
            setAnswers(newAnswers);
          }}
        />
      ))}

      <Text>Select the correct answer (0-3):</Text>
      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        keyboardType="numeric"
        value={correctAnswer.toString()}
        onChangeText={(value) => setCorrectAnswer(parseInt(value))}
      />

      <Button title="Save Question" onPress={saveQuestion} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};
