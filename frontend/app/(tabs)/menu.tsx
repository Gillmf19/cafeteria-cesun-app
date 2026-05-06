import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useCart, menuItems } from "../../context/CartContext";
import { ItemModal } from "../../components/ItemModal";
import type { MenuItem } from "../../context/CartContext";

const categories = [
  "Todo",
  "Pizza",
  "Burgers",
  "Sushi",
  "Salads",
  "Coffee",
  "Tacos",
  "Sandwiches",
  "Pasta",
];

export default function MenuScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { addToCart, totalItems, totalPrice } = useCart();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todo" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.root}>
      {/* Sticky header: title + search + chips */}
      <View style={styles.stickyHeader}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>Menú</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Qué se nos antoja?..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No encontramos lo que buscas</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                contentFit="cover"
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardCategory}>{item.category}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.addBtn}
                    onPress={() => addToCart({ itemId: item.id })}
                  >
                    <Text style={styles.addBtnText}>Agregar +</Text>
                  </Pressable>

                  <Pressable
                    style={styles.editBtn}
                    onPress={() => setSelectedItem(item)}
                    hitSlop={4}
                  >
                    <Ionicons name="options-outline" size={18} color="#6B7280" />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          // Extra bottom padding so cart bar never covers last row
          ListFooterComponent={<View style={{ height: 120 }} />}
        />
      )}

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
        <Pressable style={styles.cartBar} onPress={() => router.push("/cart")}>
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

  // Sticky top section
  stickyHeader: {
    backgroundColor: "#fff",
    paddingBottom: 12,
  },
  titleRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A2F5A",
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#F4F7FB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2933",
    padding: 0,
  },

  // Category chips
  chipsRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#2C6FB7",
    borderColor: "#2C6FB7",
  },
  chipText: {
    fontSize: 13,
    color: "#6B7280",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 15,
  },

  // Grid
  gridContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 10,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  cardFooter: {
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2933",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#E67E22",
    borderRadius: 50,
    paddingVertical: 8,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  // Cart Bar
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
