import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

function formatReminderDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (taskDay.getTime() === today.getTime()) return `Today at ${time}`;
  if (taskDay.getTime() === tomorrow.getTime()) return `Tomorrow at ${time}`;
  if (taskDay < today) {
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${time} — Overdue`;
  }
  return `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${time}`;
}

export default function RemindersScreen() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('upcoming');

  const now = new Date();
  const reminders = state.notes
    .filter((n) => n.reminder)
    .map((n) => ({
      noteId: n.id,
      title: n.title,
      noteTitle: n.title,
      date: n.reminder.date,
      completed: n.reminder.completed,
      overdue: !n.reminder.completed && new Date(n.reminder.date) < now,
    }));

  const filtered = reminders.filter((r) => {
    switch (activeTab) {
      case 'upcoming': return !r.completed && !r.overdue;
      case 'overdue': return !r.completed && r.overdue;
      case 'completed': return r.completed;
      default: return true;
    }
  });

  const tabs = ['Upcoming', 'Overdue', 'Completed'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={26} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab.toLowerCase() && styles.tabActive]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map((r) => (
          <TouchableOpacity
            key={r.noteId}
            style={[styles.reminderItem, r.overdue && styles.reminderOverdue]}
            onPress={() => !r.completed && dispatch({ type: 'COMPLETE_REMINDER', payload: r.noteId })}
          >
            <View style={[styles.dot, r.overdue && styles.dotOverdue]} />
            <View style={styles.reminderInfo}>
              <Text style={[styles.reminderTitle, r.overdue && styles.reminderTitleOverdue]}>{r.title}</Text>
              <Text style={styles.reminderNote}>{r.noteTitle} note</Text>
              <Text style={[styles.reminderDate, r.overdue && styles.reminderDateOverdue]}>
                {formatReminderDate(r.date)}
              </Text>
            </View>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && <Text style={styles.empty}>No reminders in this category.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 3,
    marginBottom: 12,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#1f2937' },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 40 },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  reminderOverdue: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb' },
  dotOverdue: { backgroundColor: '#ef4444' },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  reminderTitleOverdue: { color: '#ef4444' },
  reminderNote: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  reminderDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  reminderDateOverdue: { color: '#ef4444' },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 15 },
});
