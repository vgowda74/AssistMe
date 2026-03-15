import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86400000);
  if (d.toDateString() === now.toDateString()) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  if (d.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SearchScreen({ navigation }) {
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const q = query.toLowerCase().trim();

  const matchedNotes = q ? state.notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) : [];
  const matchedTasks = q ? state.notes.flatMap((n) => n.tasks.filter((t) => t.text.toLowerCase().includes(q)).map((t) => ({ ...t, noteTitle: n.title }))) : [];
  const matchedReminders = q ? state.notes.filter((n) => n.reminder && n.title.toLowerCase().includes(q)).map((n) => ({ noteId: n.id, title: n.title, date: n.reminder.date })) : [];

  const noResults = q && matchedNotes.length === 0 && matchedTasks.length === 0 && matchedReminders.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
        {matchedNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NOTES</Text>
            {matchedNotes.map((note) => (
              <TouchableOpacity key={note.id} style={styles.resultCard} onPress={() => navigation.navigate('NoteEditor', { noteId: note.id })}>
                <Text style={styles.resultTitle}>{note.title}</Text>
                {note.content ? <Text style={styles.resultDesc} numberOfLines={1}>{note.content}</Text> : null}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {matchedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TASKS</Text>
            {matchedTasks.map((task) => (
              <View key={task.id} style={styles.resultCard}>
                <View style={styles.resultRow}>
                  <View style={styles.taskCheckbox} />
                  <View>
                    <Text style={styles.resultTitle}>{task.text}</Text>
                    {task.dueDate && <Text style={styles.resultDesc}>{formatDate(task.dueDate)}</Text>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {matchedReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>REMINDERS</Text>
            {matchedReminders.map((r) => (
              <View key={r.noteId} style={styles.resultCard}>
                <View style={styles.resultRow}>
                  <View style={styles.reminderDot} />
                  <View>
                    <Text style={styles.resultTitle}>{r.title}</Text>
                    <Text style={styles.resultDesc}>{formatDate(r.date)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {noResults && <Text style={styles.empty}>No results found for "{query}"</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 16, color: '#1f2937' },
  cancel: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  results: { flex: 1 },
  resultsContent: { paddingHorizontal: 16, paddingBottom: 40 },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskCheckbox: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#d1d5db' },
  reminderDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb' },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  resultDesc: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 15 },
});
