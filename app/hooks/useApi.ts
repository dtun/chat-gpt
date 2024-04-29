import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

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
    const newMessage = {
      text: prompt,
      from: Creator.Me,
    };
    messageSubject.next([...messageSubject.value, newMessage]);
  };

  return { messages, getCompletion };
}
