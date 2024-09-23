import React from "react";
import { View, Box, VStack, Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../routes/Routes";
import { Theme as AppTheme } from "../styles/Theme";

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ResultScreen"
>;

interface ResultScreenProps {
  route: {
    params: {
      score: number;
    };
  };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ route }) => {
  const { score } = route.params;
  const navigation = useNavigation<ResultScreenNavigationProp>();

  return (
    <View flex={1} bg={AppTheme.colors.background} p={4} justifyContent="center">
        <VStack space={6} alignItems="center">
          <Text fontSize="3xl" bold color={AppTheme.colors.textPrimary}>
            Resultado do Quiz
          </Text>

          <Text fontSize="5xl" bold color={AppTheme.colors.primary}>
            {`${score}%`}
          </Text>

          <Text fontSize="lg" color={AppTheme.colors.textSecondary}>
            Você acertou {score}% das perguntas!
          </Text>

          <Button
            onPress={() => navigation.navigate("HomeScreen")}
            bg={AppTheme.colors.primary}
            size="lg"
            _text={{ fontWeight: "bold", fontSize: "md" }}
          >
            Tela Inicial
          </Button>
        </VStack>
    </View>
  );
};
