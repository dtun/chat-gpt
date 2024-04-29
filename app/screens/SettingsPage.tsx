import { useEffect, useLayoutEffect, useState } from "react";
import Toast from "react-native-root-toast";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { STORAGE_API_KEY } from "../constants/constants";

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_API_KEY);
      if (value) {
        setApiKey(value);
        setHasKey(true);
      } else {
        setApiKey("");
        setHasKey(false);
      }
    } catch (e) {
      Alert.alert("Error", "Unable to load api key");
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_API_KEY, apiKey);
      setHasKey(true);
      Toast.show("API key saved", { duration: Toast.durations.SHORT });
    } catch (e) {
      Alert.alert("Error", "Unable to save api key");
    }
  };

  const removeApiKey = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY);
      setHasKey(false);
      setApiKey("");
    } catch (e) {
      Alert.alert("Error", "Unable to remove api key");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadApiKey();
    });

    return unsubscribe;
  }, [loadApiKey]);

  return (
    <View style={styles.container}>
      {hasKey ? (
        <>
          <Text style={styles.label}>You're all set!</Text>
          <Pressable onPress={removeApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Remove API key</Text>
          </Pressable>
        </>
      ) : undefined}
      {!hasKey ? (
        <>
          <Text style={styles.label}>API Key</Text>
          <TextInput
            autoCapitalize="none"
            onChangeText={setApiKey}
            placeholder="Enter your OpenAI API key"
            style={styles.input}
            value={apiKey}
          />
          <Pressable onPress={saveApiKey} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </>
      ) : undefined}
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#18191a",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
