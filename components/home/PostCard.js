import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Share, Bookmark, QrCode, MoreHorizontal } from 'lucide-react-native';
import PostOptionsModal from '@/components/modals/PostOptionsModal';

export default function PostCard({ post, onLike, onComment, onShare, onSave, onClaim }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [likeAnimation] = useState(new Animated.Value(0));

  // Comment modal state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    onLike(post.id);

    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleProfilePress = () => {
    router.push(`/profile/${post.user.id}`);
  };

  const likeScale = likeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  // Open/close comment modal handlers
  const openCommentModal = () => setCommentModalVisible(true);
  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setCommentText('');
  };

  // Submit comment handler
  const submitComment = () => {
    if (commentText.trim().length === 0) return; // Don't submit empty comment
    onComment(post.id, commentText.trim());
    closeCommentModal();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: theme.text }]}>{post.user.name}</Text>
            <View style={styles.locationTime}>
              <Text style={[styles.location, { color: theme.textSecondary }]}>{post.location}</Text>
              <Text style={[styles.time, { color: theme.textSecondary }]}>• {post.timeAgo}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowOptionsModal(true)}>
          <MoreHorizontal size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image source={{ uri: post.image }} style={styles.postImage} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{post.title}</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>{post.description}</Text>

        {post.originalPrice && (
          <View style={styles.priceContainer}>
            <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>₹{post.originalPrice}</Text>
            <Text style={[styles.discountPrice, { color: theme.success }]}>₹{post.discountPrice}</Text>
            <Text style={[styles.discount, { color: theme.error }]}>{post.discount}% OFF</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart 
                size={24} 
                color={post.isLiked ? theme.like : theme.textSecondary}
                fill={post.isLiked ? theme.like : 'transparent'}
              />
            </Animated.View>
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={openCommentModal}>
            <MessageCircle size={24} color={theme.textSecondary} />
            <Text style={[styles.actionText, { color: theme.textSecondary }]}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Share size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onClaim(post.id)}>
            <QrCode size={24} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => onSave(post.id)}>
            <Bookmark 
              size={24} 
              color={post.isSaved ? theme.primary : theme.textSecondary}
              fill={post.isSaved ? theme.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <PostOptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        post={post}
      />

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCommentModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
              style={styles.commentBoxContainer}
            >
              <View style={[styles.commentBox, { backgroundColor: theme.cardBackground }]}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.textSecondary }]}
                  placeholder="Write a comment..."
                  placeholderTextColor={theme.textSecondary}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  autoFocus
                />
                <View style={styles.commentButtons}>
                  <TouchableOpacity onPress={closeCommentModal}>
                    <Text style={[styles.buttonText, { color: theme.error }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={submitComment}>
                    <Text style={[styles.buttonText, { color: theme.primary }]}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
  },
  time: {
    fontSize: 12,
    marginLeft: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Comment modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'flex-end',
  },
  commentBoxContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  commentBox: {
    borderRadius: 12,
    padding: 12,
    // backgroundColor set dynamically from theme
  },
  input: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
});
