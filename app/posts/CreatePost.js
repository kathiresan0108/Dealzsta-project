import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Image, ScrollView, ActivityIndicator, Dimensions, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Multiple AI APIs for better results
const HF_CAPTION_API = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';
const HF_CLASSIFICATION_API = 'https://api-inference.huggingface.co/models/google/vit-base-patch16-224';

export default function PostUploadScreen() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editableDescription, setEditableDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [postType, setPostType] = useState('general');
  const [aiDetectedType, setAiDetectedType] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
      // Reset previous data
      setDescription('');
      setEditableDescription('');
      setTags([]);
      setSelectedTags([]);
      setAiDetectedType('');
      // Generate new content
      generateDescriptionAndTags(result.assets[0].base64);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
      // Reset previous data
      setDescription('');
      setEditableDescription('');
      setTags([]);
      setSelectedTags([]);
      setAiDetectedType('');
      // Generate new content
      generateDescriptionAndTags(result.assets[0].base64);
    }
  };

  // Smart content type detection based on image analysis
  const detectContentType = async (base64Image) => {
    try {
      const binaryString = atob(base64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const response = await fetch(HF_CLASSIFICATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: bytes,
      });

      if (response.ok) {
        const result = await response.json();
        return classifyContentType(result);
      }
    } catch (error) {
      console.error('Content type detection failed:', error);
    }
    return 'general';
  };

  // Classify content type based on AI results
  const classifyContentType = (classificationResult) => {
    if (!classificationResult || !Array.isArray(classificationResult)) {
      return 'general';
    }

    const topLabels = classificationResult.slice(0, 5).map(item => item.label.toLowerCase());
    
    // Food detection
    const foodKeywords = ['pizza', 'burger', 'sandwich', 'salad', 'cake', 'coffee', 'drink', 'meal', 'food', 'restaurant', 'kitchen', 'dining', 'bread', 'fruit', 'vegetable', 'meat', 'dessert', 'ice cream', 'soup', 'plate', 'bowl', 'cup', 'wine', 'beer', 'cocktail'];
    if (topLabels.some(label => foodKeywords.some(keyword => label.includes(keyword)))) {
      return 'food';
    }

    // Product detection
    const productKeywords = ['shirt', 'dress', 'shoes', 'bag', 'watch', 'phone', 'laptop', 'car', 'bottle', 'box', 'package', 'clothing', 'fashion', 'accessory', 'jewelry', 'gadget', 'device', 'furniture', 'home', 'decor'];
    if (topLabels.some(label => productKeywords.some(keyword => label.includes(keyword)))) {
      return 'product';
    }

    // Travel detection
    const travelKeywords = ['beach', 'mountain', 'building', 'city', 'landscape', 'nature', 'sky', 'ocean', 'forest', 'park', 'monument', 'architecture', 'street', 'road', 'bridge', 'church', 'temple', 'castle', 'museum', 'hotel', 'airplane', 'train', 'boat'];
    if (topLabels.some(label => travelKeywords.some(keyword => label.includes(keyword)))) {
      return 'travel';
    }

    // Event detection
    const eventKeywords = ['party', 'wedding', 'birthday', 'celebration', 'crowd', 'stage', 'concert', 'festival', 'graduation', 'meeting', 'conference', 'ceremony', 'dance', 'music', 'performance'];
    if (topLabels.some(label => eventKeywords.some(keyword => label.includes(keyword)))) {
      return 'event';
    }

    return 'general';
  };

  // Generate unique descriptions based on detected content and image analysis
  const generateUniqueDescription = (caption, contentType, imageAnalysis) => {
    const timestamp = new Date().getTime();
    const randomElements = [
      'absolutely stunning', 'incredible', 'amazing', 'breathtaking', 'fantastic', 
      'wonderful', 'spectacular', 'gorgeous', 'beautiful', 'perfect'
    ];
    
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const templates = {
      food: [
        `🍽 ${caption} This ${getRandomElement(randomElements)} dish is making my mouth water! The flavors and presentation are absolutely perfect. Who else loves food that looks this good? 😋 #foodie,`
        `🥘 Just discovered this incredible ${caption.toLowerCase()}! The taste is as amazing as it looks. Perfect for satisfying those cravings! 🤤 #delicious,`
        `🍴 ${caption} - when food is this beautiful, you know it's going to taste incredible! This is exactly what I needed today. 😍 #foodlover,`
        `🥗 Look at this ${getRandomElement(randomElements)} ${caption.toLowerCase()}! Every bite is pure perfection. Food that makes you happy! 🌟 #yummy`
      ],
      product: [
        `🛍 ${caption} Just found this ${getRandomElement(randomElements)} piece! The quality and style are exactly what I was looking for. Perfect addition to my collection! ✨ #shopping,`
        `💫 ${caption} - the design and craftsmanship are truly exceptional. This is what quality looks like! Highly recommend checking this out. 🔥 #quality,`
        `🌟 Obsessed with this ${caption.toLowerCase()}! The attention to detail is incredible. Sometimes you find exactly what you didn't know you needed! 💎 #newfinds,`
        `✨ ${caption} This ${getRandomElement(randomElements)} find just made my day! The style is perfectly on point. Love discovering gems like this! 💫 #stylish`
      ],
      travel: [
        `✈ ${caption} This place is absolutely ${getRandomElement(randomElements)}! The beauty here is beyond words. Travel moments like this make life so rich! 🌍 #wanderlust,`
       ` 🗺 Just experienced this incredible ${caption.toLowerCase()}! Every corner tells a story. This is why I love exploring new places! 🌅 #adventure,`
        `🧳 ${caption} - sometimes you find places that just take your breath away. This view is everything! Nature's masterpiece right here. 🏔 #explore,`
        `🌎 Discovered this ${getRandomElement(randomElements)} spot! ${caption} The serenity and beauty here are unmatched. Perfect escape from the everyday! 🌿 #peaceful`
      ],
      event: [
       ` 🎉 ${caption} What an ${getRandomElement(randomElements)} celebration! These are the moments that create the best memories. So grateful to be here! 🥳 #celebration,`
        `🎊 ${caption} - the energy here is absolutely electric! Surrounded by amazing people and incredible vibes. This is what life is about! 💫 #goodtimes,`
       ` 🎈 Just experienced this incredible ${caption.toLowerCase()}! The joy and excitement are contagious. Events like this bring people together! 🌟 #memories,`
        `🎭 ${caption} This ${getRandomElement(randomElements)} gathering is everything! The atmosphere is perfect and the company is even better! 🎨 #together`
      ],
      general: [
       ` ✨ ${caption} This moment is absolutely ${getRandomElement(randomElements)}! Life is full of beautiful surprises when you take time to notice them. 📸 #grateful`,
        `🌟 ${caption} - sometimes the simplest moments are the most profound. This image captures something truly special! 💫 #beautiful`,
        `💫 Just captured this ${getRandomElement(randomElements)} scene! ${caption} Every day brings new opportunities to see beauty around us. 🌈 #inspiration`,
       ` 🎯 ${caption} This is exactly the kind of moment that makes you appreciate life! The beauty in everyday experiences is remarkable. ✨ #mindful`
      ]
    };

    const typeTemplates = templates[contentType] || templates.general;
    const selectedTemplate = getRandomElement(typeTemplates);
    
    // Add some randomness to make each description unique
    const uniqueElements = [
      `[${timestamp}]`, // Hidden timestamp for uniqueness
      Math.random() > 0.5 ? '🌟' : '✨',
      Math.random() > 0.5 ? 'Perfect moment!' : 'Love this!',
      Math.random() > 0.5 ? 'So grateful!' : 'Feeling blessed!'
    ];

    return selectedTemplate.replace(`[${timestamp}]`, ''); // Remove timestamp from display
  };

  // Generate contextual hashtags based on content analysis
  const generateContextualHashtags = (caption, contentType) => {
    const baseHashtags = {
      general: ['#photooftheday', '#instagood', '#beautiful', '#amazing', '#love', '#life', '#happy', '#blessed', '#grateful', '#inspiration'],
      product: ['#product', '#shopping', '#quality', '#style', '#design', '#newfinds', '#musthave', '#trendy', '#fashion', '#lifestyle'],
      food: ['#food', '#foodie', '#delicious', '#yummy', '#instafood', '#tasty', '#hungry', '#foodlover', '#cuisine', '#homemade'],
      event: ['#event', '#celebration', '#memories', '#goodtimes', '#friends', '#party', '#joy', '#together', '#fun', '#special'],
      travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#nature', '#beautiful', '#vacation', '#journey', '#discover', '#paradise']
    };

    // Extract keywords from caption for contextual hashtags
    const captionWords = caption.toLowerCase().split(' ');
    const contextualTags = [];
    
    // Add context-specific hashtags
    if (captionWords.some(word => ['sunset', 'sunrise', 'golden'].includes(word))) {
      contextualTags.push('#goldenhour', '#sunset', '#sunrise');
    }
    if (captionWords.some(word => ['beach', 'ocean', 'sea'].includes(word))) {
      contextualTags.push('#beach', '#ocean', '#seaside');
    }
    if (captionWords.some(word => ['mountain', 'hill', 'peak'].includes(word))) {
      contextualTags.push('#mountain', '#hiking', '#nature');
    }
    if (captionWords.some(word => ['city', 'urban', 'street'].includes(word))) {
      contextualTags.push('#city', '#urban', '#streetlife');
    }

    // Combine base hashtags with contextual ones
    const allTags = [...baseHashtags[contentType], ...contextualTags];
    
    // Add some trending hashtags
    const trendingTags = ['#viral', '#trending', '#instagram', '#mood', '#vibes', '#aesthetic'];
    
    // Return unique hashtags (max 15)
    return [...new Set([...allTags, ...trendingTags])].slice(0, 15);
  };

  const generateDescriptionAndTags = async (base64Image) => {
    setLoading(true);
    setDescription('');
    setTags([]);
    setEditableDescription('');
    setSelectedTags([]);

    try {
      // Step 1: Detect content type using AI
      const detectedType = await detectContentType(base64Image);
      setAiDetectedType(detectedType);
      setPostType(detectedType);

      // Step 2: Generate image caption
      const binaryString = atob(base64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const response = await fetch(HF_CAPTION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: bytes,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract the generated caption
      let basicCaption = '';
      if (result && result.length > 0 && result[0].generated_text) {
        basicCaption = result[0].generated_text;
      } else {
        basicCaption = 'A beautiful captured moment';
      }

      // Step 3: Generate unique description based on content type and caption
      const uniqueDescription = generateUniqueDescription(basicCaption, detectedType, result);
      
      // Step 4: Generate contextual hashtags
      const contextualHashtags = generateContextualHashtags(basicCaption, detectedType);
      
      setDescription(uniqueDescription);
      setEditableDescription(uniqueDescription);
      setTags(contextualHashtags);
      
    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Fallback with still unique content
      const fallbackDescriptions = {
        general: `✨ What a beautiful moment captured! This image tells a unique story that's worth sharing. Life is full of these special moments! 📸 #beautiful`,
        product: `🛍 Check out this amazing find! The quality and style are exactly what I was looking for. Perfect addition to my collection! ✨ #shopping`,
        food: `🍽 This looks absolutely delicious! The presentation is perfect and it's making my mouth water. Food that makes you happy! 😋 #foodie`,
        event: `🎉 What an incredible celebration! These moments create the best memories. So grateful to be part of this! 🥳 #memories`,
        travel: `✈ This place is absolutely breathtaking! The beauty here is beyond words. Travel moments like this enrich the soul! 🌍 #wanderlust`,
      };

      const fallbackType = postType || 'general';
      const fallbackDesc = fallbackDescriptions[fallbackType];
      const fallbackHashtags = generateContextualHashtags('beautiful moment', fallbackType);
      
      setDescription(fallbackDesc);
      setEditableDescription(fallbackDesc);
      setTags(fallbackHashtags);
      setAiDetectedType(fallbackType);
      
      Alert.alert('Info', 'AI service temporarily unavailable. Generated content using fallback system.');
    }

    setLoading(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePost = () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please select an image first');
      return;
    }
    
    if (!editableDescription.trim()) {
      Alert.alert('Missing Description', 'Please add a description');
      return;
    }

    const finalPost = {
      image,
      description: editableDescription,
      hashtags: selectedTags,
      postType,
      aiDetectedType,
      timestamp: new Date().toISOString()
    };

    console.log('Final post data:', finalPost);
    Alert.alert('Success', `Post ready! AI detected: ${aiDetectedType}`);
  };

  const PostTypeSelector = () => (
    <View style={styles.postTypeContainer}>
      <Text style={styles.label}>
        Content Type {aiDetectedType && `(AI detected: ${aiDetectedType})`}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
        {[
          { key: 'general', label: '✨ General', icon: 'sparkles' },
          { key: 'product', label: '🛍 Product', icon: 'storefront' },
          { key: 'food', label: '🍕 Food', icon: 'restaurant' },
          { key: 'event', label: '🎉 Event', icon: 'calendar' },
          { key: 'travel', label: '✈ Travel', icon: 'airplane' }
        ].map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.typeButton,
              postType === type.key && styles.typeButtonActive,
              aiDetectedType === type.key && styles.typeButtonAiDetected
            ]}
            onPress={() => setPostType(type.key)}
          >
            <Ionicons 
              name={type.icon} 
              size={16} 
              color={postType === type.key ? '#5F4B8B' : '#6B7280'} 
            />
            <Text style={[
              styles.typeButtonText,
              postType === type.key && styles.typeButtonTextActive
            ]}>
              {type.label}
            </Text>
            {aiDetectedType === type.key && (
              <View style={styles.aiDetectedIndicator}>
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart AI Post Creator</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#5F4B8B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={showImageOptions} style={styles.imagePicker}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.changeImageBtn} onPress={showImageOptions}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
            <Text style={styles.placeholderText}>Tap to add photo</Text>
            <Text style={styles.placeholderSubtext}>AI will analyze and create unique content</Text>
          </View>
        )}
      </TouchableOpacity>

      {image && <PostTypeSelector />}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5F4B8B" />
          <Text style={styles.loadingText}>AI is analyzing your image...</Text>
          <Text style={styles.loadingSubtext}>Detecting content type and generating unique description</Text>
        </View>
      )}

      {description && !loading && (
        <View style={styles.resultBox}>
          <Text style={styles.sectionTitle}>🤖 AI Generated Content</Text>
          
          <View style={styles.descriptionSection}>
            <Text style={styles.label}>Unique Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={editableDescription}
              onChangeText={setEditableDescription}
              multiline
              placeholder="Your unique AI-generated description will appear here..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.label}>Smart Hashtags ({selectedTags.length}/15 selected)</Text>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.regenerateBtn}
            onPress={() => imageBase64 && generateDescriptionAndTags(imageBase64)}
          >
            <Ionicons name="refresh" size={16} color="#5F4B8B" />
            <Text style={styles.regenerateText}>Generate New Content</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.submitBtn, (!image || !editableDescription.trim()) && styles.submitBtnDisabled]} 
        onPress={handlePost}
        disabled={!image || !editableDescription.trim()}
      >
        <Ionicons name="send" size={20} color="#fff" style={styles.submitIcon} />
        <Text style={styles.submitText}>Create Unique Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  helpButton: {
    padding: 8,
  },
  imagePicker: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  postTypeContainer: {
    marginBottom: 24,
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  typeButtonActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
  },
  typeButtonAiDetected: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#5F4B8B',
    fontWeight: '600',
  },
  aiDetectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5F4B8B',
    marginBottom: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  descriptionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
  },
  tagText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#5F4B8B',
    fontWeight: '600',
  },
  regenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  regenerateText: {
    fontSize: 14,
    color: '#5F4B8B',
    fontWeight: '600',
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: '#A593E0',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#5F4B8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});