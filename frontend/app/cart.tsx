import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { router, Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { hasPaymentMethod, selectedPaymentMethod } = useUser();
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  const getItemTotal = (item: (typeof cart)[0]) => {
    const extrasPrice = item.extraIngredients.reduce((sum, e) => sum + e.price, 0);
    return (item.basePrice + extrasPrice) * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <View style={styles.root}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0A2F5A" />
          </Pressable>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>

        {/* Empty state */}
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="trash-outline" size={40} color="#6B7280" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from the menu to get started
          </Text>
          <Link href="/" asChild>
            <Pressable style={styles.browseBtn}>
              <Text style={styles.browseBtnText}>Browse Menu</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A2F5A" />
        </Pressable>
        <Text style={styles.headerTitle}>Cart ({cart.length})</Text>
      </View>

      {/* Cart Items */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {cart.map((item) => (
          <View key={item.id} style={styles.cartCard}>
            <View style={styles.cartCardInner}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                contentFit="cover"
              />

              <View style={styles.itemDetails}>
                {/* Name + Delete */}
                <View style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Pressable
                    onPress={() => removeFromCart(item.id)}
                    hitSlop={8}
                    accessibilityLabel="Remove item"
                  >
                    <Ionicons name="trash-outline" size={18} color="#6B7280" />
                  </Pressable>
                </View>

                <Text style={styles.itemBasePrice}>
                  ${item.basePrice.toFixed(2)}
                </Text>

                {item.removedIngredients.length > 0 && (
                  <Text style={styles.removedText}>
                    No: {item.removedIngredients.join(", ")}
                  </Text>
                )}

                {item.extraIngredients.length > 0 && (
                  <Text style={styles.extrasText}>
                    Extra: {item.extraIngredients.map((e) => e.name).join(", ")}
                  </Text>
                )}

                {/* Quantity + Total */}
                <View style={styles.qtyRow}>
                  <View style={styles.qtyControls}>
                    <Pressable
                      style={styles.qtyBtnMinus}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color="#1F2933" />
                    </Pressable>

                    <Text style={styles.qtyValue}>{item.quantity}</Text>

                    <Pressable
                      style={styles.qtyBtnPlus}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </Pressable>
                  </View>

                  <Text style={styles.itemTotal}>
                    ${getItemTotal(item).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Summary + Checkout */}
      <View
        style={[
          styles.summary,
          { paddingBottom: 16 + Math.max(insets.bottom, 16) },
        ]}
      >
        <View style={styles.summaryRows}>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$2.99</Text>
          </View>
          <View style={[styles.summaryLine, styles.totalLine]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${(totalPrice + 2.99).toFixed(2)}
            </Text>
          </View>
        </View>

        {hasPaymentMethod ? (
          <Pressable
            style={styles.checkoutBtn}
            onPress={() => setShowPaymentConfirm(true)}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </Pressable>
        ) : (
          // TODO: Update href once the settings/account screen is set up
          <Link href="/(tabs)/account" asChild>
            <Pressable style={styles.checkoutBtn}>
              <Text style={styles.checkoutBtnText}>Add Payment Method</Text>
            </Pressable>
          </Link>
        )}

        <Pressable onPress={clearCart} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear Cart</Text>
        </Pressable>
      </View>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showPaymentConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentConfirm(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPaymentConfirm(false)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Confirm Payment</Text>

            <Text style={styles.modalAmount}>
              Total Amount:{" "}
              <Text style={{ fontWeight: "700" }}>
                ${(totalPrice + 2.99).toFixed(2)}
              </Text>
            </Text>

            <Text style={styles.modalSub}>
              {selectedPaymentMethod
                ? `You are about to pay with ${selectedPaymentMethod}`
                : "Complete your order with your default payment method"}
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setShowPaymentConfirm(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.confirmBtn}
                onPress={() => {
                  // TODO: Process payment via API
                  clearCart();
                  setShowPaymentConfirm(false);
                  router.push("/(tabs)/history");
                }}
              >
                <Text style={styles.confirmBtnText}>Confirm Order</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    backgroundColor: "#fff",
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

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  browseBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 50,
    backgroundColor: "#E67E22",
  },
  browseBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // Cart Card
  cartCard: {
    borderRadius: 12,
    backgroundColor: "#F4F7FB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cartCardInner: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
  },
  itemImage: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2933",
    flex: 1,
    marginRight: 8,
  },
  itemBasePrice: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  removedText: {
    fontSize: 12,
    color: "#E67E22",
  },
  extrasText: {
    fontSize: 12,
    color: "#2C6FB7",
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qtyBtnMinus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnPlus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E67E22",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2933",
  },

  // Summary
  summary: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryRows: {
    gap: 8,
    marginBottom: 16,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  summaryValue: {
    color: "#1F2933",
    fontSize: 14,
  },
  totalLine: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 4,
  },
  totalLabel: {
    fontWeight: "700",
    color: "#1F2933",
    fontSize: 15,
  },
  totalValue: {
    fontWeight: "700",
    color: "#1F2933",
    fontSize: 15,
  },
  checkoutBtn: {
    backgroundColor: "#E67E22",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  checkoutBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  clearBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#6B7280",
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0A2F5A",
    marginBottom: 12,
  },
  modalAmount: {
    fontSize: 14,
    color: "#1F2933",
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#6B7280",
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
    backgroundColor: "#E67E22",
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
