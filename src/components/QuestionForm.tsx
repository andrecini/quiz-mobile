import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  Select,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { runQuery, getAllRows } from "../database/Database";
import { Theme } from "../styles/Theme";

interface QuestionFormProps {
  questionToEdit?: {
    id: number;
    question: string;
    correctAnswer: number;
    answers: string[];
    themeId: number;
  };
  onQuestionAdded: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  questionToEdit,
  onQuestionAdded,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getAllRows("SELECT * FROM themes");
        setThemes(result as { id: number; name: string }[]);
      } catch (error) {}
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    if (questionToEdit) {
      setIsEditing(true);
      setQuestionText(questionToEdit.question);
      setAnswers(questionToEdit.answers);
      setCorrectAnswer(questionToEdit.correctAnswer);
      setSelectedTheme(questionToEdit.themeId);
    } else {
      resetForm();
    }
  }, [questionToEdit]);

  const resetForm = () => {
    setIsEditing(false);
    setQuestionText("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(0);
    setSelectedTheme(undefined);
    setMessage("");
  };

  const handleSaveQuestion = async () => {
    if (
      !questionText.trim() ||
      answers.some((a) => a === "") ||
      selectedTheme === undefined
    ) {
      setMessage("Por favor, preencha todos os campos");
      return;
    }

    try {
      if (isEditing && questionToEdit) {
        await runQuery(
          "UPDATE questions SET question = ?, correctAnswer = ?, themeId = ? WHERE id = ?",
          [questionText, correctAnswer, selectedTheme, questionToEdit.id]
        );

        await runQuery("DELETE FROM answers WHERE questionId = ?", [
          questionToEdit.id,
        ]);

        for (let i = 0; i < answers.length; i++) {
          await runQuery(
            "INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)",
            [questionToEdit.id, answers[i], i === correctAnswer ? 1 : 0]
          );
        }

        resetForm();
        setMessage("Pergunta atualizada com sucesso!");
      } else {
        const result = await runQuery(
          "INSERT INTO questions (themeId, question, correctAnswer) VALUES (?, ?, ?)",
          [selectedTheme, questionText, correctAnswer]
        );
        const questionId = result.lastInsertRowId;

        for (let i = 0; i < answers.length; i++) {
          await runQuery(
            "INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)",
            [questionId, answers[i], i === correctAnswer ? 1 : 0]
          );
        }

        resetForm();
        setMessage("Pergunta salva com sucesso!");
      }

      onQuestionAdded();
    } catch (error) {
      setMessage("Erro ao salvar a pergunta - " + error);
    }
  };

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg={Theme.colors.card}>
      <VStack space={4}>
        <HStack space={1} alignItems="center">
          <Icon
            as={Ionicons}
            name="help-circle-sharp"
            size="lg"
            color={Theme.colors.iconColor}
          />
          <Text
            fontSize={Theme.fontSizes.lg}
            color={Theme.colors.textPrimary}
            bold
          >
            {isEditing ? "Editar Pergunta" : "Adicionar Nova Pergunta"}
          </Text>
        </HStack>

        <Select
          selectedValue={
            selectedTheme !== undefined ? selectedTheme.toString() : ""
          }
          minWidth="200"
          placeholder="Escolha um tema"
          onValueChange={(itemValue) => setSelectedTheme(parseInt(itemValue))}
          _selectedItem={{
            bg: Theme.colors.primary,
            _text: { color: Theme.colors.textPrimary },
            endIcon: (
              <Icon
                as={Ionicons}
                name="checkmark-sharp"
                size="lg"
                color={Theme.colors.textPrimary}
              />
            ),
          }}
          bg={Theme.colors.card}
          color={Theme.colors.textPrimary}
        >
          {themes.map((theme) => (
            <Select.Item
              key={theme.id}
              label={theme.name}
              value={theme.id.toString()}
            />
          ))}
        </Select>

        <Input
          placeholder="Digite a pergunta"
          value={questionText}
          onChangeText={setQuestionText}
          InputLeftElement={
            <Icon
              as={Ionicons}
              name="help-circle"
              size="md"
              ml={2}
              color={Theme.colors.primary}
            />
          }
          color={Theme.colors.textPrimary}
          bg={Theme.colors.card}
        />

        {answers.map((ans, index) => (
          <Input
            key={index}
            placeholder={`Resposta ${index + 1}`}
            value={ans}
            onChangeText={(text) => {
              const newAnswers = [...answers];
              newAnswers[index] = text;
              setAnswers(newAnswers);
            }}
            InputLeftElement={
              <Icon
                as={Ionicons}
                name={
                  index === correctAnswer
                    ? "checkmark-circle-sharp"
                    : "close-circle-outline"
                }
                size="md"
                ml={2}
                color={
                  index === correctAnswer
                    ? Theme.colors.success
                    : Theme.colors.error
                }
              />
            }
            color={Theme.colors.textPrimary}
            bg={Theme.colors.card}
          />
        ))}

        <Select
          selectedValue={correctAnswer.toString()}
          placeholder="Selecione a resposta correta"
          onValueChange={(value) => setCorrectAnswer(parseInt(value))}
          _selectedItem={{
            bg: Theme.colors.primary,
            _text: { color: Theme.colors.textPrimary },
            endIcon: (
              <Icon
                as={Ionicons}
                name="checkmark-sharp"
                size="lg"
                color={Theme.colors.textPrimary}
              />
            ),
          }}
          bg={Theme.colors.card}
          color={Theme.colors.textPrimary}
        >
          {answers.map((_, index) => (
            <Select.Item
              key={index}
              label={`Resposta ${index + 1}`}
              value={index.toString()}
            />
          ))}
        </Select>

        <HStack space={2}>
          <Button
            flex={1}
            onPress={handleSaveQuestion}
            leftIcon={<Icon as={Ionicons} name="save" size="md" />}
            bg={Theme.colors.primary}
          >
            {isEditing ? "Atualizar Pergunta" : "Salvar Pergunta"}
          </Button>

          {isEditing && (
            <Button
              flex={1}
              variant="outline"
              colorScheme="secondary"
              onPress={resetForm}
              leftIcon={<Icon as={Ionicons} name="close-circle" size="md" color='white'/>}
            >
              <Text fontWeight={700} color={Theme.colors.textSecondary}>
                Cancelar
              </Text>
            </Button>
          )}
        </HStack>

        {message && (
          <Text
            color={
              message.includes("Erro")
                ? Theme.colors.error
                : Theme.colors.success
            }
          >
            {message}
          </Text>
        )}
      </VStack>
    </Box>
  );
};
