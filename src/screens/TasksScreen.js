import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (taskDay < today) {
    return { text: `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — Overdue`, overdue: true };
  }
  if (taskDay.getTime() === today.getTime()) {
    return { text: `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`, overdue: false };
  }
  if (taskDay.getTime() === tomorrow.getTime()) {
    return { text: 'Tomorrow', overdue: false };
  }
  return { text: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), overdue: false };
}

export default function TasksScreen() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const allTasks = state.notes.flatMap((note) =>
    note.tasks.map((task) => ({ ...task, noteTitle: note.title, noteId: note.id }))
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);

  const filtered = allTasks.filter((task) => {
    switch (activeTab) {
      case 'today': {
        if (task.completed) return false;
        if (!task.dueDate) return false;
        const d = new Date(task.dueDate);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === today.getTime();
      }
      case 'upcoming':
        return !task.completed && task.dueDate && new Date(task.dueDate) > tomorrow;
      case 'done':
        return task.completed;
      default:
        return true;
    }
  });

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);
  const tabs = ['All', 'Today', 'Upcoming', 'Done'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Ionicons name="settings-outline" size={22} color="#6b7280" />
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
        {pending.map((task) => {
          const due = formatDueDate(task.dueDate);
          return (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => dispatch({ type: 'TOGGLE_TASK', payload: { noteId: task.noteId, taskId: task.id } })}
            >
              <View style={styles.taskCheckbox} />
              <View style={styles.taskInfo}>
                <Text style={styles.taskText}>{task.text}</Text>
                <Text style={styles.taskSource}>From: {task.noteTitle}</Text>
              </View>
              {due && <Text style={[styles.taskDue, due.overdue && styles.taskDueOverdue]}>{due.text}</Text>}
            </TouchableOpacity>
          );
        })}

        {completed.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>COMPLETED</Text>
            {completed.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskItem, { opacity: 0.6 }]}
                onPress={() => dispatch({ type: 'TOGGLE_TASK', payload: { noteId: task.noteId, taskId: task.id } })}
              >
                <View style={styles.taskCheckboxDone}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskText, { textDecorationLine: 'line-through', color: '#9ca3af' }]}>{task.text}</Text>
                  <Text style={styles.taskSource}>From: {task.noteTitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {filtered.length === 0 && <Text style={styles.empty}>No tasks in this category.</Text>}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
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
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
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
  listContent: { padding: 16, paddingBottom: 100 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  taskCheckboxDone: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskInfo: { flex: 1 },
  taskText: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  taskSource: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  taskDue: { fontSize: 12, fontWeight: '600', color: '#2563eb' },
  taskDueOverdue: { color: '#ef4444' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },
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
