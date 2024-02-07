import { io } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";

interface Message {
    Id: number
    Sender: string;
    Direction: string;
    Config: string;
    Content: string;
    Password: string;
    Timestamp: string;
  }

  const C2A = "client-to-all";
  const C2S = "client-to-server";
  const S2C = "server-to-client";
  const S2A = "server-to-all";

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket>(new WebSocket("wss://multi-serve.onrender.com/api/chat"))

  const flatListRef = useRef<FlatList | null>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    // Add event listeners for keyboard show and hide
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // You can handle additional logic when the keyboard is hidden if needed
      }
    );

    // Remove listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  socket.onerror = () => {

  }

  socket.onopen = () => {
    // Handshake
    const handshakeMessage: Message = {
        Id: messages.length + 1,
        Content: inputText,
        Config: "config-username",
        Direction: C2S,
        Password: "1234",
        Sender: "CoolAfone",
        Timestamp: new Date().toLocaleTimeString(),
    };

    socket.send(JSON.stringify(handshakeMessage));
  }

  const Person = {
    "Name": "XYZ"
  }

  socket.onmessage = (e) => {
    // setMessages([...messages, JSON.parse(e.data)]);
    let receivedMessage: Message = JSON.parse(e.data);

    receivedMessage.Id = messages.length + 1;
    receivedMessage.Timestamp = new Date().toLocaleTimeString();
    
    setMessages([...messages, receivedMessage]);
  }

  const handleSend = () => {
    if (inputText.trim() === "") {
      return;
    }

    const newMessage: Message = {
        Id: messages.length + 1,
        Content: inputText,
        Config: "",
        Direction: C2A,
        Password: "1234",
        Sender: "CoolAfone",
        Timestamp: new Date().toLocaleTimeString(),
    };

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(newMessage));
    }

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.Content}</Text>
      <Text style={styles.timestampText}>{item.Timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={(ref) => {
          flatListRef.current = ref;
        }}
        data={messages}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={renderMessage}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {/* <Text style={styles.sendButtonText}>Send</Text> */}
          <Image
            alt="send-svg-button"
            source={{
              uri: "https://static.thenounproject.com/png/373675-200.png",
            }}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,

    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,

    height: 50,
  },
  sendButton: {
    backgroundColor: "#6ca100",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,

    textAlign: "center",
    justifyContent: "center",

    height: 50,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    maxWidth: "70%", // Adjust as needed
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
});

export default ChatApp;
