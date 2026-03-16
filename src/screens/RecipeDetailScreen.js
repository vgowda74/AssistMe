import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

const STEP_COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a'];

export default function RecipeDetailScreen({ route, navigation }) {
  const { state } = useApp();
  const { recipeId } = route.params;
  const recipe = (state.recipes || []).find((r) => r.id === recipeId);
  const [servingIndex, setServingIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [completedSteps, setCompletedSteps] = useState({});

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  const toggleStep = (stepNum) => {
    setCompletedSteps((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#9a3412" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{recipe.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroTitle}>{recipe.title}</Text>
          <Text style={styles.heroSubtitle}>{recipe.subtitle}</Text>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Ionicons name="time" size={16} color="#fed7aa" />
              <Text style={styles.heroMetaText}>{recipe.totalTime}</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="speedometer" size={16} color="#fed7aa" />
              <Text style={styles.heroMetaText}>{recipe.difficulty}</Text>
            </View>
            <View style={styles.heroMetaItem}>
              <Ionicons name="flame" size={16} color="#fed7aa" />
              <Text style={styles.heroMetaText}>{recipe.category}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.descText}>{recipe.description}</Text>
          <View style={styles.tagsRow}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Serving Toggle */}
        <View style={styles.servingToggle}>
          {recipe.servingOptions.map((opt, idx) => (
            <TouchableOpacity
              key={opt}
              style={[styles.servingBtn, servingIndex === idx && styles.servingBtnActive]}
              onPress={() => setServingIndex(idx)}
            >
              <Ionicons name="people" size={14} color={servingIndex === idx ? '#fff' : '#9a3412'} />
              <Text style={[styles.servingText, servingIndex === idx && styles.servingTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Ionicons name="basket" size={16} color={activeTab === 'ingredients' ? '#9a3412' : '#9ca3af'} />
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
              Ingredients ({recipe.ingredients.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
            onPress={() => setActiveTab('instructions')}
          >
            <Ionicons name="list" size={16} color={activeTab === 'instructions' ? '#9a3412' : '#9ca3af'} />
            <Text style={[styles.tabText, activeTab === 'instructions' && styles.tabTextActive]}>
              Steps ({recipe.instructions.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <View style={styles.section}>
            {recipe.ingredients.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <View style={styles.ingredientIcon}>
                  <Ionicons name={ing.icon || 'ellipse'} size={18} color="#c2410c" />
                </View>
                <Text style={styles.ingredientName}>{ing.name}</Text>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{ing.quantities[servingIndex]}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <View style={styles.section}>
            {recipe.instructions.map((inst, idx) => {
              const isCompleted = completedSteps[inst.step];
              const stepColor = STEP_COLORS[idx % STEP_COLORS.length];

              return (
                <TouchableOpacity
                  key={inst.step}
                  style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}
                  activeOpacity={0.7}
                  onPress={() => toggleStep(inst.step)}
                >
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepNumber, { backgroundColor: isCompleted ? '#22c55e' : stepColor }]}>
                      {isCompleted ? (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      ) : (
                        <Text style={styles.stepNumberText}>{inst.step}</Text>
                      )}
                    </View>
                    <Text style={[styles.stepTitle, isCompleted && styles.stepTitleCompleted]}>
                      {inst.title}
                    </Text>
                    {inst.timer && (
                      <View style={styles.timerBadge}>
                        <Ionicons name="timer" size={12} color="#c2410c" />
                        <Text style={styles.timerText}>{inst.timer}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.stepDesc, isCompleted && styles.stepDescCompleted]}>
                    {inst.description}
                  </Text>

                  {inst.tip && (
                    <View style={styles.tipBox}>
                      <Ionicons name="bulb" size={14} color="#d97706" />
                      <Text style={styles.tipText}>{inst.tip}</Text>
                    </View>
                  )}

                  <View style={styles.stepIngredientsRow}>
                    {inst.ingredientsUsed.map((ing) => (
                      <View key={ing} style={styles.stepIngBadge}>
                        <Text style={styles.stepIngText}>{ing}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Progress */}
            <View style={styles.progressBar}>
              <Text style={styles.progressText}>
                {completedCount} of {recipe.instructions.length} steps completed
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(completedCount / recipe.instructions.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7ed' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff7ed',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, fontSize: 17, fontWeight: '700', color: '#9a3412',
    textAlign: 'center', marginHorizontal: 8,
  },
  scroll: { flex: 1 },
  errorText: { textAlign: 'center', color: '#ef4444', fontSize: 16, marginTop: 60 },

  heroBanner: {
    backgroundColor: '#9a3412',
    paddingVertical: 28, paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: '#fed7aa', marginTop: 4, textAlign: 'center' },
  heroMeta: { flexDirection: 'row', gap: 20, marginTop: 14 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { color: '#fed7aa', fontSize: 13, fontWeight: '600' },

  descSection: { padding: 16 },
  descText: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: {
    backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1, borderColor: '#fed7aa',
  },
  tagText: { fontSize: 11, color: '#c2410c', fontWeight: '600' },

  servingToggle: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 4, gap: 4,
  },
  servingBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  servingBtnActive: { backgroundColor: '#c2410c' },
  servingText: { fontSize: 13, fontWeight: '600', color: '#9a3412' },
  servingTextActive: { color: '#fff' },

  tabRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, gap: 8 },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 10,
    borderWidth: 1.5, borderColor: '#e5e7eb',
  },
  tabActive: { borderColor: '#c2410c', backgroundColor: '#fff7ed' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  tabTextActive: { color: '#9a3412' },

  section: { paddingHorizontal: 16 },

  ingredientRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 6,
  },
  ingredientIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff7ed',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  ingredientName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1f2937' },
  quantityBadge: {
    backgroundColor: '#c2410c', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  quantityText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  stepCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10,
    borderLeftWidth: 3, borderLeftColor: '#ea580c',
  },
  stepCardCompleted: {
    backgroundColor: '#f0fdf4', borderLeftColor: '#22c55e', opacity: 0.85,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepNumber: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  stepNumberText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  stepTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1f2937' },
  stepTitleCompleted: { color: '#6b7280', textDecorationLine: 'line-through' },
  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#fff7ed', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  timerText: { fontSize: 11, fontWeight: '700', color: '#c2410c' },
  stepDesc: { fontSize: 13, color: '#4b5563', lineHeight: 19, marginBottom: 8 },
  stepDescCompleted: { color: '#9ca3af' },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#fffbeb', padding: 10, borderRadius: 8, marginBottom: 8,
  },
  tipText: { flex: 1, fontSize: 12, color: '#92400e', lineHeight: 17 },

  stepIngredientsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  stepIngBadge: {
    backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  stepIngText: { fontSize: 11, color: '#92400e', fontWeight: '600' },

  progressBar: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 4,
  },
  progressText: { fontSize: 13, fontWeight: '600', color: '#4b5563', marginBottom: 8 },
  progressTrack: {
    height: 6, backgroundColor: '#e5e7eb', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 3 },
});
