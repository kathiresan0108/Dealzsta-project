import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image, Alert, SafeAreaView,
  Dimensions, Platform, StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, Users, Edit3 } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

export default function EditGroupScreen() {
  const currentUserId = 'user-123';
  const currentUserName = 'You';
  const { id: groupId } = useLocalSearchParams();       
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadGroup = async () => {
      const stored = await AsyncStorage.getItem('groups');
      if (stored) {
        const groups = JSON.parse(stored);
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setGroupName(group.user.name);
          setGroupDescription(group.description || '');
          setGroupImage(group.user.image);

          let groupMembers = group.members || [];
          const isAdminIncluded = groupMembers.some((m) => m.id === currentUserId);
          if (!isAdminIncluded) {
            groupMembers.unshift({
              id: currentUserId,
              name: currentUserName,
              isAdmin: true,
            });
          }
          setMembers(groupMembers);
        }
      }
    };
    loadGroup();
  }, [groupId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    try {
      const stored = await AsyncStorage.getItem('groups');
      if (stored) {
        const groups = JSON.parse(stored);
        const updatedGroups = groups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              user: {
                ...group.user,
                name: groupName,
                image: groupImage,
              },
              description: groupDescription,
              members,
            };
          }
          return group;
        });
        await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));
        Alert.alert('Success', 'Group details updated successfully');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const containerPadding = isTablet ? 32 : 20;
  const maxWidth = isTablet ? 600 : screenWidth;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#b19cd9" />
      
      <View style={[styles.header, { paddingHorizontal: containerPadding }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Group</Text>
        
        <TouchableOpacity 
          onPress={saveChanges} 
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingHorizontal: containerPadding,
            maxWidth,
            alignSelf: 'center',
            width: '100%'
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={{ uri: groupImage || 'https://via.placeholder.com/120/b19cd9/FFFFFF?text=G' }}
              style={styles.groupImage}
            />
            <View style={styles.cameraOverlay}>
              <Camera size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Tap to change group photo</Text>
        </View>

        {/* Group Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Edit3 size={20} color="#b19cd9" strokeWidth={2} />
            <Text style={styles.cardTitle}>Group Information</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Group Name</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter group name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={groupDescription}
              onChangeText={setGroupDescription}
              placeholder="Tell us about your group..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.membersCard}>
          <View style={styles.cardHeader}>
            <Users size={20} color="#b19cd9" strokeWidth={2} />
            <Text style={styles.cardTitle}>Members</Text>
            <View style={styles.memberCount}>
              <Text style={styles.memberCountText}>{members.length}</Text>
            </View>
          </View>
          
          <View style={styles.membersGrid}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={[
                  styles.memberAvatar,
                  member.id === currentUserId && styles.adminAvatar
                ]}>
                  <Text style={styles.memberInitial}>
                    {member.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.id === currentUserId ? 'You' : member.name}
                </Text>
                {member.id === currentUserId && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>Admin</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#b19cd9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 12 : 20,
    paddingBottom: 16,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#b19cd9',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  membersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  memberCount: {
    backgroundColor: '#f0ebf8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b19cd9',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,  
    borderColor: '#E5E7EB',
    minHeight: 52,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  memberCard: {
    alignItems: 'center',
    width: isTablet ? 90 : 80,
    marginBottom: 8,
  },
  memberAvatar: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    backgroundColor: '#ddd3e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminAvatar: {
    backgroundColor: '#b19cd9',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInitial: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  adminBadge: {
    backgroundColor: '#b19cd9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});