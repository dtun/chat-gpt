import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import { useApi } from "../hooks/useApi";

const WhisperPage = () => {
  const [result, setResult] = useState("Test");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const { speechToText } = useApi();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (e) {}
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    uploadAudio();
  };

  const uploadAudio = async () => {
    const uri = recording?.getURI();
    if (!uri) return;
    setLoading(true);
    try {
      const { text } = await speechToText(uri);
      setResult(text);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {!recording && (
        <TouchableOpacity
          disabled={loading}
          onPress={startRecording}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Record speech</Text>
        </TouchableOpacity>
      )}
      {recording && (
        <TouchableOpacity
          disabled={loading}
          onPress={stopRecording}
          style={styles.stopButton}
        >
          <Text style={styles.buttonText}>Stop speech</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {result && <Text style={styles.text}>{result}</Text>}
    </View>
  );
};

export default WhisperPage;

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
  button: {
    backgroundColor: "#18191a",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  stopButton: {
    color: "#840F15",
    textAlign: "center",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
});
