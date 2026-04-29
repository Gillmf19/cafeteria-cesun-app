import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OrderType = "upcoming" | "past";

type Order = {
  id: number;
  type: OrderType;
  vendor: string;
  date: string;
  time: string;
  total: number;
  items: string[];
  status?: string;
  estimatedTime?: string;
};

// TODO: Replace with real data from backend
const orders: Order[] = [
  {
    id: 1,
    type: "past",
    vendor: "Campus Coffee",
    date: "May 15, 2024",
    time: "2:30 PM",
    total: 12.5,
    items: ["Latte", "Blueberry Muffin"],
  },
  {
    id: 2,
    type: "upcoming",
    vendor: "Pizza Palace",
    date: "Today",
    time: "12:45 PM",
    total: 18.99,
    status: "Preparing",
    estimatedTime: "10-15 mins",
    items: ["Margherita Pizza", "Caesar Salad"],
  },
  {
    id: 3,
    type: "past",
    vendor: "Burger Bar",
    date: "May 14, 2024",
    time: "7:15 PM",
    total: 15.75,
    items: ["Classic Burger", "Fries", "Soda"],
  },
];

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<OrderType>("upcoming");

  const filteredOrders = orders.filter((order) => order.type === activeTab);

  return (
    <View style={styles.root}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentWrap}>
        <View style={styles.segment}>
          <Pressable
            style={[styles.segBtn, activeTab === "upcoming" && styles.segBtnActive]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text style={[styles.segText, activeTab === "upcoming" && styles.segTextActive]}>
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            style={[styles.segBtn, activeTab === "past" && styles.segBtnActive]}
            onPress={() => setActiveTab("past")}
          >
            <Text style={[styles.segText, activeTab === "past" && styles.segTextActive]}>
              Past
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Order Cards */}
      <ScrollView contentContainerStyle={styles.list}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab} orders</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              {/* Icon */}
              <View style={styles.cardIcon}>
                {order.type === "past" ? (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                ) : (
                  <Ionicons name="time-outline" size={24} color="#E67E22" />
                )}
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.vendorName}>{order.vendor}</Text>
                  <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                </View>

                <Text style={styles.orderMeta}>
                  {order.date} • {order.time}
                </Text>
                <Text style={styles.orderItems} numberOfLines={2}>
                  {order.items.join(", ")}
                </Text>

                {order.type === "upcoming" && order.status && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {order.status} • {order.estimatedTime}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A2F5A",
  },

  // Segmented control
  segmentWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F4F7FB",
    borderRadius: 10,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  segBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segText: {
    fontSize: 14,
    color: "#6B7280",
  },
  segTextActive: {
    color: "#0A2F5A",
    fontWeight: "600",
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },

  // Empty state
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 15,
  },

  // Order card
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardIcon: {
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
    flex: 1,
    marginRight: 8,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2933",
  },
  orderMeta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },

  // Status badge — "inline-block" equivalent: alignSelf: "flex-start"
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3E7",
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 13,
    color: "#E67E22",
  },
});
