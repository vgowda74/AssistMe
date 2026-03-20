import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import NoteCard from '../components/NoteCard';
import VoiceModal from '../components/VoiceModal';

export default function NotesScreen({ navigation }) {
  const { state } = useApp();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showVoice, setShowVoice] = useState(false);

  const filters = [
    { id: 'all', label: 'All' },
    ...state.labels.map((l) => ({ id: l.id, label: l.name })),
  ];

  const filteredNotes =
    activeFilter === 'all'
      ? state.notes
      : state.notes.filter((n) => n.labels.includes(activeFilter));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>AssistMe</Text>
          <TouchableOpacity onPress={() => setShowVoice(true)}>
            <Ionicons name="mic" size={24} color="#7c3aed" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>Search your notes...</Text>
          <Ionicons name="pencil" size={16} color="#9ca3af" />
        </TouchableOpacity>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text style={[styles.filterText, activeFilter === f.id && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notes List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPress={() => navigation.navigate('NoteEditor', { noteId: note.id })}
          />
        ))}
        {filteredNotes.length === 0 && (
          <Text style={styles.empty}>No notes yet. Tap + to create one!</Text>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NoteEditor', { noteId: null })}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <VoiceModal visible={showVoice} onClose={() => setShowVoice(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appTitle: { fontSize: 24, fontWeight: '800', color: '#1f2937' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 12,
  },
  searchPlaceholder: { flex: 1, color: '#9ca3af', fontSize: 15 },
  filtersRow: { marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  filterTextActive: { color: '#fff' },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 15 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
