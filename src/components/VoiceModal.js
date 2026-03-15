import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { useApp } from '../store/AppContext';

export default function VoiceModal({ visible, onClose }) {
  const { dispatch } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  // Animated waveform bars
  const bars = useRef(Array.from({ length: 15 }, () => new Animated.Value(10))).current;

  useEffect(() => {
    if (visible) {
      setIsListening(true);
      setTranscript('');
      // Simulate listening with animated bars
      bars.forEach((bar, i) => {
        const animate = () => {
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 35 + 10,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: 10,
              duration: 300 + Math.random() * 200,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (isListening) animate();
          });
        };
        setTimeout(animate, i * 50);
      });
    }
  }, [visible]);

  const handleSave = () => {
    if (!transcript.trim()) {
      onClose();
      return;
    }
    const now = new Date().toISOString();
    const noteId = Date.now().toString();
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: noteId,
        title: transcript.slice(0, 50) + (transcript.length > 50 ? '...' : ''),
        content: transcript,
        labels: [],
        type: 'text',
        createdAt: now,
        updatedAt: now,
        tasks: [],
        reminder: null,
      },
    });
    setTranscript('');
    setIsListening(false);
    onClose();
  };

  const handleAddReminder = () => {
    if (!transcript.trim()) {
      onClose();
      return;
    }
    const now = new Date().toISOString();
    const noteId = Date.now().toString();
    dispatch({
      type: 'ADD_NOTE',
      payload: {
        id: noteId,
        title: transcript.slice(0, 50) + (transcript.length > 50 ? '...' : ''),
        content: transcript,
        labels: [],
        type: 'text',
        createdAt: now,
        updatedAt: now,
        tasks: [],
        reminder: { id: `r-${noteId}`, date: new Date(Date.now() + 86400000).toISOString(), completed: false },
      },
    });
    setTranscript('');
    setIsListening(false);
    onClose();
  };

  // Simulated speech-to-text: in a real app use expo-speech or a native STT API
  // For demo, we let user type or show a placeholder
  useEffect(() => {
    if (visible && isListening) {
      const timer = setTimeout(() => {
        setTranscript("Reminder: Doctor's appointment tomorrow at 9 AM");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, isListening]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.status}>{isListening ? 'Listening...' : 'Tap to start'}</Text>

          <View style={styles.waveform}>
            {bars.map((bar, i) => (
              <Animated.View
                key={i}
                style={[styles.bar, { height: bar }]}
              />
            ))}
          </View>

          {transcript ? (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            </View>
          ) : null}

          <View style={styles.spacer} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reminderBtn} onPress={handleAddReminder}>
              <Text style={styles.reminderBtnText}>Add Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    minHeight: 420,
    padding: 32,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    padding: 4,
  },
  closeText: { fontSize: 20, color: '#2563eb' },
  status: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 24,
    marginTop: 16,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 60,
    marginBottom: 32,
  },
  bar: {
    width: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  transcriptBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  transcriptText: {
    color: '#6b7280',
    fontStyle: 'italic',
    fontSize: 15,
    textAlign: 'center',
  },
  spacer: { flex: 1 },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 24,
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
  },
  saveBtnText: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  reminderBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  reminderBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
