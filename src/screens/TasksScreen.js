import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (taskDay < today) {
    return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), overdue: true };
  }
  if (taskDay.getTime() === today.getTime()) {
    return { text: `Today, ${time}`, overdue: false };
  }
  if (taskDay.getTime() === tomorrow.getTime()) {
    return { text: `Tomorrow, ${time}`, overdue: false };
  }
  return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), overdue: false };
}

export default function TasksScreen() {
  const { state, dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top || Constants.statusBarHeight || 44;
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
      <View style={[styles.header, { paddingTop: statusBarHeight + 12 }]}>
        <Text style={styles.title}>Tasks</Text>
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
                <Text style={styles.taskSource}>from {task.noteTitle}</Text>
              </View>
              {due && (
                <View style={styles.dueDateContainer}>
                  <Text style={[styles.taskDue, due.overdue && styles.taskDueOverdue]}>{due.text}</Text>
                  {!due.overdue && <View style={styles.dueDot} />}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {completed.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>COMPLETED</Text>
            {completed.map((task) => {
              const due = formatDueDate(task.dueDate);
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskItem, { opacity: 0.6 }]}
                  onPress={() => dispatch({ type: 'TOGGLE_TASK', payload: { noteId: task.noteId, taskId: task.id } })}
                >
                  <View style={styles.taskCheckboxDone}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={[styles.taskText, { textDecorationLine: 'line-through', color: '#9ca3af' }]}>{task.text}</Text>
                    <Text style={styles.taskSource}>from {task.noteTitle}</Text>
                  </View>
                  {due && <Text style={[styles.taskDue, { color: '#9ca3af' }]}>{due.text}</Text>}
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {filtered.length === 0 && <Text style={styles.empty}>No tasks in this category.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 32, fontWeight: '800', color: '#1f2937' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 3,
    marginBottom: 12,
    marginTop: 8,
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
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  taskCheckboxDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: { flex: 1 },
  taskText: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  taskSource: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  dueDateContainer: { alignItems: 'flex-end', gap: 4 },
  taskDue: { fontSize: 13, fontWeight: '600', color: '#ef4444' },
  taskDueOverdue: { color: '#ef4444' },
  dueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  empty: { textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 15 },
});
