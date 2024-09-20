import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, TouchableOpacity, FlatList } from 'react-native';
import { dbExecute } from '../../database/Database';
import { styles } from '../styles/style';

interface Theme {
  id: number;
  name: string;
}

interface QuizFormProps {
  navigation: {
    navigate: (screen: string, params?: { themeId: number; questionCount: number }) => void;
  };
}

export const QuizForm: React.FC<QuizFormProps> = ({ navigation }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [questionsAvailable, setQuestionsAvailable] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<string>('0');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      const result = await dbExecute('SELECT * FROM themes');
      setThemes(result.rows._array);
    };
    fetchThemes();
  }, []);

  const handleThemeSelect = async (theme: Theme) => {
    setSelectedTheme(theme);
    setModalVisible(false); // Fecha o modal após a seleção
    const result = await dbExecute(
      'SELECT COUNT(*) AS total FROM questions WHERE themeId = ?',
      [theme.id]
    );
    setQuestionsAvailable(result.rows._array[0].total);
  };

  const handlePlayQuiz = () => {
    const questionCountNumber = parseInt(questionCount, 10);
    if (
      selectedTheme &&
      questionCountNumber > 0 &&
      questionCountNumber <= questionsAvailable
    ) {
      navigation.navigate('PlayQuizScreen', { themeId: selectedTheme.id, questionCount: questionCountNumber });
    } else {
      alert('Please select a valid theme and number of questions');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select a Theme:</Text>

      {/* Trigger para abrir o modal */}
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

      <Text>Questions available: {questionsAvailable}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter number of questions"
        keyboardType="numeric"
        value={questionCount}
        onChangeText={setQuestionCount}
      />

      <Button title="Start Quiz" onPress={handlePlayQuiz} />
    </View>
  );
};
