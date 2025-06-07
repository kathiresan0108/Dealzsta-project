import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Upload, FileText, MapPin } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';

export default function BusinessVerification() {
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    address: '',
    category: 'food',
    licenseImage: null,
    shopImage: null,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const categories = ['food', 'fashion', 'electronics', 'beauty', 'sports', 'automotive', 'health', 'home', 'travel'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type) => {
    // Simulate image upload
    const sampleImages = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    ];
    const selectedImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    handleInputChange(type, selectedImage);
  };

  const handleSubmit = () => {
    if (!formData.businessName.trim() || !formData.gstNumber.trim() || !formData.address.trim()) {
      setPopupConfig({
        title: 'Error',
        message: 'Please fill in all required fields',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    setPopupConfig({
      title: 'Application Submitted',
      message: 'Your business verification application has been submitted. We will review it within 24-48 hours.',
      type: 'success',
      buttons: [
        { text: 'Continue', style: 'primary', onPress: () => {
          setShowPopup(false);
          router.push('/auth/profile-setup');
        }}
      ]
    });
    setShowPopup(true);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Business Verification</Text>
            <Text style={styles.subtitle}>Provide your business details for verification</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.cardBackground }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Business Name"
              placeholderTextColor={theme.textSecondary}
              value={formData.businessName}
              onChangeText={(value) => handleInputChange('businessName', value)}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="GST Number"
              placeholderTextColor={theme.textSecondary}
              value={formData.gstNumber}
              onChangeText={(value) => handleInputChange('gstNumber', value)}
            />

            <TextInput
              style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              placeholder="Business Address"
              placeholderTextColor={theme.textSecondary}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
            />

            {/* Category Selection */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Business Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: formData.category === cat ? theme.primary : theme.surface,
                      borderColor: formData.category === cat ? theme.primary : theme.border,
                    }
                  ]}
                  onPress={() => handleInputChange('category', cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      { color: formData.category === cat ? 'white' : theme.text }
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Document Upload */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Upload Documents</Text>
            
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => handleImageUpload('licenseImage')}
            >
              {formData.licenseImage ? (
                <Image source={{ uri: formData.licenseImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <FileText size={32} color={theme.textSecondary} />
                  <Text style={[styles.uploadText, { color: theme.textSecondary }]}>
                    Upload Business License
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => handleImageUpload('shopImage')}
            >
              {formData.shopImage ? (
                <Image source={{ uri: formData.shopImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Camera size={32} color={theme.textSecondary} />
                  <Text style={[styles.uploadText, { color: theme.textSecondary }]}>
                    Upload Shop Photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit for Verification</Text>
            </TouchableOpacity>
          </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 20,
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
  uploadButton: {
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});