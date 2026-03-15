import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../store/AppContext';

const COLOR_OPTIONS = ['#2563eb', '#22c55e', '#ef4444', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6'];

export default function LabelsScreen() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    dispatch({
      type: 'ADD_LABEL',
      payload: {
        id: newName.toLowerCase().replace(/\s+/g, '-'),
        name: newName.trim(),
        color: newColor,
        noteCount: 0,
      },
    });
    setNewName('');
    setNewColor(COLOR_OPTIONS[0]);
    setShowCreate(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Labels</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editBtn}>{isEditing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        <View style={styles.card}>
          {state.labels.map((label, i) => (
            <TouchableOpacity key={label.id} style={[styles.labelItem, i < state.labels.length - 1 && styles.borderBottom]}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => dispatch({ type: 'DELETE_LABEL', payload: label.id })}
                >
                  <Text style={styles.deleteBtnText}>−</Text>
                </TouchableOpacity>
              )}
              <View style={[styles.dot, { backgroundColor: label.color }]} />
              <Text style={styles.labelName}>{label.name}</Text>
              <Text style={styles.labelCount}>{label.noteCount} notes</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(!showCreate)}>
          <Ionicons name="sparkles-outline" size={18} color="#2563eb" />
          <Text style={styles.createBtnText}>Create New Label</Text>
        </TouchableOpacity>

        {showCreate && (
          <View style={styles.createForm}>
            <TextInput
              style={styles.createInput}
              placeholder="Label name..."
              placeholderTextColor="#9ca3af"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleCreate}
            />
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorOption, { backgroundColor: c }, newColor === c && styles.colorSelected]}
                  onPress={() => setNewColor(c)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.createSaveBtn} onPress={handleCreate}>
              <Text style={styles.createSaveBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
        )}
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
  editBtn: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  deleteBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: -2 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  labelName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1f2937' },
  labelCount: { fontSize: 14, color: '#9ca3af' },
  arrow: { fontSize: 18, color: '#d1d5db' },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  createBtnText: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  createForm: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  createInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorOption: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: 'transparent' },
  colorSelected: { borderColor: '#1f2937' },
  createSaveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createSaveBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
