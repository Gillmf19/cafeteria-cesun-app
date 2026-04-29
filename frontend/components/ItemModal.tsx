import { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MenuItem } from "../context/CartContext";

type Extra = { name: string; price: number };

type ItemModalProps = {
  item: MenuItem;
  onClose: () => void;
  onAdd: (config: {
    itemId: number;
    removedIngredients: string[];
    extraIngredients: Extra[];
  }) => void;
};

export function ItemModal({ item, onClose, onAdd }: ItemModalProps) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  const toggleRemove = (ing: string) => {
    setRemoved((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const toggleExtra = (ing: Extra) => {
    setExtras((prev) =>
      prev.some((e) => e.name === ing.name)
        ? prev.filter((e) => e.name !== ing.name)
        : [...prev, ing]
    );
  };

  const extraPrice = extras.reduce((sum, e) => sum + e.price, 0);
  const total = item.price + extraPrice;

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Dimmed overlay — tap to dismiss */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Sticky header — lives above ScrollView so it never scrolls */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle} numberOfLines={1}>
            Customize {item.name}
          </Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Scrollable body */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Remove Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>

              <View style={styles.optionList}>
                {item.ingredients.map((ing) => {
                  const included = !removed.includes(ing);
                  return (
                    <Pressable
                      key={ing}
                      style={styles.optionRow}
                      onPress={() => toggleRemove(ing)}
                    >
                      <Checkbox checked={included} color="#E67E22" />
                      <Text style={styles.optionLabel}>{ing}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Add Extras */}
          {item.extras && item.extras.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add Extras</Text>

              <View style={styles.optionList}>
                {item.extras.map((ing) => {
                  const checked = extras.some((e) => e.name === ing.name);
                  return (
                    <Pressable
                      key={ing.name}
                      style={styles.optionRow}
                      onPress={() => toggleExtra(ing)}
                    >
                      <View style={styles.extraLeft}>
                        <Checkbox checked={checked} color="#E67E22" />
                        <Text style={styles.optionLabel}>{ing.name}</Text>
                      </View>
                      <Text style={styles.extraPrice}>
                        +${ing.price.toFixed(2)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Actions footer */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>Total Price</Text>
              <Text style={styles.footerTotal}>${total.toFixed(2)}</Text>
            </View>

            <Pressable
              style={styles.addBtn}
              onPress={() =>
                onAdd({
                  itemId: item.id,
                  removedIngredients: removed,
                  extraIngredients: extras,
                })
              }
            >
              <Text style={styles.addBtnText}>Add to Cart</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Custom Checkbox ────────────────────────────────────────────────────────
// RN has no native <input type="checkbox">. This mimics the accent-color style
// from the web: filled square when checked, outlined when unchecked.
function Checkbox({ checked, color }: { checked: boolean; color: string }) {
  return (
    <View
      style={[
        checkboxStyles.box,
        checked
          ? { backgroundColor: color, borderColor: color }
          : checkboxStyles.unchecked,
      ]}
    >
      {checked && (
        <Ionicons name="checkmark" size={14} color="#fff" />
      )}
    </View>
  );
}

const checkboxStyles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  unchecked: {
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },
});

// ─── Main Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },

  // Sticky header
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0A2F5A",
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    padding: 2,
  },

  // Body
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    padding: 16,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 12,
  },
  optionList: {
    gap: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F4F7FB",
    borderRadius: 10,
    padding: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: "#1F2933",
    flex: 1,
  },
  extraLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  extraPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C6FB7",
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  footerLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  footerTotal: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2933",
  },
  addBtn: {
    backgroundColor: "#E67E22",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
