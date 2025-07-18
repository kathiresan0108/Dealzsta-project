// GroupMessageScreen.js

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Image,
  Dimensions,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ChevronLeft,
  Send,
  LogOut,
  Link2,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const { width: screenWidth } = Dimensions.get('window');

export default function GroupMessageScreen() {
  const router = useRouter();
  const { id: groupId } = useLocalSearchParams();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  // Load group details
  useFocusEffect(
    React.useCallback(() => {
      const loadGroup = async () => {
        try {
          const stored = await AsyncStorage.getItem('groups');
          if (stored) {
            const parsed = JSON.parse(stored);
            const group = parsed.find((g) => g.id === groupId);
            if (group) {
              setGroupName(group.user.name);
              setGroupImage(group.user.image);
            } else {
              Alert.alert('Error', 'Group not found', [{ text: 'OK', onPress: () => router.replace('/message') }]);
            }
          }
        } catch (error) {
          console.error('Error loading group:', error);
        }
      };

      const loadMessages = async () => {
        const stored = await AsyncStorage.getItem(`messages-${groupId}`);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      };

      loadGroup();
      loadMessages();
    }, [groupId])
  );

  // Persist messages on change
  useEffect(() => {
    AsyncStorage.setItem(`messages-${groupId}`, JSON.stringify(messages));
  }, [messages]);

  const handleBackPress = () => {
    router.replace('/message');
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const now = new Date();
    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: inputText.trim(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleDeleteMessage = (id) => {
    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setMessages((prev) => prev.filter((msg) => msg.id !== id));
        },
      },
    ]);
  };

  const handleCopyLink = async () => {
    try {
      const link = `https://yourapp.com/group/${groupId}`;
      await Clipboard.setStringAsync(link);
      Alert.alert('Success', 'Group link copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert('Leave Group', `Are you sure you want to leave "${groupName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          const stored = await AsyncStorage.getItem('groups');
          if (stored) {
            const parsed = JSON.parse(stored);
            const updated = parsed.filter((g) => g.id !== groupId);
            await AsyncStorage.setItem('groups', JSON.stringify(updated));
            await AsyncStorage.removeItem(`messages-${groupId}`);
          }
          router.replace('/message');
        },
      },
    ]);
  };

  const getFormattedDate = (date) => {
    const today = new Date();
    const msgDate = new Date(date);
    return today.toDateString() === msgDate.toDateString()
      ? 'Today'
      : msgDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const groupMessagesByDate = (msgs) => {
    const grouped = {};
    msgs.forEach((msg) => {
      const dateKey = getFormattedDate(msg.timestamp);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#b19cd9" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                  <ChevronLeft size={24} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push(`/edit-group/${groupId}`)} style={styles.groupInfo}>
                  <View style={styles.groupImageContainer}>
                    <Image
                      source={{ uri: groupImage || 'https://via.placeholder.com/40/b19cd9/FFFFFF?text=G' }}
                      style={styles.groupImage}
                    />
                    <View style={styles.onlineIndicator} />
                  </View>
                  <View style={styles.groupTextInfo}>
                    <Text style={styles.groupName} numberOfLines={1}>{groupName || 'Loading...'}</Text>
                    <Text style={styles.groupStatus}>Tap to view info</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleCopyLink} style={styles.actionButton}>
                  <Link2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLeaveGroup} style={[styles.actionButton, styles.leaveButton]}>
                  <LogOut size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Message list */}
            <SectionList
              ref={flatListRef}
              sections={groupMessagesByDate(messages)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.messageBubble} onLongPress={() => handleDeleteMessage(item.id)}>
                  <Text style={styles.messageText}>{item.message}</Text>
                  <Text style={styles.messageMeta}>{item.sender} • {item.time}</Text>
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateHeaderText}>{title}</Text>
                </View>
              )}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Send size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#b19cd9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#10B981',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupTextInfo: {
    flex: 1,
  },
  groupName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  groupStatus: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  leaveButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  messagesContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  messageBubble: {
    backgroundColor: '#b19cd9',
    alignSelf: 'flex-end',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  messageMeta: {
    color: '#f0e6ff',
    fontSize: 11,
    marginTop: 6,
  },
  dateHeader: {
    alignSelf: 'center',
    backgroundColor: '#e1d3f3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 10,
  },
  dateHeaderText: {
    fontSize: 12,
    color: '#6B21A8',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#b19cd9',
    padding: 10,
    borderRadius: 20,
  },
});