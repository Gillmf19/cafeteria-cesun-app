import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { setPaymentMethod } = useUser();
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = () => {
    if (cardNumber && cardName && expiryDate && cvv) {
      // Store last 4 digits as the display label — matches web behavior
      setPaymentMethod(`•••• ${cardNumber.replace(/\s/g, "").slice(-4)}`);
      router.push("/cart");
    }
  };

  const isValid = cardNumber && cardName && expiryDate && cvv;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A2F5A" />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Ionicons name="card-outline" size={40} color="#2C6FB7" />
          </View>
        </View>

        {/* Card Number */}
        <View style={styles.field}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#9CA3AF"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            maxLength={19}
          />
        </View>

        {/* Cardholder Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#9CA3AF"
            value={cardName}
            onChangeText={setCardName}
            autoCapitalize="words"
          />
        </View>

        {/* Expiry + CVV — side by side, same as grid-cols-2 */}
        <View style={styles.row}>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor="#9CA3AF"
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>

          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#9CA3AF"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>

        <Pressable
          style={[styles.submitBtn, !isValid && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitBtnText}>Add Payment Method</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A2F5A",
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Icon
  iconWrap: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
  },

  // Form fields
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F4F7FB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2933",
  },

  // Side-by-side row (grid-cols-2 equivalent)
  row: {
    flexDirection: "row",
    gap: 16,
  },
  rowField: {
    flex: 1,
  },

  // Submit button
  submitBtn: {
    backgroundColor: "#E67E22",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
