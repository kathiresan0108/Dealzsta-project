import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Flag, EyeOff, Bookmark, UserMinus } from 'lucide-react-native';

export default function PostOptionsModal({ visible, onClose, post, onSave, isSaved, onFollowToggle }) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleReport = () => {
    console.log('Report post:', post.id);
    onClose();
  };

  const handleHide = () => {
    console.log('Hide post:', post.id);
    onClose();
  };

  const handleSave = () => {
    onSave?.();
    onClose();
  };

  const handleUnfollow = () => {
    // Use the same follow toggle function that handles both follow and unfollow
    onFollowToggle?.(post.user.id);
    onClose();
  };

  // Check if user is following the post author
  const isFollowing = post.user.followStatus === 'following';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={[styles.modal, { backgroundColor: theme.cardBackground }]}>
          {/* Show unfollow option only if user is following */}
          {isFollowing && (
            <TouchableOpacity style={styles.option} onPress={handleUnfollow}>
              <UserMinus size={20} color={theme.textSecondary} />
              <Text style={[styles.optionText, { color: theme.text }]}>
                {t.unfollow || `Unfollow ${post.user.name}`}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.option} onPress={handleSave}>
            <Bookmark 
              size={20} 
              color={isSaved ? theme.primary : theme.textSecondary}
              fill={isSaved ? theme.primary : 'transparent'}
            />
            <Text style={[styles.optionText, { color: theme.text }]}>
              {isSaved ? (t.unsave || 'Unsave') : (t.save || 'Save')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleHide}>
            <EyeOff size={20} color={theme.textSecondary} />
            <Text style={[styles.optionText, { color: theme.text }]}>
              {t.hide || 'Hide'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleReport}>
            <Flag size={20} color={theme.error} />
            <Text style={[styles.optionText, { color: theme.error }]}>
              {t.report || 'Report'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});