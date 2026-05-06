import { useState } from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ─── SettingItem ─────────────────────────────────────────────────────────────
type SettingItemProps =
  | { type: "link"; label: string; href: string }
  | { type: "toggle"; label: string; value: boolean; onChange: (v: boolean) => void };

function SettingItem(props: SettingItemProps) {
  if (props.type === "link") {
    return (
      <Link href={props.href as any} asChild>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>{props.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </Pressable>
      </Link>
    );
  }

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{props.label}</Text>
      {/* RN's built-in Switch — trackColor replaces CSS accent-color */}
      <Switch
        value={props.value}
        onValueChange={props.onChange}
        trackColor={{ false: "#D1D5DB", true: "#2C6FB7" }}
        thumbColor="#fff"
      />
    </View>
  );
}

// ─── Settings Screen ─────────────────────────────────────────────────────────
export default function AccountScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Page Header */}
      <Text style={styles.pageTitle}>Configuración</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CUENTA</Text>
        <View style={styles.group}>
          <SettingItem
            type="link"
            label="Información de la cuenta"
            href="/account-info"
          />
          <SettingItem
            type="link"
            label="Métodos de pago"
            href="/payment-methods"
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCIAS</Text>
        <View style={styles.group}>
          <SettingItem
            type="toggle"
            label="Notificaciones"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SOPORTE TÉCNICO</Text>
        <View style={styles.group}>
          <SettingItem type="link" label="Reportar Error" href="/help-center" />
          <SettingItem
            type="link"
            label="Términos y Condiciones"
            href="/terms-conditions"
          />
        </View>
      </View>

      {/* Log Out */}
      <Pressable style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A2F5A",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  group: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowLabel: {
    fontSize: 15,
    color: "#1F2933",
  },

  // Logout
  logoutBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#6B7280",
    fontSize: 15,
  },
});
