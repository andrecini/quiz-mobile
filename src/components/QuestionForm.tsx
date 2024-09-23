import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  Select,
} from "native-base";
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
      setIsEditing(false);
      setQuestionText("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(0);
      setSelectedTheme(undefined);
    }
  }, [questionToEdit]);

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

        setMessage("Pergunta salva com sucesso!");
      }

      setQuestionText("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswer(0);
      setSelectedTheme(undefined);
      setIsEditing(false);
      onQuestionAdded();
    } catch (error) {
      setMessage("Erro ao salvar a pergunta - " + error);
    }
  };

  const handleCancel = () => {
    setQuestionText("");
    setAnswers(["", "", "", ""]);
    setCorrectAnswer(0);
    setSelectedTheme(undefined);
    setIsEditing(false);
    setMessage("");
  };

  return (
      <VStack space={5}>
        <Text
          fontSize={Theme.fontSizes.lg}
          color={Theme.colors.textPrimary}
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          {isEditing ? "Atualizar" : "Criar"}
        </Text>

        <Select
          selectedValue={
            selectedTheme !== undefined ? selectedTheme.toString() : ""
          }
          minWidth="250"
          placeholder="Escolha o Tema"
          onValueChange={(itemValue) => setSelectedTheme(parseInt(itemValue))}
          bg={Theme.colors.backgroundLight}
          color={Theme.colors.textPrimary}
          borderWidth={2}
          borderColor={Theme.colors.primary}
          _selectedItem={{
            bg: Theme.colors.successLight,
          }}
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
          color={Theme.colors.textPrimary}
          bg={Theme.colors.backgroundLight}
          borderColor={Theme.colors.primary}
          borderWidth={2}
          p={3}
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
            color={Theme.colors.textPrimary}
            bg={Theme.colors.backgroundLight}
            borderColor={Theme.colors.primary}
            borderWidth={2}
            p={3}
          />
        ))}

        <Select
          selectedValue={correctAnswer.toString()}
          placeholder="Escolha a Resposta Correta"
          onValueChange={(value) => setCorrectAnswer(parseInt(value))}
          bg={Theme.colors.backgroundLight}
          color={Theme.colors.textPrimary}
          borderWidth={2}
          borderColor={Theme.colors.primary}
          _selectedItem={{
            bg: Theme.colors.successLight,
          }}
        >
          {answers.map((_, index) => (
            <Select.Item
              key={index}
              label={`Resposta ${index + 1}`}
              value={index.toString()}
            />
          ))}
        </Select>

        <HStack space={4} mt={4}>
          <Button
            flex={1}
            onPress={handleSaveQuestion}
            bg={Theme.colors.primary}
            borderRadius="full"
            py={3}
          >
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>

          {isEditing && (
            <Button
              flex={1}
              variant="outline"
              borderColor={Theme.colors.error}
              onPress={handleCancel}
              borderRadius="full"
              py={3}
            >
              <Text fontWeight={700} color={Theme.colors.error}>
                Cancelar
              </Text>
            </Button>
          )}
        </HStack>

        {message && (
          <Text
            mt={4}
            textAlign="center"
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
  );
};
