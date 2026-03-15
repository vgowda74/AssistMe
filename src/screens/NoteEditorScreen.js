import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

export default function NoteEditorScreen({ route, navigation }) {
  const { state, dispatch } = useApp();
  const noteId = route.params?.noteId;
  const existing = noteId ? state.notes.find((n) => n.id === noteId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [content, setContent] = useState(existing?.content || '');
  const [selectedLabels, setSelectedLabels] = useState(existing?.labels || []);
  const [noteType, setNoteType] = useState(existing?.type || 'text');
  const [tasks, setTasks] = useState(existing?.tasks || []);
  const [newTask, setNewTask] = useState('');

  const toggleLabel = (labelId) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((l) => l !== labelId) : [...prev, labelId]
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: `t-${Date.now()}`, text: newTask.trim(), completed: false, dueDate: null }]);
    setNewTask('');
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim() && tasks.length === 0) {
      navigation.goBack();
      return;
    }
    const now = new Date().toISOString();
    if (existing) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { id: existing.id, title: title.trim() || 'Untitled', content, labels: selectedLabels, type: noteType, tasks, updatedAt: now },
      });
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: {
          id: Date.now().toString(),
          title: title.trim() || 'Untitled',
          content,
          labels: selectedLabels,
          type: noteType,
          createdAt: now,
          updatedAt: now,
          tasks,
          reminder: null,
        },
      });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'DELETE_NOTE', payload: existing.id });
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {existing && (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 16 }}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          placeholder="Note title..."
          placeholderTextColor="#9ca3af"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, noteType === 'text' && styles.typeBtnActive]}
            onPress={() => setNoteType('text')}
          >
            <Text style={[styles.typeBtnText, noteType === 'text' && styles.typeBtnTextActive]}>Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, noteType === 'checklist' && styles.typeBtnActive]}
            onPress={() => setNoteType('checklist')}
          >
            <Text style={[styles.typeBtnText, noteType === 'checklist' && styles.typeBtnTextActive]}>Checklist</Text>
          </TouchableOpacity>
        </View>

        {noteType === 'text' ? (
          <TextInput
            style={styles.contentInput}
            placeholder="Write your note..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        ) : (
          <View style={styles.tasksList}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskItemText}>{task.text}</Text>
                <TouchableOpacity onPress={() => removeTask(task.id)}>
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addTaskRow}>
              <TextInput
                style={styles.addTaskInput}
                placeholder="Add a task..."
                placeholderTextColor="#9ca3af"
                value={newTask}
                onChangeText={setNewTask}
                onSubmitEditing={addTask}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addTaskBtn} onPress={addTask}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.labelsSection}>
          <Text style={styles.labelsSectionTitle}>Labels:</Text>
          <View style={styles.labelChips}>
            {state.labels.map((label) => (
              <TouchableOpacity
                key={label.id}
                style={[
                  styles.labelChip,
                  {
                    borderColor: label.color,
                    backgroundColor: selectedLabels.includes(label.id) ? label.color : 'transparent',
                  },
                ]}
                onPress={() => toggleLabel(label.id)}
              >
                <Text style={[styles.labelChipText, { color: selectedLabels.includes(label.id) ? '#fff' : label.color }]}>
                  {label.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  body: { flex: 1, padding: 16 },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    padding: 0,
  },
  typeToggle: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
  },
  typeBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  typeBtnTextActive: { color: '#fff' },
  contentInput: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  tasksList: { marginBottom: 16 },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  taskItemText: { fontSize: 14, color: '#374151', flex: 1 },
  addTaskRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  addTaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addTaskBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  labelsSectionTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8 },
  labelChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  labelChip: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  labelChipText: { fontSize: 12, fontWeight: '600' },
});
