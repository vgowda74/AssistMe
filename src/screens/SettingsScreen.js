import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../store/AppContext';

export default function SettingsScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  const handleClearData = () => {
    Alert.alert('Clear All Data', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('assistme-state');
          // Reload would require app restart in native
          Alert.alert('Done', 'Please restart the app to complete the reset.');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Profile */}
      <TouchableOpacity style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>AssistMe User</Text>
          <Text style={styles.profilePlan}>Free Plan • Upgrade to Pro</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* General */}
      <Text style={styles.sectionLabel}>GENERAL</Text>
      <View style={styles.card}>
        <View style={[styles.item, styles.borderBottom]}>
          <Text style={styles.itemIcon}>🔔</Text>
          <Text style={styles.itemLabel}>Notification Sounds</Text>
          <Text style={styles.itemValue}>{settings.notificationSound}</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemIcon}>💤</Text>
          <Text style={styles.itemLabel}>Snooze Options</Text>
          <Text style={styles.itemValue}>{settings.snoozeMinutes} min</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>

      {/* Voice */}
      <Text style={styles.sectionLabel}>VOICE</Text>
      <View style={styles.card}>
        <View style={[styles.item, styles.borderBottom]}>
          <Text style={styles.itemIcon}>🎙️</Text>
          <Text style={styles.itemLabel}>Voice Recording</Text>
          <Text style={styles.itemValue}>{settings.voiceQuality}</Text>
          <Text style={styles.arrow}>›</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemIcon}>💾</Text>
          <Text style={styles.itemLabel}>Auto-Save Voice Notes</Text>
          <Switch
            value={settings.autoSaveVoice}
            onValueChange={(v) => updateSetting('autoSaveVoice', v)}
            trackColor={{ false: '#d1d5db', true: '#22c55e' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Security */}
      <Text style={styles.sectionLabel}>SECURITY</Text>
      <View style={styles.card}>
        <View style={[styles.item, styles.borderBottom]}>
          <Text style={styles.itemIcon}>🔒</Text>
          <Text style={styles.itemLabel}>App Lock</Text>
          <Switch
            value={settings.appLock}
            onValueChange={(v) => updateSetting('appLock', v)}
            trackColor={{ false: '#d1d5db', true: '#22c55e' }}
            thumbColor="#fff"
          />
        </View>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemIcon}>🔑</Text>
          <Text style={styles.itemLabel}>Change Passcode</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Data */}
      <Text style={styles.sectionLabel}>DATA</Text>
      <View style={styles.card}>
        <TouchableOpacity style={[styles.item, styles.borderBottom]}>
          <Text style={styles.itemIcon}>📤</Text>
          <Text style={styles.itemLabel}>Export Notes</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleClearData}>
          <Text style={styles.itemIcon}>🗑️</Text>
          <Text style={[styles.itemLabel, { color: '#ef4444' }]}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: { color: '#2563eb', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '800', color: '#1f2937' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#60a5fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#1f2937' },
  profilePlan: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemIcon: { fontSize: 18 },
  itemLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937' },
  itemValue: { fontSize: 14, color: '#9ca3af' },
  arrow: { fontSize: 18, color: '#d1d5db' },
});
