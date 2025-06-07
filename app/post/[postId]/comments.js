import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments for this postId
    fetchComments(postId);
  }, [postId]);

  const fetchComments = async (postId) => {
    // API call here to fetch comments for this postId
    // For demo, use static data
    setComments([
      { id: '1', user: 'Alice', text: 'Great post!' },
      { id: '2', user: 'Bob', text: 'Nice picture.' },
    ]);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const newEntry = {
      id: (comments.length + 1).toString(),
      user: 'You',  // Or get actual user name
      text: newComment.trim(),
    };

    // Add comment locally, in real app, call API to save then update list
    setComments([newEntry, ...comments]); // Newest comment on top
    setNewComment('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Comments for post {postId}</Text>

      <FlatList
        style={{ flex: 1, width: '100%' }}
        data={comments}
        keyExtractor={(item) => item.id}
        inverted={true} // To show newest comment at bottom (optional)
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.user}:</Text>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  commentItem: { flexDirection: 'row', marginBottom: 8 },
  commentUser: { fontWeight: '600', marginRight: 6 },
  commentText: { flexShrink: 1 },

  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
