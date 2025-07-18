import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import sampleEvents from '../../components/event/eventsData';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams();
  const event = sampleEvents.find(e => e.id.toString() === eventId);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Poster */}
      <Image source={event.image} style={styles.poster} />

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventLocation}>{event.venue}</Text>
      </View>

      <Section title="About">
        <Text style={styles.description}>{event.description}</Text>
      </Section>

      <Section title="Details">
        <DetailRow icon="language" label="Language" value={event.language} />
        <DetailRow icon="time" label="Duration" value={event.duration} />
        <DetailRow icon="ticket" label="Tickets Needed For" value={event.ageLimit} />
        <DetailRow icon="walk" label="Entry Allowed For" value={event.entryAllowed} />
        <DetailRow icon="map" label="Layout" value={event.layout} />
        <DetailRow icon="chair" label="Seating" value={event.seating} />
        <DetailRow icon="baby" label="Kid Friendly?" value={event.kidFriendly} />
        <DetailRow icon="paw" label="Pet Friendly?" value={event.petFriendly} />
      </Section>

      {event.artist && (
        <Section title="Artist">
          <Text style={styles.artistName}>{event.artist.name}</Text>
          <Text style={styles.artistCategory}>{event.artist.category}</Text>
          {event.artist.songs?.map((song, idx) => (
            <Text key={idx} style={styles.songItem}>🎵 {song}</Text>
          ))}
        </Section>
      )}

      {event.gallery?.length > 0 && (
        <Section title="Gallery">
          <View style={styles.galleryGrid}>
            {event.gallery.map((img, i) => (
              <Image key={i} source={img} style={styles.galleryImageGrid} />
            ))}
          </View>
        </Section>
      )}

      {event.prohibited?.length > 0 && (
        <Section title="Prohibited Items">
          <View style={styles.prohibitedGrid}>
            {event.prohibited.map((item, idx) => (
              <View key={idx} style={styles.prohibitedBox}>
                <Text style={styles.prohibitedText}>🚫 {item}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}

      <Section title="Venue">
        <Text style={styles.venueText}>{event.venue}</Text>
      </Section>

      <Section title="More">
        <TouchableOpacity><Text style={styles.link}>Frequently asked questions</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.link}>Terms and conditions</Text></TouchableOpacity>
      </Section>
    </ScrollView>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={20} color="#555" style={{ marginRight: 8 }} />
    <Text><Text style={{ fontWeight: 'bold' }}>{label}</Text>: {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 20,
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  summaryCard: {
    marginTop: -50,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventDate: {
    color: '#555',
  },
  eventLocation: {
    color: '#777',
    fontSize: 13,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  artistName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistCategory: {
    color: '#666',
    marginBottom: 8,
  },
  songItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  galleryImageGrid: {
    width: '48%',
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  prohibitedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prohibitedBox: {
    backgroundColor: '#ffe6e6',
    padding: 6,
    borderRadius: 6,
  },
  prohibitedText: {
    fontSize: 13,
    color: '#d00',
  },
  venueText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  link: {
    color: '#007BFF',
    marginBottom: 10,
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});