import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const initialNotifications = [
  {
    id: 'n1',
    group: 'Promotions',
    message: '🔥 50% OFF on all premium posts this weekend!',
    time: '2025-06-20T14:30:00Z',
    icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079108.png',
  },
  {
    id: 'n2',
    group: 'Referral Offers',
    message: 'Refer 3 friends and get your next post featured!',
    time: '2025-06-20T13:10:00Z',
    icon: 'https://cdn-icons-png.flaticon.com/512/4208/4208403.png',
  },
  {
    id: 'n3',
    group: 'Limited Time',
    message: 'Exclusive VIP access ends tonight!',
    time: '2025-06-20T11:15:00Z',
    icon: 'https://cdn-icons-png.flaticon.com/512/2891/2891570.png',
  },
];

const formatTime = (isoTime) => {
  const date = new Date(isoTime);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchText, setSearchText] = useState('');

  const filteredNotifications = notifications.filter(
    (item) =>
      item.group.toLowerCase().includes(searchText.toLowerCase()) ||
      item.message.toLowerCase().includes(searchText.toLowerCase())
  );

  const openNotification = (item) => {
    router.push({
      pathname: '/notificationDetail',
      params: {
        id: item.id,
        group: item.group,
        message: item.message,
        time: item.time,
        icon: item.icon,
      },
    });
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <TouchableOpacity
        style={styles.cardLeft}
        onPress={() => openNotification(item)}
      >
        <Image source={{ uri: item.icon }} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.group}>{item.group}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{formatTime(item.time)}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Trash2 size={20} color="#ff4757" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Notifications ({notifications.length})
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notifications"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Notification List */}
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications.</Text>
          }
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4ebff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4ebff',
  },
  header: {
    backgroundColor: '#A58AD7',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    fontSize: 15,
    color: '#333',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  group: {
    fontWeight: 'bold',
    color: '#5e2eaa',
    fontSize: 14,
  },
  message: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});