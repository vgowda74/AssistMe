import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

const LABEL_COLORS = {
  work: '#2563eb',
  personal: '#22c55e',
  important: '#ef4444',
  todo: '#f59e0b',
  ideas: '#a855f7',
  reading: '#a855f7',
  travel: '#f59e0b',
  project: '#1e40af',
};

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onPress }) {
  const { state, dispatch } = useApp();
  const borderColor = note.labels.length > 0 ? (LABEL_COLORS[note.labels[0]] || '#e5e7eb') : '#e5e7eb';
  const visibleTasks = note.tasks.slice(0, 3);
  const remaining = note.tasks.length - 3;

  const handleToggleTask = (taskId) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { noteId: note.id, taskId } });
  };

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: borderColor }]} onPress={() => onPress?.(note)} activeOpacity={0.7}>
      <Text style={styles.title}>{note.title}</Text>

      {note.type === 'checklist' && visibleTasks.length > 0 ? (
        <View style={styles.tasks}>
          {visibleTasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskRow} onPress={() => handleToggleTask(task.id)}>
              <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                {task.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.taskText, task.completed && styles.taskCompleted]}>{task.text}</Text>
            </TouchableOpacity>
          ))}
          {remaining > 0 && <Text style={styles.more}>+{remaining} more</Text>}
        </View>
      ) : note.content ? (
        <Text style={styles.content} numberOfLines={2}>{note.content}</Text>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.labelsRow}>
          <Ionicons name="pricetag-outline" size={14} color="#9ca3af" />
          {note.labels.map((lid) => {
            const label = state.labels.find((l) => l.id === lid);
            if (!label) return null;
            return (
              <View key={lid} style={[styles.labelTag, { borderColor: LABEL_COLORS[lid] || '#d1d5db' }]}>
                <Text style={[styles.labelText, { color: LABEL_COLORS[lid] || '#6b7280' }]}>{label.name}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={13} color="#9ca3af" />
          <Text style={styles.time}>{formatTime(note.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 21,
    marginBottom: 12,
  },
  tasks: { marginBottom: 12 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  taskText: { fontSize: 14, color: '#374151', flex: 1 },
  taskCompleted: { textDecorationLine: 'line-through', color: '#9ca3af' },
  more: { fontSize: 13, color: '#9ca3af', paddingLeft: 32, marginTop: 4 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  labelTag: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  labelText: { fontSize: 12, fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { fontSize: 12, color: '#9ca3af' },
});
