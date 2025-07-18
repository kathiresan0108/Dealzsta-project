import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function GrandPopup({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  type = 'default',
}) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={[styles.popup, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          {message && <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>}

          {/* Vertical buttons layout */}
          <View style={styles.buttonColumn}>
            {buttons.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  btn.style === 'primary'
                    ? { backgroundColor: theme.primary }
                    : { backgroundColor: theme.surface },
                ]}
                onPress={btn.onPress}
              >
                <Text
                  style={{
                    color: btn.style === 'primary' ? 'white' : theme.text,
                    fontWeight: '500',
                  }}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttonColumn: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
});
