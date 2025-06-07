import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, MapPin, Tag, Clock, DollarSign } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';

export default function CreatePost() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [category, setCategory] = useState('food');
  const [validUntil, setValidUntil] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  const { theme } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const categories = ['food', 'fashion', 'electronics', 'beauty', 'sports', 'automotive', 'health', 'home', 'travel'];

  const handleImagePicker = () => {
    // Simulate image picker
    const sampleImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    ];
    setSelectedImage(sampleImages[Math.floor(Math.random() * sampleImages.length)]);
  };

  const handlePublish = () => {
    if (!title.trim() || !description.trim() || !selectedImage) {
      setPopupConfig({
        title: 'Error',
        message: 'Please fill in all required fields and select an image',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    setPopupConfig({
      title: 'Success',
      message: 'Your deal has been published successfully!',
      type: 'success',
      buttons: [
        { text: 'OK', style: 'primary', onPress: () => {
          setShowPopup(false);
          router.back();
        }}
      ]
    });
    setShowPopup(true);
  };

  if (user?.accountType !== 'business') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.restrictedContainer}>
          <Text style={[styles.restrictedTitle, { color: theme.text }]}>Business Account Required</Text>
          <Text style={[styles.restrictedText, { color: theme.textSecondary }]}>
            Only business accounts can create posts. Please upgrade your account to access this feature.
          </Text>
          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/auth/account-type')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelButton, { color: theme.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Create Deal</Text>
        <TouchableOpacity onPress={handlePublish}>
          <Text style={[styles.publishButton, { color: theme.primary }]}>Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        <TouchableOpacity
          style={[styles.imageContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={handleImagePicker}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={48} color={theme.textSecondary} />
              <Text style={[styles.imagePlaceholderText, { color: theme.textSecondary }]}>
                Tap to add photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Deal Information */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Deal Information</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Deal title"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Describe your deal..."
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Pricing */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pricing</Text>
          
          <View style={styles.priceRow}>
            <View style={styles.priceInput}>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Original Price</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="₹0"
                placeholderTextColor={theme.textSecondary}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.priceInput}>
              <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Discount Price</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                placeholder="₹0"
                placeholderTextColor={theme.textSecondary}
                value={discountPrice}
                onChangeText={setDiscountPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Category Selection */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: category === cat ? theme.primary : theme.surface,
                    borderColor: category === cat ? theme.primary : theme.border,
                  }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: category === cat ? 'white' : theme.text }
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Validity */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Valid Until</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={theme.textSecondary}
            value={validUntil}
            onChangeText={setValidUntil}
          />
        </View>
      </ScrollView>

      <GrandPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
        buttons={popupConfig.buttons}
        onDismiss={() => setShowPopup(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  cancelButton: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  publishButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  categoryScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  restrictedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  restrictedText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});