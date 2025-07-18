import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Animated,
  Dimensions,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CreateEvent() {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [isFreeEvent, setIsFreeEvent] = useState(true);
  const [scaleAnimation] = useState(new Animated.Value(1));
  const [posterImage, setPosterImage] = useState(null);

  // Updated state variables for dropdown selections
  const [about, setAbout] = useState('');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [entryAllowed, setEntryAllowed] = useState('');
  const [layout, setLayout] = useState('');
  const [seating, setSeating] = useState('');
  const [kidFriendly, setKidFriendly] = useState('');
  const [petFriendly, setPetFriendly] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [prohibitedItems, setProhibitedItems] = useState({
    outsideFood: false,
    alcohol: false,
    metalContainer: false,
    glassContainers: false,
    flammableMaterials: false,
    lighterMatchbox: false,
    aerosolDeodorants: false,
    laserPointers: false,
    drones: false,
    professionalCameras: false,
  });
  const [venue, setVenue] = useState('');
  const [venueAddress, setVenueAddress] = useState('');

  // Modal states for dropdown selections
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState([]);

  // Options for different dropdowns
  const languageOptions = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];
  const durationOptions = ['1 Hour', '2 Hours', '3 Hours', '4 Hours', '5 Hours', '6+ Hours'];
  const ageLimitOptions = ['All Ages', '3+ Years', '5+ Years', '13+ Years', '18+ Years', '21+ Years'];
  const entryAllowedOptions = ['All Welcome', 'Ticket Required', 'Invitation Only', 'Members Only'];
  const layoutOptions = ['Indoor', 'Outdoor']; // Updated to only indoor and outdoor
  const seatingOptions = ['All Seated', 'All Standing', 'Seated & Standing', 'General Admission'];
  const kidFriendlyOptions = ['Yes', 'No', 'Adult Supervision Required'];
  const petFriendlyOptions = ['Yes', 'No', 'Service Animals Only'];


