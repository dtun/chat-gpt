import { useState } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Creator, useApi } from "../hooks/useApi";
import botImage from "../assets/bot.jpg";
import usrImage from "../assets/user.png";

const ChatPage = () => {
  const { getCompletion, messages } = useApi();
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) return;

    const msg = inputMessage;

    setLoading(true);
    setInputMessage("");
    await getCompletion(msg);
    setLoading(false);
  };

  const renderMessage = ({ item }: any) => {
    const isUserMessage = item.from === Creator.Me;

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage
            ? styles.usrMessageContainer
            : styles.botMessageContainer,
        ]}
      >
        <Image
          source={isUserMessage ? usrImage : botImage}
          style={styles.img}
        />
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        data={messages}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderMessage}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : <></>
        }
      />
      <View style={styles.container} />
      <View style={styles.inputContainer}>
        <TextInput
          editable={!loading}
          multiline
          placeholder="Type your message..."
          style={styles.input}
          textAlignVertical="top"
          value={inputMessage}
        />
        <TouchableOpacity
          disabled={loading}
          onPress={handleSendMessage}
          style={styles.sendButton}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
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
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    gap: 10,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomColor: "#dfdfdf",
    borderBottomWidth: 1,
  },
  usrMessageContainer: {
    backgroundColor: "#fff",
  },
  botMessageContainer: {
    backgroundColor: "#f5f5f6",
  },
});
