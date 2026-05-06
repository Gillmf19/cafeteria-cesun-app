import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useCart, menuItems } from "../../context/CartContext";
import { ItemModal } from "../../components/ItemModal";
import type { MenuItem } from "../../context/CartContext";

const featuredIds = [1, 2, 5];

export default function HomeScreen() {
  const { addToCart, totalItems, totalPrice } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const featured = menuItems.filter((item) => featuredIds.includes(item.id));

  // TODO: Replace with real order history from backend
  const usualItems = menuItems.slice(0, 2);
  const hasOrderHistory = usualItems.length > 0;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Greeting */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>Hey, Jessica!</Text>
        </View>

        {/* Order Again — only if user has order history */}
        {hasOrderHistory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar de Nuevo</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
              {usualItems.map((item) => (
                <View key={item.id} style={styles.usualCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.usualImage}
                    contentFit="cover"
                  />

                  <Text style={styles.usualName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text style={styles.usualPrice}>
                    ${item.price.toFixed(2)}
                  </Text>

                  <View style={styles.usualActions}>
                    <Pressable
                      style={styles.addSmallBtn}
                      onPress={() => addToCart({ itemId: item.id })}
                    >
                      <Text style={styles.addSmallText}>+</Text>
                    </Pressable>

                    <Pressable
                      style={styles.editSmallBtn}
                      onPress={() => setSelectedItem(item)}
                    >
                      <Text style={styles.editSmallText}>Editar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Today */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>Recomendación del Día</Text>
            <Link href="/menu" asChild>
              <Pressable style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>Ver más</Text>
                <Ionicons name="chevron-forward" size={16} color="#2C6FB7" />
              </Pressable>
            </Link>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {featured.map((item) => (
              <View key={item.id} style={styles.featuredCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.featuredImage}
                  contentFit="cover"
                />

                <View style={styles.featuredBody}>
                  <View style={styles.featuredRow}>
                    <Text style={styles.featuredName}>{item.name}</Text>
                    <Text style={styles.featuredPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.featuredDesc} numberOfLines={2}>
                    {item.description}
                  </Text>

                  <View style={styles.featuredActions}>
                    <Pressable
                      style={styles.addRoundBtn}
                      onPress={() => addToCart({ itemId: item.id })}
                    >
                      <Text style={styles.addRoundText}>+</Text>
                    </Pressable>

                    <Pressable
                      style={styles.editRoundBtn}
                      onPress={() => setSelectedItem(item)}
                    >
                      <Text style={styles.editRoundText}>Edit</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding so cart bar doesn't overlap last item */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={(config) => {
            addToCart(config);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Cart Bar */}
      {totalItems > 0 && (
        <Pressable
          style={styles.cartBar}
          onPress={() => router.push("/cart")}
        >
          <View style={styles.cartLeft}>
            <View style={styles.cartIconWrap}>
              <Ionicons name="cart-outline" size={18} color="#fff" />
            </View>

            <View>
              <Text style={styles.cartItems}>{totalItems} items</Text>
              <Text style={styles.cartPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.cartViewBtn}>
            <Text style={styles.cartViewText}>Ver Carrito</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Greeting
  greetingCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2933",
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 12,
  },
  hScroll: {
    overflow: "visible",
  },

  // View All link
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: "#2C6FB7",
  },

  // Order Again cards
  usualCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  usualImage: {
    width: "100%",
    height: 96,
    borderRadius: 8,
  },
  usualName: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
    color: "#1F2933",
  },
  usualPrice: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  usualActions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  addSmallBtn: {
    flex: 1,
    backgroundColor: "#E67E22",
    borderRadius: 50,
    paddingVertical: 4,
    alignItems: "center",
  },
  addSmallText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  editSmallBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 50,
    paddingVertical: 4,
    alignItems: "center",
  },
  editSmallText: {
    fontSize: 12,
    color: "#374151",
  },

  // Featured cards
  featuredCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: "100%",
    height: 160,
  },
  featuredBody: {
    padding: 16,
  },
  featuredRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
    flex: 1,
    marginRight: 8,
  },
  featuredPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2933",
  },
  featuredDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 16,
  },
  featuredActions: {
    flexDirection: "row",
    gap: 8,
  },
  addRoundBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: "#E67E22",
    alignItems: "center",
    justifyContent: "center",
  },
  addRoundText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editRoundBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  editRoundText: {
    fontSize: 13,
    color: "#374151",
  },

  // Cart bar — sits above tab bar (position absolute causes issues in RN, use absolute here)
  cartBar: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "#E67E22",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartIconWrap: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cartItems: {
    color: "#fff",
    fontSize: 13,
  },
  cartPrice: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cartViewBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
  },
  cartViewText: {
    color: "#E67E22",
    fontWeight: "600",
    fontSize: 14,
  },
});
