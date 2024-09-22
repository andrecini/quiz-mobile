import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Usando Ionicons para os ícones
import { NavigationProp } from "@react-navigation/native";
import { Theme } from "../styles/Theme";
import { styles } from "../styles/style"; // Garanta que o arquivo styles tenha os ajustes
import { VStack } from "native-base";

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme.colors.background, justifyContent: "flex-start" },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: Theme.colors.textPrimary,
            fontSize: 34,
            fontWeight: "bold",
            marginBottom: 40,
            justifyContent: "center",
          },
        ]}
      >
        Bem vindo ao Quiz App
      </Text>

      <Text
        style={[
          styles.title,
          {
            color: Theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            justifyContent: "center",
          },
        ]}
      >
        Gerenciamento
      </Text>

      <VStack
        space={4}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
              borderRadius: 10,
              width: '100%'
            },
          ]}
          onPress={() => navigation.navigate("AddThemeScreen")}
        >
          <Ionicons
            name="albums"
            size={24}
            color={Theme.colors.textPrimary}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: Theme.colors.textPrimary }}>Temas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
              borderRadius: 10,
              width: '100%'
            },
          ]}
          onPress={() => navigation.navigate("AddQuestionScreen")}
        >
          <Ionicons
            name="help-circle"
            size={24}
            color={Theme.colors.textPrimary}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: Theme.colors.textPrimary }}>Perguntas</Text>
        </TouchableOpacity>
      </VStack>
      
      <Text
        style={[
          styles.title,
          {
            color: Theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            marginTop: 10,
            justifyContent: "center",
          },
        ]}
      >
        Game
      </Text>
      
      <VStack
        space={4}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 15,
              borderRadius: 10,
              width: '100%'
            },
          ]}
          onPress={() => navigation.navigate("PlayQuizScreen")}
        >
          <Ionicons
            name="play"
            size={24}
            color={Theme.colors.textPrimary}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: Theme.colors.textPrimary }}>Jogar</Text>
        </TouchableOpacity>
      </VStack>
    </View>
  );
};