const handleBack = () => {
  router.replace('/');
};
  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to select the event poster',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleGalleryImagePicker = () => {
    Alert.alert(
      'Add Gallery Image',
      'Choose how you want to add gallery images',
      [
        { text: 'Camera', onPress: () => openCameraForGallery() },
        { text: 'Gallery', onPress: () => openGalleryForGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPosterImage(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPosterImage(result.assets[0]);
    }
  };

  const openCameraForGallery = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setGalleryImages([...galleryImages, result.assets[0]]);
    }
  };

  const openGalleryForGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setGalleryImages([...galleryImages, result.assets[0]]);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
  };

  const removePosterImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the poster image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => setPosterImage(null), style: 'destructive' },
      ]
    );
  };

  const handleTogglePress = (isFree) => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsFreeEvent(isFree);
    if (isFree) {
      setPrice('');
    }
  };

  const openDropdown = (type) => {
    let options = [];
    switch (type) {
      case 'language':
        options = languageOptions;
        break;
      case 'duration':
        options = durationOptions;
        break;
      case 'ageLimit':
        options = ageLimitOptions;
        break;
      case 'entryAllowed':
        options = entryAllowedOptions;
        break;
      case 'layout':
        options = layoutOptions;
        break;
      case 'seating':
        options = seatingOptions;
        break;
      case 'kidFriendly':
        options = kidFriendlyOptions;
        break;
      case 'petFriendly':
        options = petFriendlyOptions;
        break;
      default:
        options = [];
    }
    setModalType(type);
    setModalData(options);
    setModalVisible(true);
  };

  const selectOption = (option) => {
    switch (modalType) {
      case 'language':
        setLanguage(option);
        break;
      case 'duration':
        setDuration(option);
        break;
      case 'ageLimit':
        setAgeLimit(option);
        break;
      case 'entryAllowed':
        setEntryAllowed(option);
        break;
      case 'layout':
        setLayout(option);
        break;
      case 'seating':
        setSeating(option);
        break;
      case 'kidFriendly':
        setKidFriendly(option);
        break;
      case 'petFriendly':
        setPetFriendly(option);
        break;
    }
    setModalVisible(false);
  };

  const toggleProhibitedItem = (item) => {
    setProhibitedItems({
      ...prohibitedItems,
      [item]: !prohibitedItems[item]
    });
  };

  const handleCreate = () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name');
      return;
    }

    const eventDetails = `Event Created Successfully!\n\nEvent Name: ${eventName}\nLocation: ${location || 'TBD'}\nDate: ${date || 'TBD'}\nMonth: ${month || 'TBD'}\nTime: ${time || 'TBD'}\nPrice: ${isFreeEvent ? 'Free' : (price ? `₹${price}` : 'TBD')}\nPoster: ${posterImage ? 'Added' : 'No poster'}\nAbout: ${about || 'TBD'}\nLanguage: ${language || 'TBD'}\nDuration: ${duration || 'TBD'}\nAge Limit: ${ageLimit || 'TBD'}\nVenue: ${venue || 'TBD'}`;

    Alert.alert('Success', eventDetails);
  };

  const prohibitedItemsList = [
    { key: 'outsideFood', label: 'Outside Food & Beverage' },
    { key: 'alcohol', label: 'Alcohol' },
    { key: 'metalContainer', label: 'Metal Container' },
    { key: 'glassContainers', label: 'Glass containers' },
    { key: 'flammableMaterials', label: 'Flammable Materials' },
    { key: 'lighterMatchbox', label: 'Lighter and Matchbox' },
    { key: 'aerosolDeodorants', label: 'Aerosol/Deodorants' },
    { key: 'laserPointers', label: 'Laser pointers/flashlight' },
    { key: 'drones', label: 'Drones' },
    { key: 'professionalCameras', label: 'Professional Cameras' },
  ];

  const renderImageIcon = () => (
    <View style={styles.imageIconContainer}>
      <View style={styles.imageIconBorder}>
        <View style={styles.imageIconInner}>
          <View style={styles.imageIconCircle} />
          <View style={styles.imageIconMountain1} />
          <View style={styles.imageIconMountain2} />
        </View>
      </View>
    </View>
  );

  const renderCameraIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.cameraBody}>
        <View style={styles.cameraLens} />
      </View>
    </View>
  );

  const renderCheckmark = () => (
    <View style={styles.checkmark}>
      <Text style={styles.checkmarkText}>✓</Text>
    </View>
  );

  const renderBackArrow = () => (
    <View style={styles.backArrowContainer}>
      <View style={styles.backArrowLine} />
      <View style={styles.backArrowHead} />
    </View>
  );

  const renderPlusIcon = () => (
    <View style={styles.plusIcon}>
      <View style={styles.plusHorizontal} />
      <View style={styles.plusVertical} />
    </View>
  );

  const renderDropdownIcon = () => (
    <View style={styles.dropdownIcon}>
      <View style={styles.dropdownArrow} />
    </View>
  );

  const renderCloseIcon = () => (
    <View style={styles.closeIcon}>
      <View style={styles.closeLine1} />
      <View style={styles.closeLine2} />
    </View>
  );

  const getCurrentValue = (type) => {
    switch (type) {
      case 'language': return language;
      case 'duration': return duration;
      case 'ageLimit': return ageLimit;
      case 'entryAllowed': return entryAllowed;
      case 'layout': return layout;
      case 'seating': return seating;
      case 'kidFriendly': return kidFriendly;
      case 'petFriendly': return petFriendly;
      default: return '';
    }
  };

  const getPlaceholderText = (type) => {
    switch (type) {
      case 'language': return 'Select Language';
      case 'duration': return 'Select Duration';
      case 'ageLimit': return 'Select Age Limit';
      case 'entryAllowed': return 'Select Entry Type';
      case 'layout': return 'Select Layout';
      case 'seating': return 'Select Seating';
      case 'kidFriendly': return 'Select Option';
      case 'petFriendly': return 'Select Option';
      default: return 'Select Option';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            {renderBackArrow()}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Poster Upload Section */}
          <View style={styles.posterSection}>
            <Text style={styles.sectionTitle}>Event Poster</Text>
            {posterImage ? (
              <View style={styles.posterContainer}>
                <Image source={{ uri: posterImage.uri }} style={styles.posterImageLarge} />
                <View style={styles.posterOverlay}>
                  <View style={styles.posterButtons}>
                    <TouchableOpacity style={styles.posterActionButton} onPress={handleImagePicker}>
                      {renderCameraIcon()}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.posterActionButton, styles.removeButton]} onPress={removePosterImage}>
                      <View style={styles.deleteIcon}>
                        <View style={styles.deleteLine1} />
                        <View style={styles.deleteLine2} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButtonLarge} onPress={handleImagePicker}>
                <View style={styles.uploadContent}>
                  {renderImageIcon()}
                  <Text style={styles.uploadTitle}>Add Event Poster</Text>
                  <Text style={styles.uploadSubtitle}>Upload a stunning poster for your event</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Event Details */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Name *</Text>
              <TextInput
                value={eventName}
                onChangeText={setEventName}
                placeholder="Enter event name"
                style={styles.inputModern}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
                style={styles.inputModern}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.dateTimeRow}>
              <View style={[styles.inputGroup, styles.dateInput]}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="DD"
                  keyboardType="numeric"
                  maxLength={2}
                  style={styles.inputModern}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputGroup, styles.monthInput]}>
                <Text style={styles.label}>Month</Text>
                <TextInput
                  value={month}
                  onChangeText={setMonth}
                  placeholder="MM"
                  style={styles.inputModern}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputGroup, styles.timeInput]}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  style={styles.inputModern}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* About Section */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>About</Text>
              <TextInput
                value={about}
                onChangeText={setAbout}
                placeholder="Describe your event..."
                style={[styles.inputModern, styles.textArea]}
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Details Section with Dropdowns */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Language</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, language && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('language')}
                  >
                    <Text style={[styles.dropdownText, !language && styles.placeholder]}>
                      {language || getPlaceholderText('language')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Duration</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, duration && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('duration')}
                  >
                    <Text style={[styles.dropdownText, !duration && styles.placeholder]}>
                      {duration || getPlaceholderText('duration')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Age Limit</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, ageLimit && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('ageLimit')}
                  >
                    <Text style={[styles.dropdownText, !ageLimit && styles.placeholder]}>
                      {ageLimit || getPlaceholderText('ageLimit')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Entry Allowed</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, entryAllowed && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('entryAllowed')}
                  >
                    <Text style={[styles.dropdownText, !entryAllowed && styles.placeholder]}>
                      {entryAllowed || getPlaceholderText('entryAllowed')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Layout</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, layout && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('layout')}
                  >
                    <Text style={[styles.dropdownText, !layout && styles.placeholder]}>
                      {layout || getPlaceholderText('layout')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Seating</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, seating && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('seating')}
                  >
                    <Text style={[styles.dropdownText, !seating && styles.placeholder]}>
                      {seating || getPlaceholderText('seating')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Kid Friendly?</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, kidFriendly && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('kidFriendly')}
                  >
                    <Text style={[styles.dropdownText, !kidFriendly && styles.placeholder]}>
                      {kidFriendly || getPlaceholderText('kidFriendly')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Pet Friendly?</Text>
                  <TouchableOpacity 
                    style={[styles.dropdownButton, petFriendly && styles.dropdownButtonSelected]} 
                    onPress={() => openDropdown('petFriendly')}
                  >
                    <Text style={[styles.dropdownText, !petFriendly && styles.placeholder]}>
                      {petFriendly || getPlaceholderText('petFriendly')}
                    </Text>
                    <View style={styles.dropdownIcons}>
                      {renderDropdownIcon()}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Gallery Section */}
            <View style={styles.gallerySection}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <View style={styles.galleryGrid}>
                {galleryImages.map((image, index) => (
                  <View key={index} style={styles.galleryImageContainer}>
                    <Image source={{ uri: image.uri }} style={styles.galleryImage} />
                    <TouchableOpacity 
                      style={styles.removeGalleryImageButton}
                      onPress={() => removeGalleryImage(index)}
                    >
                      <View style={styles.deleteIcon}>
                        <View style={styles.deleteLine1} />
                        <View style={styles.deleteLine2} />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addGalleryImageButton} onPress={handleGalleryImagePicker}>
                  {renderPlusIcon()}
                  <Text style={styles.addGalleryText}>Add Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Prohibited Items Section */}
            <View style={styles.prohibitedSection}>
              <Text style={styles.sectionTitle}>Prohibited Items</Text>
              <View style={styles.prohibitedGrid}>
                {prohibitedItemsList.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.prohibitedItem,
                      prohibitedItems[item.key] && styles.prohibitedItemSelected
                    ]}
                    onPress={() => toggleProhibitedItem(item.key)}
                  >
                    <Text style={[
                      styles.prohibitedItemText,
                      prohibitedItems[item.key] && styles.prohibitedItemTextSelected
                    ]}>
                      {item.label}
                    </Text>
                    {prohibitedItems[item.key] && (
                      <View style={styles.prohibitedCheckmark}>
                        {renderCheckmark()}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Venue Section */}
            <View style={styles.venueSection}>
              <Text style={styles.sectionTitle}>Venue</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Venue Name</Text>
                <TextInput
                  value={venue}
                  onChangeText={setVenue}
                  placeholder="Enter venue name"
                  style={styles.inputModern}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Venue Address</Text>
                <TextInput
                  value={venueAddress}
                  onChangeText={setVenueAddress}
                  placeholder="Enter venue address"
                  style={[styles.inputModern, styles.textArea]}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Pricing Section */}
            <View style={styles.pricingSection}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <Animated.View style={[styles.toggleContainer, { transform: [{ scale: scaleAnimation }] }]}>
                <TouchableOpacity
                  style={[styles.toggleButton, isFreeEvent && styles.toggleButtonActive]}
                  onPress={() => handleTogglePress(true)}
                >
                  <Text style={[styles.toggleText, isFreeEvent && styles.toggleTextActive]}>Free</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !isFreeEvent && styles.toggleButtonActive]}
                  onPress={() => handleTogglePress(false)}
                >
                  <Text style={[styles.toggleText, !isFreeEvent && styles.toggleTextActive]}>Paid</Text>
                </TouchableOpacity>
              </Animated.View>

              {!isFreeEvent && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Price (₹)</Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    style={styles.inputModern}
                    placeholderTextColor="#999"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for Dropdown Selections */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {modalType}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  {renderCloseIcon()}
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalContent}>
                {modalData.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      getCurrentValue(modalType) === option && styles.modalOptionSelected
                    ]}
                    onPress={() => selectOption(option)}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      getCurrentValue(modalType) === option && styles.modalOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                    {getCurrentValue(modalType) === option && (
                      <View style={styles.modalCheckmark}>
                        {renderCheckmark()}
                      </View>
                    )}
                  </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
            </View>
            </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backArrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowLine: {
    width: 16,
    height: 2,
    backgroundColor: '#333',
    position: 'absolute',
  },
  backArrowHead: {
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: '#333',
    transform: [{ rotate: '-45deg' }],
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  posterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  uploadButtonLarge: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    minHeight: 200,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  posterContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  posterImageLarge: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  posterButtons: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  posterActionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: '#ff4757',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputModern: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  monthInput: {
    flex: 1,
  },
  timeInput: {
    flex: 1,
  },
  detailsSection: {
    marginTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  dropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dropdownButtonSelected: {
  backgroundColor: '#f2e8fa', // optional soft purple background
  borderColor: '#cba3ea',
},
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  dropdownIcons: {
    marginLeft: 8,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#666',
  },
  gallerySection: {
    marginTop: 24,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryImageContainer: {
    position: 'relative',
    width: (SCREEN_WIDTH - 80) / 3,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeGalleryImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff4757',
    borderRadius: 12,
    padding: 4,
  },
  addGalleryImageButton: {
    width: (SCREEN_WIDTH - 80) / 3,
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  addGalleryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  prohibitedSection: {
    marginTop: 24,
  },
  prohibitedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prohibitedItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
  },
  prohibitedItemSelected: {
  backgroundColor: '#f2e8fa', // optional soft purple background
  borderColor: '#cba3ea',
},
  prohibitedItemText: {
    fontSize: 12,
    color: '#666',
  },
 prohibitedItemTextSelected: {
  color: '#cba3ea',
  fontWeight: '600',
},

  prohibitedCheckmark: {
    marginLeft: 6,
  },
  venueSection: {
    marginTop: 24,
  },
  pricingSection: {
    marginTop: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#cba3ea',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
createButton: {
  backgroundColor: '#cba3ea',
  borderRadius: 16,
  paddingVertical: 16,
  alignItems: 'center',
  marginTop: 24,
},
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  // Icon styles
  imageIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconBorder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIconInner: {
    width: 32,
    height: 24,
    position: 'relative',
  },
  imageIconCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    position: 'absolute',
    top: 2,
    right: 4,
  },
  imageIconMountain1: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 2,
  },
  imageIconMountain2: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBody: {
    width: 20,
    height: 16,
    backgroundColor: '#333',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
checkmark: {
  width: 16,
  height: 16,
  backgroundColor: '#cba3ea', // ✅ Purple tick circle
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
 checkmarkText: {
  color: '#fff', // or '#cba3ea' if tick is an icon instead
  fontSize: 10,
  fontWeight: 'bold',
},
  plusIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    width: 16,
    height: 2,
    backgroundColor: '#666',
    position: 'absolute',
  },
  plusVertical: {
    width: 2,
    height: 16,
    backgroundColor: '#666',
    position: 'absolute',
  },
  deleteIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteLine1: {
    width: 12,
    height: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  deleteLine2: {
    width: 12,
    height: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  closeIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine1: {
    width: 16,
    height: 2,
    backgroundColor: '#333',
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    width: 16,
    height: 2,
    backgroundColor: '#333',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  modalContent: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  modalOptionSelected: {
  backgroundColor: '#f2e8fa',
},
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
 modalOptionTextSelected: {
  color: '#cba3ea',
  fontWeight: '600',
},
  modalCheckmark: {
    marginLeft: 12,
  },
});