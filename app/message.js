import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Image,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Search,
  Plus,
  Users,
  Calendar,
  Star,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

const { width } = Dimensions.get('window');

const getCurrentTimestamp = () => new Date().toISOString();

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
};

const generateGroupLink = (groupId, groupName) => {
  const baseUrl = 'https://yourapp.com/join-group';
  return `${baseUrl}?id=${groupId}&name=${encodeURIComponent(groupName)}`;
};

const GroupItem = ({ item, onPress, onLongPress }) => {
  return (
    <TouchableOpacity 
      style={styles.groupCard} 
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
    >
      <View style={styles.cardGradient}>
        <View style={styles.groupAvatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.groupAvatar} />
          <View style={styles.onlineIndicator} />
        </View>
        
        <View style={styles.groupContent}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.user.name}</Text>
            <View style={styles.groupMeta}>
              <View style={styles.membersBadge}>
                <Users size={12} color="#B19CD9" />
                <Text style={styles.membersText}>{item.memberCount}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.groupDetails}>
            <Text style={styles.groupDescription} numberOfLines={2}>
              {item.description || 'No description available'}
            </Text>
            <View style={styles.groupFooter}>
              <View style={styles.dateContainer}>
                <Calendar size={12} color="#999" />
                <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AdminGroupMessageScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const stored = await AsyncStorage.getItem('groups');
        if (stored) {
          setGroupList(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    };
    loadGroups();
  }, []);

  useEffect(() => {
    const saveGroups = async () => {
      try {
        await AsyncStorage.setItem('groups', JSON.stringify(groupList));
      } catch (error) {
        console.error('Error saving groups:', error);
      }
    };
    saveGroups();
  }, [groupList]);

  const filteredGroups = groupList.filter(
    (item) =>
      item.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleDeleteGroup = (id) => {
    const updated = groupList.filter((group) => group.id !== id);
    setGroupList(updated);
    Alert.alert('Success', 'Group deleted successfully', [
      { text: 'OK', style: 'default' }
    ], {
      userInterfaceStyle: 'light'
    });
  };

  const handleShareLink = async (group) => {
    try {
      await Share.share({
        message: `Join our group "${group.user.name}": ${group.link}`,
        title: `Join ${group.user.name}`,
      });
    } catch (error) {
      console.error('Error sharing link:', error);
      Alert.alert('Error', 'Could not share the link', [
        { text: 'OK', style: 'default' }
      ], {
        userInterfaceStyle: 'light'
      });
    }
  };

  const handleCopyLink = async (group) => {
    try {
      await Clipboard.setStringAsync(group.link);
      Alert.alert('Success', 'Group link copied to clipboard!', [
        { text: 'OK', style: 'default' }
      ], {
        userInterfaceStyle: 'light'
      });
    } catch (error) {
      console.error('Error copying link:', error);
      Alert.alert('Error', 'Could not copy the link', [
        { text: 'OK', style: 'default' }
      ], {
        userInterfaceStyle: 'light'
      });
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name.', [
        { text: 'OK', style: 'default' }
      ], {
        userInterfaceStyle: 'light'
      });
      return;
    }

    const newGroupId = String(Date.now());
    const newGroup = {
      id: newGroupId,
      user: {
        name: groupName.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(groupName.trim())}`,
        isGroup: true,
      },
      description: groupDescription.trim() || 'No description',
      createdAt: getCurrentTimestamp(),
      memberCount: 1,
      link: generateGroupLink(newGroupId, groupName.trim()),
    };

    setGroupList(prevGroups => [newGroup, ...prevGroups]);
    setCreatedGroup(newGroup);
    setShowSuccessModal(true);

    setGroupName('');
    setGroupDescription('');
    setShowGroupModal(false);
  };

  const handleOpenGroup = (group) => {
    router.push(`/group/${group.id}`);
  };

  const handleLongPress = (group) => {
    setSelectedGroup(group);
    setShowOptionsModal(true);
  };

  const handleBackPress = () => {
    router.replace('/(tabs)');
  };

  const renderGroupItem = ({ item }) => (
    <GroupItem
      item={item}
      onPress={handleOpenGroup}
      onLongPress={handleLongPress}
    />
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>GROUP</Text>
            <Text style={styles.headerSubtitle}>Manage & Share</Text>
          </View>
          <TouchableOpacity style={styles.createGroupButton} onPress={() => setShowGroupModal(true)}>
            <Plus color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Enhanced Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search color="#B19CD9" size={18} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your groups..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Enhanced Content */}
      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{groupList.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Tap to open • Long press for options</Text>
        </View>

        <FlatList
          data={filteredGroups}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.groupsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Users color="#B19CD9" size={64} />
                <Star color="#D8B4FE" size={24} style={styles.starIcon} />
              </View>
              <Text style={styles.emptyTitle}>No Groups Yet</Text>
              <Text style={styles.emptyText}>
                Create your first group to start building your community
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton} 
                onPress={() => setShowGroupModal(true)}
              >
                <Plus color="#fff" size={18} />
                <Text style={styles.emptyButtonText}>Create First Group</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      {/* Enhanced Create Group Modal */}
      <Modal visible={showGroupModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Group</Text>
              <Text style={styles.modalSubtitle}>Build your community</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
                maxLength={50}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="What's this group about?"
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowGroupModal(false);
                  setGroupName('');
                  setGroupDescription('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateGroup}
              >
                <Text style={styles.createButtonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Enhanced Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            </View>
            
            <Text style={styles.successTitle}>Group Created!</Text>
            <Text style={styles.successMessage}>
              "{createdGroup?.user.name}" is ready to go. Share the link to invite members.
            </Text>
            
            <View style={styles.successButtons}>
              <TouchableOpacity 
                style={[styles.successButton, styles.shareButton]} 
                onPress={() => {
                  setShowSuccessModal(false);
                  if (createdGroup) handleShareLink(createdGroup);
                }}
              >
                <Text style={styles.shareButtonText}>Share Invite Link</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.successButton, styles.copyButton]} 
                onPress={() => {
                  setShowSuccessModal(false);
                  if (createdGroup) handleCopyLink(createdGroup);
                }}
              >
                <Text style={styles.copyButtonText}>Copy Link</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.successButton, styles.doneButton]} 
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Group Options Modal */}
      <Modal visible={showOptionsModal} transparent animationType="fade">
        <View style={styles.optionsModalOverlay}>
          <View style={styles.optionsModalContent}>
            <Text style={styles.optionsTitle}>Group Options</Text>
            <Text style={styles.optionsSubtitle}>"{selectedGroup?.user.name}"</Text>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowOptionsModal(false);
                if (selectedGroup) handleShareLink(selectedGroup);
              }}
            >
              <Text style={styles.optionButtonText}>Share Invite Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowOptionsModal(false);
                if (selectedGroup) handleCopyLink(selectedGroup);
              }}
            >
              <Text style={styles.optionButtonText}>Copy Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionButton, styles.deleteOption]}
              onPress={() => {
                setShowOptionsModal(false);
                Alert.alert(
                  'Delete Group',
                  `Are you sure you want to delete "${selectedGroup?.user.name}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Delete', 
                      style: 'destructive', 
                      onPress: () => handleDeleteGroup(selectedGroup?.id) 
                    },
                  ],
                  { userInterfaceStyle: 'light' }
                );
              }}
            >
              <Text style={styles.deleteOptionText}>Delete Group</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.optionButton, styles.cancelOption]}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B19CD9',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTop: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  createGroupButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    // Removed shadow effects
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  clearSearch: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
  },
  countBadge: {
    backgroundColor: '#B19CD9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  groupsList: {
    paddingHorizontal: 16,
  },
  groupCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardGradient: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  groupAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
 groupAvatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#eee',
},
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  groupContent: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  groupMeta: {
    alignItems: 'flex-end',
  },
  membersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  membersText: {
    color: '#B19CD9',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  groupDetails: {
    marginTop: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: '#B19CD9',
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  starIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B19CD9',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#B19CD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: width * 0.9,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    fontWeight: '500',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  createButton: {
    backgroundColor: '#B19CD9',
    marginLeft: 12,
    shadowColor: '#B19CD9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B19CD9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B19CD9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkMark: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successButtons: {
    width: '100%',
  },
  successButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: '#B19CD9',
    shadowColor: '#B19CD9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  copyButton: {
    backgroundColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  doneButton: {
    backgroundColor: '#F3F4F6',
    marginBottom: 0,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  doneButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  optionsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  optionsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteOption: {
    backgroundColor: '#FEF2F2',
  },
  deleteOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  cancelOption: {
    backgroundColor: '#B19CD9',
    marginTop: 8,
  },
})