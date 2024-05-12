import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useApi } from "../hooks/useApi";

const ImagesPage = () => {
  const [input, setInput] = useState("");
  const { generateImage } = useApi();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const onGenerateImage = async () => {
    setLoading(true);
    const url = await generateImage(input);
    setLoading(false);
    setImage(url || "");
    setLoading(false);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        editable={!loading}
        onChangeText={setInput}
        placeholder="Santa on the beach"
        style={styles.input}
        value={input}
      />
      <TouchableOpacity
        disabled={loading}
        onPress={onGenerateImage}
        style={styles.sendButton}
      >
        <Text style={styles.sendButtonText}>Generate Image</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 300, marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default ImagesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 40,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#18191a",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
