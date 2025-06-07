import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';

export default function GrandPopup({ 
  visible, 
  title, 
  message, 
  buttons = [], 
  onDismiss,
  type = 'info' // 'success', 'error', 'warning', 'info'
}) {
  const { theme, isDark } = useTheme();

  const getTypeColors = () => {
    switch (type) {
      case 'success':
        return ['#00B894', '#55EFC4'];
      case 'error':
        return ['#E17055', '#FD79A8'];
      case 'warning':
        return ['#FDCB6E', '#FFD93D'];
      default:
        return theme.gradient;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onDismiss}
    >
      <BlurView intensity={isDark ? 20 : 80} style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={getTypeColors()}
            style={styles.popup}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[styles.content, { backgroundColor: theme.cardBackground }]}>
              {title && (
                <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
              )}
              {message && (
                <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
              )}
              
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'primary' && { backgroundColor: theme.primary },
                      button.style === 'secondary' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border }
                    ]}
                    onPress={button.onPress}
                  >
                    <Text style={[
                      styles.buttonText,
                      button.style === 'primary' ? { color: 'white' } : { color: theme.text }
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '85%',
    maxWidth: 400,
  },
  popup: {
    borderRadius: 20,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  content: {
    padding: 24,
    borderRadius: 17,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});