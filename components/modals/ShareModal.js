import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Share as RNShare,
  Clipboard,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Send,
  Copy,
  Link,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MoreHorizontal,
  X,
  Search,
  Check,
} from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const defaultTheme = {
  text: '#000',
  textSecondary: '#666',
  cardBackground: '#fff',
  primary: '#3b82f6',
  surface: '#f0f0f0',
  border: '#ccc',
};

const ShareModal = ({ visible, onClose, post, theme, onShareToFriend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  const activeTheme = theme || defaultTheme;

  const [friends] = useState([
    { id: '1', name: 'John Doe', username: 'johndoe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', username: 'janesmith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Mike Johnson', username: 'mikej', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Sarah Wilson', username: 'sarahw', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Tom Brown', username: 'tombrown', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', name: 'Lisa Davis', username: 'lisad', avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: '7', name: 'Chris Miller', username: 'chrism', avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: '8', name: 'Amy Taylor', username: 'amyt', avatar: 'https://i.pravatar.cc/150?img=8' },
  ]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSendToFriends = () => {
    if (selectedFriends.length === 0) {
      Alert.alert('No Friends Selected', 'Please select at least one friend to share with.');
      return;
    }

    const selectedFriendsList = friends.filter(friend => selectedFriends.includes(friend.id));
    onShareToFriend?.(post.id, selectedFriendsList);

    Alert.alert(
      'Post Shared!',
      `Post shared with ${selectedFriends.length} friend(s)`,
      [{ text: 'OK', onPress: handleClose }]
    );
  };

  const handleClose = () => {
    setSelectedFriends([]);
    setSearchQuery('');
    onClose();
  };

  const shareOptions = [
    {
      id: 'story',
      title: 'Add to Story',
      icon: Instagram,
      color: '#E4405F',
      onPress: () => {
        Alert.alert('Add to Story', 'This would add the post to your story');
        handleClose();
      }
    },
    {
      id: 'copy',
      title: 'Copy Link',
      icon: Copy,
      color: activeTheme.textSecondary,
      onPress: async () => {
        const postUrl = `https://yourapp.com/post/${post.id}`;
        await Clipboard.setString(postUrl);
        Alert.alert('Link Copied', 'Post link copied to clipboard');
        handleClose();
      }
    },
    {
      id: 'share',
      title: 'Share to...',
      icon: Send,
      color: activeTheme.primary,
      onPress: async () => {
        try {
          await RNShare.share({
            message: `Check out this post: ${post.title}`,
            url: `https://yourapp.com/post/${post.id}`,
            title: post.title,
          });
        } catch (error) {
          console.log('Share error:', error);
        }
        handleClose();
      }
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: MessageCircle,
      color: '#25D366',
      onPress: () => {
        Alert.alert('WhatsApp', 'This would share to WhatsApp');
        handleClose();
      }
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      onPress: () => {
        Alert.alert('Facebook', 'This would share to Facebook');
        handleClose();
      }
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      onPress: () => {
        Alert.alert('Twitter', 'This would share to Twitter');
        handleClose();
      }
    },
    {
      id: 'email',
      title: 'Email',
      icon: Mail,
      color: activeTheme.textSecondary,
      onPress: () => {
        Alert.alert('Email', 'This would share via email');
        handleClose();
      }
    },
    {
      id: 'more',
      title: 'More',
      icon: MoreHorizontal,
      color: activeTheme.textSecondary,
      onPress: () => {
        Alert.alert('More Options', 'Additional sharing options would appear here');
        handleClose();
      }
    },
  ];

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: activeTheme.cardBackground,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: activeTheme.border }]}>
            <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Share</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={activeTheme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Post Preview */}
            <View style={[styles.postPreview, { borderBottomColor: activeTheme.border }]}>
              <Image source={{ uri: post.image }} style={styles.previewImage} />
              <View style={styles.previewContent}>
                <Text style={[styles.previewTitle, { color: activeTheme.text }]} numberOfLines={2}>
                  {post.title}
                </Text>
                <Text style={[styles.previewUser, { color: activeTheme.textSecondary }]}>
                  by {post.user.name}
                </Text>
              </View>
            </View>

            {/* Quick Share Options */}
            <View style={styles.quickOptions}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {shareOptions.slice(0, 4).map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.quickOption}
                    onPress={option.onPress}
                  >
                    <View style={[styles.quickOptionIcon, { backgroundColor: `${option.color}20` }]}>
                      <option.icon size={24} color={option.color} />
                    </View>
                    <Text style={[styles.quickOptionText, { color: activeTheme.text }]}>
                      {option.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Send to Friends Section */}
            <View style={styles.friendsSection}>
              <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>Send to friends</Text>

              {/* Search Bar */}
              <View style={[styles.searchContainer, { backgroundColor: activeTheme.surface }]}>
                <Search size={20} color={activeTheme.textSecondary} />
                <TextInput
                  style={[styles.searchInput, { color: activeTheme.text }]}
                  placeholder="Search friends..."
                  placeholderTextColor={activeTheme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Friends List */}
              <ScrollView style={styles.friendsList} nestedScrollEnabled>
                {filteredFriends.map((friend) => (
                  <TouchableOpacity
                    key={friend.id}
                    style={styles.friendItem}
                    onPress={() => toggleFriendSelection(friend.id)}
                  >
                    <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
                    <View style={styles.friendInfo}>
                      <Text style={[styles.friendName, { color: activeTheme.text }]}>
                        {friend.name}
                      </Text>
                      <Text style={[styles.friendUsername, { color: activeTheme.textSecondary }]}>
                        @{friend.username}
                      </Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      {
                        backgroundColor: selectedFriends.includes(friend.id)
                          ? activeTheme.primary
                          : 'transparent',
                        borderColor: selectedFriends.includes(friend.id)
                          ? activeTheme.primary
                          : activeTheme.border
                      }
                    ]}>
                      {selectedFriends.includes(friend.id) && (
                        <Check size={16} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* More Share Options */}
            <View style={[styles.moreOptions, { borderTopColor: activeTheme.border }]}>
              <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>More options</Text>
              {shareOptions.slice(4).map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.moreOption}
                  onPress={option.onPress}
                >
                  <View style={[styles.moreOptionIcon, { backgroundColor: `${option.color}20` }]}>
                    <option.icon size={20} color={option.color} />
                  </View>
                  <Text style={[styles.moreOptionText, { color: activeTheme.text }]}>
                    {option.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Send Button */}
          {selectedFriends.length > 0 && (
            <View style={[styles.sendButtonContainer, { borderTopColor: activeTheme.border }]}>
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: activeTheme.primary }]}
                onPress={handleSendToFriends}
              >
                <Send size={20} color="#fff" />
                <Text style={styles.sendButtonText}>
                  Send to {selectedFriends.length} friend(s)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewUser: {
    fontSize: 14,
  },
  quickOptions: {
    paddingVertical: 20,
    paddingLeft: 16,
  },
  quickOption: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  quickOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickOptionText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  friendsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  friendsList: {
    maxHeight: 200,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreOptions: {
    paddingHorizontal: 16,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  moreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  moreOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moreOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sendButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareModal;