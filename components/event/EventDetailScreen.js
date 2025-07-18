import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import eventData from '../event/eventData';

export default function EventDetailScreen() {
  return (
    <ScrollView style={styles.container}>
      <Image source={require('../../assets/images/hip.jpg')} style={styles.poster} />

      <View style={styles.card}>
        <Text style={styles.title}>{eventData.title}</Text>
        <Text style={styles.subtitle}>{eventData.date}</Text>
        <Text style={styles.location}>{eventData.location}</Text>
        <Text style={styles.distance}>{eventData.distance}</Text>
      </View>

      <Section title="About">
        <Text style={styles.description}>{eventData.description}</Text>
      </Section>

      <Section title="Details">
        <InfoItem label="Language" value={eventData.language} />
        <InfoItem label="Duration" value={eventData.duration} />
        <InfoItem label="Tickets Needed For" value={eventData.ageLimit} />
        <InfoItem label="Entry Allowed For" value={eventData.entryAllowed} />
        <InfoItem label="Layout" value={eventData.layout} />
        <InfoItem label="Seating Arrangement" value={eventData.seating} />
        <InfoItem label="Kid Friendly?" value={eventData.kidFriendly} />
        <InfoItem label="Pet Friendly?" value={eventData.petFriendly} />
      </Section>

      <Section title="Artist">
        <Text style={styles.artistName}>{eventData.artist.name}</Text>
        <Text style={styles.artistCategory}>{eventData.artist.category}</Text>
        {eventData.artist.songs.map((song, index) => (
          <Text key={index} style={styles.songItem}>🎵 {song}</Text>
        ))}
      </Section>

      <Section title="Gallery">
        <FlatList
          data={eventData.gallery}
          horizontal
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={item} style={styles.galleryImage} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </Section>

      <Section title="Prohibited Items">
        {eventData.prohibited.map((item, index) => (
          <Text key={index} style={styles.prohibitedItem}>🚫 {item}</Text>
        ))}
      </Section>

      <Section title="Venue">
        <Text style={styles.venue}>
          Thiruvidanthai, ECR{"\n"}Nithya Kalyana Perumal Temple Grounds, East Coast Road, Chennai
        </Text>
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

const InfoItem = ({ label, value }) => (
  <Text style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text> {value}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  poster: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  card: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#444',
  },
  location: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  distance: {
    fontSize: 13,
    color: '#aaa',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
  },
  infoItem: {
    marginVertical: 2,
    fontSize: 14,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  artistName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistCategory: {
    color: '#666',
    marginBottom: 8,
  },
  songItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  galleryImage: {
    width: 120,
    height: 150,
    marginRight: 8,
    borderRadius: 8,
  },
  prohibitedItem: {
    fontSize: 14,
    color: '#d00',
    marginBottom: 4,
  },
  venue: {
    fontSize: 15,
    color: '#333',
  },
});