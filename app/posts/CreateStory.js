import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const THEME_COLOR = '#a593e0';

export default function CreateStory({ navigation }) {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [storyText, setStoryText] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textColor, setTextColor] = useState('#ffffff');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [textElements, setTextElements] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [editingTextElement, setEditingTextElement] = useState(null);

  // Mock recent photos/videos for gallery
  const recentMedia = [
    { id: 1, uri: 'https://picsum.photos/300/400?random=1', type: 'image' },
    { id: 2, uri: 'https://picsum.photos/300/400?random=2', type: 'image' },
    { id: 3, uri: 'https://picsum.photos/300/400?random=3', type: 'image' },
    { id: 4, uri: 'https://picsum.photos/300/400?random=4', type: 'image' },
    { id: 5, uri: 'https://picsum.photos/300/400?random=5', type: 'image' },
    { id: 6, uri: 'https://picsum.photos/300/400?random=6', type: 'image' },
  ];

  const textColors = ['#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'];
  const availableStickers = ['😍', '😂', '🔥', '❤', '👍', '🎉', '😎', '🌟', '💯', '🙌', '🥳', '😘', '🤩', '💕', '✨', '🌈', '⚡', '💖', '🎊', '🌸'];

  // Enhanced Draggable Text Component with pinch-to-zoom functionality
  const DraggableText = ({ element, onUpdate, onDelete, onEdit }) => {
    const pan = useRef(new Animated.ValueXY({ x: element.x, y: element.y })).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);
    const baseScale = useRef(1);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 1;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 1;
      },
      onPanResponderGrant: () => {
        setSelectedTextElement(element.id);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 1) {
          // Single touch - handle dragging
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(evt, gestureState);
        } else if (evt.nativeEvent.touches.length === 2) {
          // Two touches - handle pinch to zoom
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) + 
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (baseScale.current === 1) {
            baseScale.current = distance;
            return;
          }
          
          const currentScale = distance / baseScale.current;
          const newScale = Math.max(0.5, Math.min(3, currentScale));
          
          scale.setValue(newScale);
          lastScale.current = newScale;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length <= 1) {
          pan.flattenOffset();
          const newX = pan.x._value;
          const newY = pan.y._value;
          
          // Calculate new font size based on scale
          const currentFontSize = element.fontSize || 18;
          const newFontSize = Math.max(12, Math.min(40, currentFontSize * lastScale.current));
          
          onUpdate(element.id, { 
            x: newX, 
            y: newY, 
            fontSize: newFontSize 
          });
          
          // Reset scale and base scale
          scale.setValue(1);
          lastScale.current = 1;
          baseScale.current = 1;
          
          setTimeout(() => setSelectedTextElement(null), 4000);
        }
      },
    });

    return (
      <Animated.View
        style={[
          styles.draggableElement,
          {
            transform: [
              { translateX: pan.x }, 
              { translateY: pan.y },
              { scale: scale }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.textElementContainer}>
          <TouchableOpacity 
            style={styles.textContainer}
            onPress={() => setSelectedTextElement(element.id)}
            onLongPress={() => onEdit(element)}
          >
            <Text style={[
              styles.overlayText, 
              { 
                color: element.color, 
                fontSize: element.fontSize || 18,
                fontWeight: '700',
                textShadowColor: element.color === '#ffffff' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }
            ]}>
              {element.text}
            </Text>
          </TouchableOpacity>
          {selectedTextElement === element.id && (
            <View style={styles.textControls}>
              <TouchableOpacity 
                style={styles.textControlButton} 
                onPress={() => onEdit(element)}
              >
                <Ionicons name="pencil" size={12} color={THEME_COLOR} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.textControlButton} 
                onPress={() => onDelete(element.id)}
              >
                <Ionicons name="trash" size={12} color="#ff4757" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  // Enhanced Draggable Sticker Component with pinch-to-zoom functionality
  const DraggableSticker = ({ sticker, onUpdate, onDelete }) => {
    const pan = useRef(new Animated.ValueXY({ x: sticker.x, y: sticker.y })).current;
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);
    const baseScale = useRef(1);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 1;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return evt.nativeEvent.touches.length === 1;
      },
      onPanResponderGrant: () => {
        setSelectedSticker(sticker.id);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 1) {
          // Single touch - handle dragging
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(evt, gestureState);
        } else if (evt.nativeEvent.touches.length === 2) {
          // Two touches - handle pinch to zoom
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) + 
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (baseScale.current === 1) {
            baseScale.current = distance;
            return;
          }
          
          const currentScale = distance / baseScale.current;
          const newScale = Math.max(0.5, Math.min(3, currentScale));
          
          scale.setValue(newScale);
          lastScale.current = newScale;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length <= 1) {
          pan.flattenOffset();
          const newX = pan.x._value;
          const newY = pan.y._value;
          
          // Calculate new size based on scale
          const currentSize = sticker.size || 32;
          const newSize = Math.max(20, Math.min(60, currentSize * lastScale.current));
          
          onUpdate(sticker.id, { 
            x: newX, 
            y: newY, 
            size: newSize 
          });
          
          // Reset scale and base scale
          scale.setValue(1);
          lastScale.current = 1;
          baseScale.current = 1;
          
          setTimeout(() => setSelectedSticker(null), 4000);
        }
      },
    });

    return (
      <Animated.View
        style={[
          styles.draggableElement,
          {
            transform: [
              { translateX: pan.x }, 
              { translateY: pan.y },
              { scale: scale }
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.stickerElementContainer}>
          <TouchableOpacity onPress={() => setSelectedSticker(sticker.id)}>
            <Text style={[styles.stickerText, { fontSize: sticker.size || 32 }]}>
              {sticker.emoji}
            </Text>
          </TouchableOpacity>
          {selectedSticker === sticker.id && (
            <View style={styles.stickerControls}>
              <TouchableOpacity 
                style={styles.stickerControlButton} 
                onPress={() => onDelete(sticker.id)}
              >
                <Ionicons name="trash" size={12} color="#ff4757" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  // Request permissions for camera and media library
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera and photo library permissions to use this feature.');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options = [
      { text: 'Take Photo', onPress: async () => {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        });

        if (!result.canceled) {
          setSelectedMedia({
            id: Date.now(),
            uri: result.assets[0].uri,
            type: 'image'
          });
        }
      }},
      { text: 'Record Video', onPress: async () => {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled) {
          setSelectedMedia({
            id: Date.now(),
            uri: result.assets[0].uri,
            type: 'video'
          });
        }
      }},
      { text: 'Choose from Gallery', onPress: async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        });

        if (!result.canceled) {
          setSelectedMedia({
            id: Date.now(),
            uri: result.assets[0].uri,
            type: result.assets[0].type || 'image'
          });
        }
      }},
      { text: 'Cancel', style: 'cancel' }
    ];

    Alert.alert('Media Options', 'Choose an option', options, { cancelable: true });
  };

  const handleSelectMedia = (media) => {
    setSelectedMedia(media);
  };

  // Function to handle deleting the selected media
  const handleDeleteMedia = () => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSelectedMedia(null);
            setTextElements([]);
            setStickers([]);
            setSelectedTextElement(null);
            setSelectedSticker(null);

            // Prompt to pick new photo after deletion
            setTimeout(() => handleTakePhoto(), 500);
          }
        },
      ]
    );
  };

  // Function to handle adding a new photo (replace current one)
  const handleAddNewPhoto = () => {
    Alert.alert(
      'Replace Photo',
      'Do you want to replace the current photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Replace', 
          onPress: () => {
            // Clear current media and elements, then open photo picker
            setSelectedMedia(null);
            setTextElements([]);
            setStickers([]);
            setSelectedTextElement(null);
            setSelectedSticker(null);
            handleTakePhoto();
          }
        },
      ]
    );
  };

  // Enhanced text handling functions
  const handleAddText = () => {
    setEditingTextElement(null);
    setStoryText('');
    setShowTextEditor(true);
  };

  const handleEditText = (element) => {
    setEditingTextElement(element);
    setStoryText(element.text);
    setTextColor(element.color);
    setShowTextEditor(true);
  };

  const handleSaveText = () => {
    if (storyText.trim()) {
      if (editingTextElement) {
        setTextElements(prev => prev.map(element => 
          element.id === editingTextElement.id 
            ? { ...element, text: storyText, color: textColor }
            : element
        ));
      } else {
        const newTextElement = {
          id: Date.now(),
          text: storyText,
          color: textColor,
          x: width / 2 - 75,
          y: 100,
          fontSize: 18,
        };
        setTextElements(prev => [...prev, newTextElement]);
      }
      setStoryText('');
      setEditingTextElement(null);
    }
    setShowTextEditor(false);
  };

  const handleUpdateTextElement = (id, updates) => {
    setTextElements(prev => prev.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const handleDeleteTextElement = (id) => {
    Alert.alert(
      'Delete Text',
      'Are you sure you want to delete this text?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          setTextElements(prev => prev.filter(e => e.id !== id));
          setSelectedTextElement(null);
        }},
      ]
    );
  };

  // Enhanced sticker handling functions
  const handleAddSticker = () => {
    setShowStickerPicker(true);
  };

  const handleSelectSticker = (sticker) => {
    const newSticker = {
      id: Date.now(),
      emoji: sticker,
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height * 0.3) + 100,
      size: 32,
    };
    setStickers([...stickers, newSticker]);
    setShowStickerPicker(false);
  };

  const handleUpdateSticker = (id, updates) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === id ? { ...sticker, ...updates } : sticker
    ));
  };

  const handleDeleteSticker = (id) => {
    Alert.alert(
      'Delete Sticker',
      'Are you sure you want to delete this sticker?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          setStickers(prev => prev.filter(s => s.id !== id));
          setSelectedSticker(null);
        }},
      ]
    );
  };

  const handleClearAllElements = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all text and stickers?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: () => {
          setTextElements([]);
          setStickers([]);
          setSelectedTextElement(null);
          setSelectedSticker(null);
        }},
      ]
    );
  };

  const handlePublishStory = () => {
    if (!selectedMedia) {
      Alert.alert('No Media Selected', 'Please select a photo or video first');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = (paymentMethod) => {
    setShowPaymentModal(false);
    
    Alert.alert(
      'Processing Payment',
      `Processing payment via ${paymentMethod}...` ,
      [{ text: 'OK' }]
    );

    setTimeout(() => {
      Alert.alert(
        'Payment Successful!',
        'Your story has been published successfully!',
        [{ text: 'OK', onPress: () => navigateToHome() }]
      );
    }, 2000);
  };

  const navigateToHome = () => {
    if (navigation) {
      navigation.navigate('Home');
    } else if (router) {
      router.push('/home');
    } else {
      console.log('Navigation to home page');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity 
          onPress={() => router ? router.back() : navigation?.goBack()} 
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={THEME_COLOR} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Create Story</Text>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedMedia && styles.nextButtonDisabled]}
          onPress={handlePublishStory}
          disabled={!selectedMedia}
        >
          <View style={[styles.nextButtonContainer, { backgroundColor: !selectedMedia ? '#ccc' : THEME_COLOR }]}>
            <Text style={styles.nextButtonText}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Media Container */}
          <TouchableOpacity 
            style={styles.addPhotoContainer} 
            onPress={selectedMedia ? undefined : handleTakePhoto}
            disabled={selectedMedia ? true : false}
          >
            {selectedMedia ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedMedia.uri }} style={styles.selectedImage} />
                
                {/* Delete Icon */}
                <TouchableOpacity 
                  style={styles.deleteIcon}
                  onPress={handleDeleteMedia}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4757" />
                </TouchableOpacity>
                
                {/* Text Elements */}
                {textElements.map((element) => (
                  <DraggableText
                    key={element.id}
                    element={element}
                    onUpdate={handleUpdateTextElement}
                    onDelete={handleDeleteTextElement}
                    onEdit={handleEditText}
                  />
                ))}

                {/* Stickers */}
                {stickers.map((sticker) => (
                  <DraggableSticker
                    key={sticker.id}
                    sticker={sticker}
                    onUpdate={handleUpdateSticker}
                    onDelete={handleDeleteSticker}
                  />
                ))}
                
                {/* Story Controls */}
                <View style={styles.storyControls}>
                  <TouchableOpacity style={styles.controlButton} onPress={handleAddText}>
                    <View style={[styles.controlButtonContainer, { backgroundColor: THEME_COLOR }]}>
                      <Ionicons name="text" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.controlButton} onPress={handleAddSticker}>
                    <View style={[styles.controlButtonContainer, { backgroundColor: THEME_COLOR }]}>
                      <Ionicons name="happy" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                  {(textElements.length > 0 || stickers.length > 0) && (
                    <TouchableOpacity style={styles.controlButton} onPress={handleClearAllElements}>
                      <View style={[styles.controlButtonContainer, { backgroundColor: THEME_COLOR }]}>
                        <Ionicons name="refresh" size={18} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Photo Management Controls */}
                <View style={styles.photoControls}>
                  <TouchableOpacity style={styles.photoControlButton} onPress={handleAddNewPhoto}>
                    <View style={[styles.photoControlContainer, { backgroundColor: THEME_COLOR }]}>
                      <Ionicons name="camera" size={16} color="#fff" />
                      <Text style={styles.photoControlText}>New Photo</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.photoControlButton} onPress={handleDeleteMedia}>
                    <View style={[styles.photoControlContainer, { backgroundColor: '#ff6b6b' }]}>
                      <Ionicons name="trash" size={16} color="#fff" />
                      <Text style={styles.photoControlText}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.addPhotoContent}>
                <View style={[styles.cameraIconContainer, { backgroundColor: THEME_COLOR }]}>
                  <Ionicons name="camera-outline" size={48} color="#fff" />
                </View>
                <Text style={styles.addPhotoTitle}>Add Your Media</Text>
                <Text style={styles.addPhotoSubtitle}>Tap to capture a moment or choose from gallery</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Gallery Section */}
          {!selectedMedia && (
            <View style={styles.gallerySection}>
              <Text style={styles.galleryTitle}>Recent Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryContainer}>
                {recentMedia.map((media) => (
                  <TouchableOpacity
                    key={media.id}
                    style={styles.galleryItem}
                    onPress={() => handleSelectMedia(media)}
                  >
                    <Image source={{ uri: media.uri }} style={styles.galleryImage} />
                    <View style={styles.galleryOverlay}>
                      <Ionicons name="add-circle" size={24} color={THEME_COLOR} />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Text Editor Modal */}
      <Modal visible={showTextEditor} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.textEditorModal}>
            <View style={styles.textEditorHeader}>
              <TouchableOpacity onPress={() => {
                setShowTextEditor(false);
                setEditingTextElement(null);
                setStoryText('');
              }}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.textEditorTitle}>
                {editingTextElement ? 'Edit Text' : 'Add Text'}
              </Text>
              <TouchableOpacity onPress={handleSaveText}>
                <View style={[styles.saveButtonContainer, { backgroundColor: THEME_COLOR }]}>
                  <Text style={styles.modalSaveText}>Done</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.textInput}
              placeholder="Share your thoughts..."
              placeholderTextColor="#999"
              value={storyText}
              onChangeText={setStoryText}
              multiline
              autoFocus
            />
            
            <View style={styles.colorPickerSection}>
              <Text style={styles.colorPickerTitle}>Text Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorPicker}>
                  {textColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        textColor === color && styles.colorOptionSelected
                      ]}
                      onPress={() => setTextColor(color)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sticker Picker Modal */}
      <Modal visible={showStickerPicker} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.stickerModal}>
            <View style={styles.stickerHeader}>
              <Text style={styles.stickerTitle}>Choose Sticker</Text>
              <TouchableOpacity onPress={() => setShowStickerPicker(false)}>
                <Ionicons name="close" size={24} color={THEME_COLOR} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.stickerScrollContainer}>
              <View style={styles.stickerGrid}>
                {availableStickers.map((sticker, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.stickerItem}
                    onPress={() => handleSelectSticker(sticker)}
                  >
                    <Text style={styles.stickerEmoji}>{sticker}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={showPaymentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.paymentModal}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentTitle}>Choose Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={THEME_COLOR} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentOptions}>
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => handlePayment('Credit Card')}
              >
                <View style={styles.paymentOptionContent}>
                  <Ionicons name="card" size={24} color={THEME_COLOR} />
                  <Text style={styles.paymentOptionText}>Credit Card</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => handlePayment('PayPal')}
              >
                <View style={styles.paymentOptionContent}>
                  <Ionicons name="wallet" size={24} color={THEME_COLOR} />
                  <Text style={styles.paymentOptionText}>PayPal</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => handlePayment('Credit Points')}
              >
                <View style={styles.paymentOptionContent}>
                  <View style={styles.creditPointsIcon}>
                    <View style={styles.creditPointsBackground}>
                              <Ionicons name="diamond" size={24} color={THEME_COLOR} />

                      <Text style={styles.creditPointsCount}>250</Text>
                    </View>
                  </View>
                  <Text style={styles.paymentOptionText}>Credit Points</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => handlePayment('Apple Pay')}
              >
                <View style={styles.paymentOptionContent}>
                  <Ionicons name="phone-portrait" size={24} color={THEME_COLOR} />
                  <Text style={styles.paymentOptionText}>Apple Pay</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.paymentOption}
                onPress={() => handlePayment('Google Pay')}
              >
                <View style={styles.paymentOptionContent}>
                  <Ionicons name="logo-google" size={24} color={THEME_COLOR} />
                  <Text style={styles.paymentOptionText}>Google Pay</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentFooter}>
              <Text style={styles.paymentFooterText}>
                Publishing cost: ₹179
              </Text>
              <Text style={styles.paymentFooterSubtext}>
                Secure payment processing
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    padding: 8,
  },
  nextButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  mainContent: {
    padding: 16,
  },
  addPhotoContainer: {
    width: '100%',
    aspectRatio: 9/16,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  addPhotoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addPhotoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  addPhotoSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectedImageContainer: {
    flex: 1,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
  },
  storyControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    zIndex: 100,
  },
  controlButton: {
    marginRight: 12,
  },
  controlButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

   creditCardIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditCardBackground: {
    width: 36,
    height: 24,
    backgroundColor: '#4169E1',
    borderRadius: 4,
    padding: 2,
    position: 'relative',
  },
  creditCardChip: {
    width: 6,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 1,
    position: 'absolute',
    top: 3,
    left: 3,
  },
  creditCardNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
  },
  creditCardNumber: {
    fontSize: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  creditPointsIcon: {
    width: 26,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditPointsBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  creditPointsCount: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 2,
  },
    photoControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    zIndex: 100,
  },
  photoControlButton: {
    marginTop: 8,
  },
  photoControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  photoControlText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  draggableElement: {
    position: 'absolute',
    zIndex: 10,
  },
  textElementContainer: {
    position: 'relative',
  },
  textContainer: {
    padding: 4,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  textControls: {
    position: 'absolute',
    top: -30,
    right: 0,
    flexDirection: 'row',
  },
  textControlButton: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  stickerElementContainer: {
    position: 'relative',
  },
  stickerText: {
    fontSize: 32,
  },
  stickerControls: {
    position: 'absolute',
    top: -15,
    right: -15,
  },
  stickerControlButton: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  gallerySection: {
    marginTop: 20,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  galleryContainer: {
    paddingRight: 16,
  },
  galleryItem: {
    width: 80,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  textEditorModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: 300,
  },
  textEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
  },
  textEditorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  textInput: {
    fontSize: 18,
    color: '#333',
    padding: 20,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  colorPickerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#ddd',
  },
  stickerModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  stickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  stickerScrollContainer: {
    padding: 20,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stickerItem: {
    width: (width - 80) / 5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  stickerEmoji: {
    fontSize: 28,
  },
  paymentModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  paymentOptions: {
    padding: 20,
  },
  paymentOption: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 16,
  },
  paymentFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentFooterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  paymentFooterSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});