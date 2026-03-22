import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';

export default function VoiceModal({ visible, onClose }) {
  const { dispatch } = useApp();
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top || Constants.statusBarHeight || 44;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const bars = useRef(Array.from({ length: 20 }, () => new Animated.Value(10))).current;

  useEffect(() => {
    if (visible) {
      setIsListening(true);
      setTranscript('');
      bars.forEach((bar, i) => {
        const animate = () => {
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 40 + 10,
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

  useEffect(() => {
    if (visible && isListening) {
      const timer = setTimeout(() => {
        setTranscript("Reminder: Doctor's appointment tomorrow at 9 AM");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, isListening]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.container, { paddingTop: statusBarHeight + 8 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Note</Text>
          <View style={styles.closeBtn} />
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View style={styles.redDot} />
            <Text style={styles.statusText}>{isListening ? 'Listening...' : 'Tap to start'}</Text>
          </View>
          <Text style={styles.subtitle}>Speak clearly into the microphone</Text>
        </View>

        {/* Waveform */}
        <View style={styles.waveform}>
          {bars.map((bar, i) => (
            <Animated.View
              key={i}
              style={[styles.bar, { height: bar }]}
            />
          ))}
        </View>

        {/* Transcript */}
        {transcript ? (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>"{transcript}"</Text>
          </View>
        ) : null}

        <View style={styles.spacer} />

        {/* Actions - stacked vertically */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.reminderBtn} onPress={handleAddReminder}>
            <Text style={styles.reminderBtnText}>Add Reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 20, color: '#1f2937', fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1f2937' },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f87171',
  },
  statusText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 80,
    marginBottom: 32,
  },
  bar: {
    width: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  transcriptBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
  },
  transcriptText: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
  spacer: { flex: 1 },
  actions: {
    gap: 12,
  },
  reminderBtn: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  reminderBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  saveBtn: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
  },
  saveBtnText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
});
