import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

const CATEGORY_COLORS = {
  'Non-Veg': '#dc2626',
  Veg: '#16a34a',
  Vegan: '#15803d',
};

export default function RecipesScreen({ navigation }) {
  const { state } = useApp();
  const recipes = state.recipes || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu" size={24} color="#c2410c" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Recipes</Text>
          <Ionicons name="restaurant" size={24} color="#c2410c" />
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {recipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
          >
            <View style={styles.cardBanner}>
              <View style={styles.bannerIconRow}>
                <Ionicons name="flame" size={28} color="#fed7aa" />
                <Ionicons name="restaurant" size={28} color="#fed7aa" />
                <Ionicons name="leaf" size={28} color="#fed7aa" />
              </View>
              <Text style={styles.cardTitle}>{recipe.title}</Text>
              <Text style={styles.cardSubtitle}>{recipe.subtitle}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {recipe.description}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{recipe.totalTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="speedometer-outline" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{recipe.difficulty}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{recipe.servingOptions[0]}</Text>
                </View>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: (CATEGORY_COLORS[recipe.category] || '#6b7280') + '18' },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: CATEGORY_COLORS[recipe.category] || '#6b7280' },
                    ]}
                  >
                    {recipe.category}
                  </Text>
                </View>
              </View>

              <View style={styles.tagsRow}>
                {recipe.tags.slice(0, 4).map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {recipes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#d1d5db" />
            <Text style={styles.empty}>No recipes yet!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7ed' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: { fontSize: 24, fontWeight: '800', color: '#9a3412' },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardBanner: {
    backgroundColor: '#9a3412',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  bannerIconRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    opacity: 0.6,
  },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  cardSubtitle: { fontSize: 13, color: '#fed7aa', marginTop: 2 },
  cardBody: { padding: 14 },
  cardDesc: { fontSize: 13, color: '#6b7280', lineHeight: 18, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  categoryText: { fontSize: 11, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tagText: { fontSize: 11, color: '#c2410c', fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 80 },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 12, fontSize: 15 },
});
