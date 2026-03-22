import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import NoteCard from '../components/NoteCard';
import VoiceModal from '../components/VoiceModal';

export default function NotesScreen({ navigation }) {
  const { state } = useApp();
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top || Constants.statusBarHeight || 44;
  const [showVoice, setShowVoice] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu" size={26} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>AssistMe</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>Search your notes</Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {state.notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onPress={() => navigation.navigate('NoteEditor', { noteId: note.id })}
          />
        ))}
        {state.notes.length === 0 && (
          <Text style={styles.empty}>No notes yet. Tap + to create one!</Text>
        )}
      </ScrollView>

      {/* Voice FAB */}
      <TouchableOpacity style={styles.micFab} onPress={() => setShowVoice(true)}>
        <Ionicons name="mic-outline" size={24} color="#2563eb" />
      </TouchableOpacity>

      {/* Add FAB */}
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  appTitle: { fontSize: 22, fontWeight: '800', color: '#1f2937' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 4,
  },
  searchPlaceholder: { flex: 1, color: '#9ca3af', fontSize: 15 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 15 },
  micFab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
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
