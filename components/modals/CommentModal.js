import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Heart, MoreHorizontal, Reply, Send, X } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample comments data structure
const SAMPLE_COMMENTS = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'john_doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isVerified: true,
    },
    text: 'Amazing post! Love the content 🔥',
    timeAgo: '2h',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        user: {
          id: 'user2',
          name: 'jane_smith',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
        text: 'Totally agree! 💯',
        timeAgo: '1h',
        likes: 5,
        isLiked: true,
        replyingTo: 'john_doe',
      }
    ],
    showReplies: false,
  },
  {
    id: '2',
    user: {
      id: 'user3',
      name: 'mike_wilson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    text: 'Great quality! Where can I get this? 😍',
    timeAgo: '3h',
    likes: 12,
    isLiked: true,
    replies: [],
    showReplies: false,
  },
  {
    id: '3',
    user: {
      id: 'user4',
      name: 'sarah_jones',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    text: 'This is exactly what I was looking for! Thanks for sharing 🙏',
    timeAgo: '5h',
    likes: 8,
    isLiked: false,
    replies: [],
    showReplies: false,
  },
];

const CommentModal = ({ visible, onClose, post, theme }) => {
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const textInputRef = useRef(null);
  const flatListRef = useRef(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [heartAnimations] = useState(() => 
    comments.reduce((acc, comment) => {
      acc[comment.id] = new Animated.Value(0);
      comment.replies.forEach(reply => {
        acc[reply.id] = new Animated.Value(0);
      });
      return acc;
    }, {})
  );

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.spring(slideAnim, {
      toValue: SCREEN_HEIGHT,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start(() => {
      onClose();
      setCommentText('');
      setReplyingTo(null);
    });
  };

  const animateHeart = (commentId) => {
    if (!heartAnimations[commentId]) {
      heartAnimations[commentId] = new Animated.Value(0);
    }
    
    Animated.sequence([
      Animated.timing(heartAnimations[commentId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnimations[commentId], {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLikeComment = (commentId, isReply = false, parentId = null) => {
    animateHeart(commentId);
    
    setComments(prevComments => 
      prevComments.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId
                ? {
                    ...reply,
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  }
                : reply
            ),
          };
        } else if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    textInputRef.current?.focus();
  };

  const toggleReplies = (commentId) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };

  const submitComment = () => {
    if (commentText.trim().length === 0) return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        id: 'current_user',
        name: 'you',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      text: commentText.trim(),
      timeAgo: 'now',
      likes: 0,
      isLiked: false,
      replies: [],
      showReplies: false,
    };

    if (replyingTo) {
      // Add as reply
      const reply = {
        ...newComment,
        replyingTo: replyingTo.user.name,
      };

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === replyingTo.id
            ? {
                ...comment,
                replies: [...comment.replies, reply],
                showReplies: true,
              }
            : comment
        )
      );
      setReplyingTo(null);
    } else {
      // Add as new comment
      setComments(prevComments => [newComment, ...prevComments]);
    }

    setCommentText('');
    
    // Scroll to top for new comments, or to the parent comment for replies
    setTimeout(() => {
      if (!replyingTo) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  };

  const handleCommentOptions = (comment) => {
    setShowOptionsFor(comment.id);
    
    const options = [
      'Report',
      ...(comment.user.id === 'current_user' ? ['Delete'] : []),
      'Cancel'
    ];

    Alert.alert(
      'Comment Options',
      '',
      options.map(option => ({
        text: option,
        style: option === 'Cancel' ? 'cancel' : option === 'Delete' ? 'destructive' : 'default',
        onPress: () => {
          if (option === 'Delete') {
            handleDeleteComment(comment.id);
          } else if (option === 'Report') {
            Alert.alert('Report', 'Comment reported');
          }
          setShowOptionsFor(null);
        },
      }))
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== commentId)
    );
  };

  const renderReply = ({ item: reply, index, parentComment }) => {
    const heartScale = heartAnimations[reply.id] ? heartAnimations[reply.id].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    }) : 1;

    return (
      <View style={styles.replyContainer}>
        <View style={styles.replyLine} />
        <View style={styles.commentContent}>
          <TouchableOpacity style={styles.commentHeader}>
            <Image source={{ uri: reply.user.avatar }} style={styles.replyAvatar} />
            <View style={styles.commentInfo}>
              <View style={styles.commentTextContainer}>
                <Text style={[styles.commentText, { color: theme.text }]}>
                  <Text style={[styles.username, { color: theme.text }]}>{reply.user.name}</Text>
                  {reply.replyingTo && (
                    <Text style={[styles.replyingTo, { color: theme.primary }]}> @{reply.replyingTo}</Text>
                  )}
                  {' '}{reply.text}
                </Text>
              </View>
              <View style={styles.commentActions}>
                <Text style={[styles.timeText, { color: theme.textSecondary }]}>{reply.timeAgo}</Text>
                {reply.likes > 0 && (
                  <Text style={[styles.likesText, { color: theme.textSecondary }]}>
                    {reply.likes} {reply.likes === 1 ? 'like' : 'likes'}
                  </Text>
                )}
                <TouchableOpacity onPress={() => handleReply(parentComment)}>
                  <Text style={[styles.replyText, { color: theme.textSecondary }]}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.commentRightActions}>
            <TouchableOpacity 
              onPress={() => handleLikeComment(reply.id, true, parentComment.id)}
              style={styles.heartButton}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Heart
                  size={12}
                  color={reply.isLiked ? theme.like : theme.textSecondary}
                  fill={reply.isLiked ? theme.like : 'transparent'}
                />
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleCommentOptions(reply)}>
              <MoreHorizontal size={12} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderComment = ({ item: comment, index }) => {
    const heartScale = heartAnimations[comment.id] ? heartAnimations[comment.id].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    }) : 1;

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentContent}>
          <TouchableOpacity style={styles.commentHeader}>
            <Image source={{ uri: comment.user.avatar }} style={styles.avatar} />
            <View style={styles.commentInfo}>
              <View style={styles.commentTextContainer}>
                <Text style={[styles.commentText, { color: theme.text }]}>
                  <Text style={[styles.username, { color: theme.text }]}>{comment.user.name}</Text>
                  {comment.user.isVerified && (
                    <Text style={[styles.verified, { color: theme.primary }]}> ✓</Text>
                  )}
                  {' '}{comment.text}
                </Text>
              </View>
              <View style={styles.commentActions}>
                <Text style={[styles.timeText, { color: theme.textSecondary }]}>{comment.timeAgo}</Text>
                {comment.likes > 0 && (
                  <Text style={[styles.likesText, { color: theme.textSecondary }]}>
                    {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                  </Text>
                )}
                <TouchableOpacity onPress={() => handleReply(comment)}>
                  <Text style={[styles.replyText, { color: theme.textSecondary }]}>Reply</Text>
                </TouchableOpacity>
              </View>
              
              {comment.replies.length > 0 && (
                <TouchableOpacity 
                  onPress={() => toggleReplies(comment.id)}
                  style={styles.viewRepliesButton}
                >
                  <View style={[styles.repliesLine, { backgroundColor: theme.textSecondary }]} />
                  <Text style={[styles.viewRepliesText, { color: theme.textSecondary }]}>
                    {comment.showReplies ? 'Hide' : 'View'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.commentRightActions}>
            <TouchableOpacity 
              onPress={() => handleLikeComment(comment.id)}
              style={styles.heartButton}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Heart
                  size={14}
                  color={comment.isLiked ? theme.like : theme.textSecondary}
                  fill={comment.isLiked ? theme.like : 'transparent'}
                />
              </Animated.View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleCommentOptions(comment)}>
              <MoreHorizontal size={14} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {comment.showReplies && comment.replies.map((reply, replyIndex) => (
          <View key={reply.id}>
            {renderReply({ item: reply, index: replyIndex, parentComment: comment })}
          </View>
        ))}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              backgroundColor: theme.cardBackground,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Comments</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <FlatList
            ref={flatListRef}
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input Section */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.inputContainer, { borderTopColor: theme.border }]}
          >
            {replyingTo && (
              <View style={[styles.replyingToContainer, { backgroundColor: theme.surface }]}>
                <Text style={[styles.replyingToText, { color: theme.textSecondary }]}>
                  Replying to @{replyingTo.user.name}
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <X size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.inputRow}>
              <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.inputAvatar} 
              />
              <TextInput
                ref={textInputRef}
                style={[
                  styles.textInput,
                  { 
                    color: theme.text,
                    backgroundColor: theme.surface,
                  }
                ]}
                placeholder={replyingTo ? `Reply to ${replyingTo.user.name}...` : "Add a comment..."}
                placeholderTextColor={theme.textSecondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={2200}
              />
              <TouchableOpacity 
                onPress={submitComment}
                style={[
                  styles.sendButton,
                  { 
                    backgroundColor: commentText.trim() ? theme.primary : theme.surface,
                  }
                ]}
                disabled={!commentText.trim()}
              >
                <Send 
                  size={16} 
                  color={commentText.trim() ? '#fff' : theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentContainer: {
    paddingVertical: 12,
  },
  commentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentInfo: {
    flex: 1,
  },
  commentTextContainer: {
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  username: {
    fontWeight: '600',
  },
  verified: {
    fontSize: 12,
  },
  replyingTo: {
    fontWeight: '600',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
  },
  likesText: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentRightActions: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  heartButton: {
    padding: 4,
  },
  viewRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repliesLine: {
    width: 24,
    height: 1,
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyContainer: {
    marginLeft: 32,
    marginTop: 8,
  },
  replyLine: {
    position: 'absolute',
    left: -20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#E1E1E1',
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderRadius: 8,
  },
  replyingToText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 12,
    gap: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommentModal;