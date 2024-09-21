import React, { useState, useEffect } from 'react';
import { Box, VStack, Select, Button, Text, Input, Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAllRows } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Routes'; // Ajuste o caminho conforme sua estrutura

type PlayQuizScreenProp = StackNavigationProp<RootStackParamList, 'PlayQuizScreen'>;

export const PlayQuizScreen: React.FC = () => {
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(undefined);
  const [questionsAvailable, setQuestionsAvailable] = useState<number>(0);
  const [numQuestions, setNumQuestions] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigation = useNavigation<PlayQuizScreenProp>();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getAllRows('SELECT * FROM themes');
        setThemes(result as { id: number; name: string }[]);
      } catch (error) {
        console.error('Erro ao buscar temas', error);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeChange = async (themeId: string) => {
    setSelectedTheme(parseInt(themeId));
    try {
      const result = await getAllRows('SELECT COUNT(*) as count FROM questions WHERE themeId = ?', [themeId]);
      
      // Aqui explicitamente forçamos o tipo de retorno para evitar o erro
      const countResult = result as { count: number }[];
      setQuestionsAvailable(countResult[0].count);
    } catch (error) {
      console.error('Erro ao buscar quantidade de perguntas', error);
    }
  };

  const handleStartQuiz = () => {
    if (!selectedTheme || numQuestions.trim() === '') {
      setErrorMessage('Por favor, selecione um tema e uma quantidade de perguntas.');
      return;
    }
    const numQuestionsInt = parseInt(numQuestions);
    if (numQuestionsInt > questionsAvailable) {
      setErrorMessage(`Número de perguntas excede o disponível. Existem apenas ${questionsAvailable} perguntas.`);
      return;
    }
    setErrorMessage('');
    
    // Redirecionar para a tela de QuizGame passando o tema e a quantidade de perguntas
    navigation.navigate('QuizGameScreen', {
      themeId: selectedTheme,
      questionCount: numQuestionsInt
    });
  };

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white">
      <VStack space={4}>
        <Text fontSize="lg" bold>Selecione um tema e quantidade de perguntas</Text>

        {/* Select para o tema */}
        <Select
          selectedValue={selectedTheme ? selectedTheme.toString() : ''}
          minWidth="200"
          placeholder="Escolha um tema"
          onValueChange={handleThemeChange}
          _selectedItem={{
            bg: 'teal.600',
            _text: { color: 'white' },
            endIcon: <Icon as={Ionicons} name="checkmark-sharp" size="lg" color="white" />,
          }}
        >
          {themes.map((theme) => (
            <Select.Item key={theme.id} label={theme.name} value={theme.id.toString()} />
          ))}
        </Select>

        {/* Exibe o número de perguntas disponíveis */}
        {selectedTheme && (
          <Text color="gray.500">{`Este tema tem ${questionsAvailable} perguntas disponíveis.`}</Text>
        )}

        {/* Input para a quantidade de perguntas */}
        <Input
          placeholder="Digite a quantidade de perguntas"
          value={numQuestions}
          onChangeText={setNumQuestions}
          keyboardType="numeric"
        />

        {/* Mensagem de erro */}
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}

        {/* Botão para iniciar o quiz */}
        <Button onPress={handleStartQuiz} leftIcon={<Icon as={Ionicons} name="play" size="md" />}>
          Iniciar Quiz
        </Button>
      </VStack>
    </Box>
  );
};
