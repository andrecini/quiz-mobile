import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, TouchableOpacity, FlatList } from 'react-native';
import { getAllRows, getFirstRow } from '../database/Database'; // Usando as funções corretas do Database
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
      try {
        const result = await getAllRows('SELECT * FROM themes');
        setThemes(result as Theme[]); // Fazendo o casting para Theme[]
      } catch (error) {
        console.error('Error fetching themes', error);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeSelect = async (theme: Theme) => {
    setSelectedTheme(theme);
    setModalVisible(false); // Fecha o modal após a seleção

    try {
      // Cast explícito do resultado para o formato esperado
      const result = await getFirstRow(
        'SELECT COUNT(*) AS total FROM questions WHERE themeId = ?',
        [theme.id]
      );
      
      // Aqui estamos assumindo que o result tem a forma { total: number }
      setQuestionsAvailable((result as { total: number }).total); // Cast para acessar a propriedade total
    } catch (error) {
      console.error('Error fetching question count', error);
    }
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
