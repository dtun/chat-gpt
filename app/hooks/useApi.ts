import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { ClientOptions, OpenAI } from "openai";

import { STORAGE_API_KEY } from "../constants/constants";

export enum Creator {
  Me = 0,
  Bot = 1,
}

export interface Message {
  text: string;
  from: Creator;
}

let messageSubject: BehaviorSubject<Message[]>;

export function useApi() {
  const dummyMessages = [
    {
      text: "Hello, how can I help you today?",
      from: Creator.Bot,
    },
    {
      text: "What is JS?",
      from: Creator.Me,
    },
    {
      text: "JS is a scripting language that helps you create apps.",
      from: Creator.Bot,
    },
  ];
  const [messages, setMessages] = useState<Message[]>([]);

  if (!messageSubject) {
    messageSubject = new BehaviorSubject(dummyMessages);
  }

  useEffect(() => {
    const subscription = messageSubject.subscribe((messages) => {
      setMessages(messages);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getCompletion = async (prompt: string) => {
    const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);
    if (!apiKey) {
      Alert.alert("Error", "No API key found");
      return;
    }
    // Add our own message
    const newMessage = {
      text: prompt,
      from: Creator.Me,
    };
    messageSubject.next([...messageSubject.value, newMessage]);
    // Setup OpenAI
    const config: ClientOptions = { apiKey };
    const openai = new OpenAI(config);
    // Get completion
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
    });
    const [data] = completion.choices;
    const trimmedText = data.text.trim();
    // Add bot message
    const botMessage = {
      text: trimmedText,
      from: Creator.Bot,
    };
    messageSubject.next([...messageSubject.value, botMessage]);
  };

  return { messages, getCompletion };
}