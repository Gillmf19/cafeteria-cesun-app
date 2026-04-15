import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getStatus } from "../../services/api";

export default function HomeScreen() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    getStatus()
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error connecting to API"));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{message}</Text>
    </View>
  );
}