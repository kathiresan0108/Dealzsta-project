import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, Platform, Alert, ActivityIndicator, ScrollView, Animated, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Camera, Upload, FileText, MapPin, Building2, CreditCard, Check, Utensils, ShoppingCart, Shirt, Laptop, Heart, Dumbbell, Car, Stethoscope, Plane, GraduationCap, Film, Plus, ArrowLeft, CircleAlert as AlertCircle, User, Phone, Mail, Globe, DollarSign, Users, Calendar, Eye, ChevronDown, ChevronRight, X, Link, Map, RotateCcw } from 'lucide-react-native';
import GrandPopup from '@/components/common/GrandPopup';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;
const isSmallScreen = height < 700;

export default function BusinessVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: '',
    businessType: '',
    industry: [],
    registrationNumber: '',
    registrationDate: '',
    otherIndustry: '',
    
    // Step 2: Contact Details
    ownerName: '',
    ownerEmail: '',
    phoneNumber: '',
    alternativePhone: '',
    website: '',
    
    // Step 3: Address
    businessAddress: '',
    state: '',
    city: '',
    postalCode: '',
    country: 'India',
    latitude: 0,
    longitude: 0,
    
    // Step 4: Financial Info (Optional)
    annualRevenue: '',
    numberOfEmployees: '',
    yearsInBusiness: '',
    bankAccountNumber: '',
    
    // Step 5: Documents
    gstDocument: null,
    panDocument: null,
    shopImage: null,
    fssaiCertificate: null,
    
    // Step 6: Review
    termsAccepted: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [gstError, setGstError] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [industryAnimations] = useState({});
  const [progressAnimation] = useState(new Animated.Value(0));
  
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Initialize animations for industries
  useEffect(() => {
    industries.forEach(industry => {
      if (!industryAnimations[industry.id]) {
        industryAnimations[industry.id] = new Animated.Value(0);
      }
    });
  }, []);

  // Update progress animation when step changes
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: (currentStep - 1) / 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Business Types
  const businessTypes = [
    { value: 'proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'pvt_ltd', label: 'Private Limited' },
    { value: 'ltd', label: 'Public Limited' },
    { value: 'llp', label: 'Limited Liability Partnership' },
    { value: 'other', label: 'Other' },
  ];

  // Industries/Categories  
  const industries = [
    { id: 'food', icon: Utensils, color: '#FF6B6B', gradient: ['#FF6B6B', '#FF8E53'], label: 'Food & Dining' },
    { id: 'retail', icon: ShoppingCart, color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'], label: 'Retail' },
    { id: 'fashion', icon: Shirt, color: '#45B7D1', gradient: ['#45B7D1', '#96C93D'], label: 'Fashion' },
    { id: 'electronics', icon: Laptop, color: '#6C5CE7', gradient: ['#6C5CE7', '#A29BFE'], label: 'Electronics' },
    { id: 'beauty', icon: Heart, color: '#FD79A8', gradient: ['#FD79A8', '#FDCB6E'], label: 'Beauty' },
    { id: 'fitness', icon: Dumbbell, color: '#00B894', gradient: ['#00B894', '#00CEC9'], label: 'Fitness' },
    { id: 'automotive', icon: Car, color: '#E17055', gradient: ['#E17055', '#FDCB6E'], label: 'Automotive' },
    { id: 'healthcare', icon: Stethoscope, color: '#0984E3', gradient: ['#0984E3', '#74B9FF'], label: 'Healthcare' },
    { id: 'travel', icon: Plane, color: '#A29BFE', gradient: ['#A29BFE', '#6C5CE7'], label: 'Travel' },
    { id: 'education', icon: GraduationCap, color: '#FDCB6E', gradient: ['#FDCB6E', '#E17055'], label: 'Education' },
    { id: 'entertainment', icon: Film, color: '#FD79A8', gradient: ['#FD79A8', '#FDCB6E'], label: 'Entertainment' },
    { id: 'other', icon: Plus, color: '#636E72', gradient: ['#636E72', '#2D3436'], label: 'Other' },
  ];

  // Revenue ranges
  const revenueRanges = [
    { value: '0-1L', label: 'Up to ₹1 Lakh' },
    { value: '1L-5L', label: '₹1 - ₹5 Lakhs' },
    { value: '5L-10L', label: '₹5 - ₹10 Lakhs' },
    { value: '10L-25L', label: '₹10 - ₹25 Lakhs' },
    { value: '25L-50L', label: '₹25 - ₹50 Lakhs' },
    { value: '50L-1Cr', label: '₹50 Lakhs - ₹1 Crore' },
    { value: '1Cr+', label: 'Above ₹1 Crore' },
  ];

  // Employee ranges
  const employeeRanges = [
    { value: '1', label: 'Just me (1)' },
    { value: '2-5', label: '2-5 employees' },
    { value: '6-10', label: '6-10 employees' },
    { value: '11-25', label: '11-25 employees' },
    { value: '26-50', label: '26-50 employees' },
    { value: '51-100', label: '51-100 employees' },
    { value: '100+', label: '100+ employees' },
  ];

  const stepTitles = [
    { step: 1, title: 'Business Info', icon: Building2 },
    { step: 2, title: 'Contact Details', icon: User },
    { step: 3, title: 'Address Info', icon: MapPin },
    { step: 4, title: 'Financial Details', icon: DollarSign },
    { step: 5, title: 'Documents', icon: FileText },
    { step: 6, title: 'Review & Submit', icon: Eye },
  ];

  // Pin code to location mapping (mock data)
  const pincodeToLocation = {
    '110001': { city: 'New Delhi', state: 'Delhi' },
    '400001': { city: 'Mumbai', state: 'Maharashtra' },
    '560001': { city: 'Bangalore', state: 'Karnataka' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu' },
    '700001': { city: 'Kolkata', state: 'West Bengal' },
    '380001': { city: 'Ahmedabad', state: 'Gujarat' },
    '500001': { city: 'Hyderabad', state: 'Telangana' },
    '411001': { city: 'Pune', state: 'Maharashtra' },
    '302001': { city: 'Jaipur', state: 'Rajasthan' },
    '695001': { city: 'Thiruvananthapuram', state: 'Kerala' },
  };

  const validateGST = (gstNumber) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  };

  const verifyGSTNumber = async (gstNumber) => {
    if (!gstNumber || gstNumber.length !== 15) {
      setGstError('GST number must be 15 characters');
      setGstVerified(false);
      return;
    }

    if (!validateGST(gstNumber)) {
      setGstError('Invalid GST number format');
      setGstVerified(false);
      return;
    }

    setGstVerifying(true);
    setGstError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockVerificationResult = Math.random() > 0.3;
      
      if (mockVerificationResult) {
        setGstVerified(true);
        setGstError('');
      } else {
        setGstVerified(false);
        setGstError('GST number not found');
      }
    } catch (error) {
      setGstVerified(false);
      setGstError('Verification failed');
    } finally {
      setGstVerifying(false);
    }
  };

  const handlePincodeChange = (pincode) => {
    handleInputChange('postalCode', pincode);
    
    if (pincode.length === 6) {
      const location = pincodeToLocation[pincode];
      if (location) {
        handleInputChange('city', location.city);
        handleInputChange('state', location.state);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'registrationNumber') {
      setGstVerified(false);
      setGstError('');
      if (value.length === 15) {
        verifyGSTNumber(value);
      }
    }
    
    if (field === 'industry') {
      setShowOtherInput(value.includes('other'));
      if (!value.includes('other')) {
        setFormData(prev => ({ ...prev, otherIndustry: '' }));
      }
    }
  };

  const handleIndustrySelect = (industryId) => {
    // Animate the industry button
    Animated.sequence([
      Animated.timing(industryAnimations[industryId], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(industryAnimations[industryId], {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setFormData(prev => {
      const currentIndustries = prev.industry || [];
      let newIndustries;
      
      if (currentIndustries.includes(industryId)) {
        newIndustries = currentIndustries.filter(id => id !== industryId);
      } else {
        newIndustries = [...currentIndustries, industryId];
      }
      
      setShowOtherInput(newIndustries.includes('other'));
      if (!newIndustries.includes('other')) {
        return { ...prev, industry: newIndustries, otherIndustry: '' };
      }
      
      return { ...prev, industry: newIndustries };
    });
  };

  const isDocumentRequired = () => {
    return {
      fssaiRequired: formData.industry.includes('food'),
    };
  };

  const handleDocumentUpload = async (type) => {
    Alert.alert(
      'Select Document',
      'Choose upload method',
      [
        { text: 'Camera', onPress: () => openCamera(type) },
        { text: 'Gallery', onPress: () => openGallery(type) },
        { text: 'Files', onPress: () => openDocumentPicker(type) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async (type) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange(type, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const openGallery = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange(type, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const openDocumentPicker = async (type) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        handleInputChange(type, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.businessName.trim() && 
               formData.businessType && 
               formData.industry.length > 0 && 
               formData.registrationNumber.trim() && 
               gstVerified;
      case 2:
        return formData.ownerName.trim() && 
               formData.ownerEmail.trim() && 
               formData.phoneNumber.trim();
      case 3:
        return formData.businessAddress.trim() && 
               formData.city.trim() && 
               formData.state.trim() && 
               formData.postalCode.trim();
      case 4:
        return true; // All fields are optional
      case 5:
        const docReqs = isDocumentRequired();
        const panRequired = formData.panDocument;
        const shopRequired = formData.shopImage;
        const fssaiRequired = !docReqs.fssaiRequired || formData.fssaiCertificate;
        return panRequired && shopRequired && fssaiRequired;
      case 6:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setPopupConfig({
        title: 'Incomplete Information',
        message: 'Please complete all required fields in this step to continue.',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(6)) {
      setPopupConfig({
        title: 'Terms Required',
        message: 'Please accept the terms and conditions to proceed.',
        type: 'error',
        buttons: [
          { text: 'OK', style: 'primary', onPress: () => setShowPopup(false) }
        ]
      });
      setShowPopup(true);
      return;
    }

    setPopupConfig({
      title: 'Verification Submitted',
      message: 'Your business verification is under review. You\'ll hear from us within 24-48 hours.',
      type: 'success',
      buttons: [
        { text: 'Continue', style: 'primary', onPress: () => {
          setShowPopup(false);
          router.push('/(tabs)');
        }}
      ]
    });
    setShowPopup(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigateToTerms = () => {
    router.push('/terms-conditions');
  };

  // Progress Bar Component
  const renderProgressBar = () => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <Animated.View 
          style={[
            styles.progressBarFill,
            {
              width: progressAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        Step {currentStep} of 6 - {Math.round((currentStep / 6) * 100)}% Complete
      </Text>
    </View>
  );

  // Render Step Progress
  const renderStepProgress = () => (
    <View style={styles.stepProgressContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepProgressContent}>
        {stepTitles.map((item, index) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          const IconComponent = item.icon;
          
          return (
            <TouchableOpacity
              key={item.step}
              style={[
                styles.stepItem,
                isActive && styles.stepItemActive,
                isCompleted && styles.stepItemCompleted,
              ]}
              onPress={() => setCurrentStep(item.step)}
            >
              <View style={[
                styles.stepIconContainer,
                isActive && styles.stepIconActive,
                isCompleted && styles.stepIconCompleted,
              ]}>
                {isCompleted ? (
                  <Check size={16} color="#FFFFFF" />
                ) : (
                  <IconComponent size={16} color={isActive ? '#FFFFFF' : '#666'} />
                )}
              </View>
              <Text style={[
                styles.stepText,
                isActive && styles.stepTextActive,
                isCompleted && styles.stepTextCompleted,
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Map Modal Component
  const renderMapModal = () => (
    <Modal visible={showMapModal} animationType="slide" transparent={true}>
      <View style={styles.mapModalContainer}>
        <View style={styles.mapModalContent}>
          <View style={styles.mapModalHeader}>
            <Text style={styles.mapModalTitle}>Select Location</Text>
            <TouchableOpacity onPress={() => setShowMapModal(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Map size={48} color="#A593E0" />
              <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
              <Text style={styles.mapPlaceholderSubtext}>Drag pin to adjust location</Text>
              
              <View style={styles.mapPin}>
                <MapPin size={32} color="#FF4444" />
              </View>
            </View>
          </View>
          
          <View style={styles.mapActions}>
            <TouchableOpacity 
              style={styles.mapResetButton}
              onPress={() => {
                setMapRegion({
                  latitude: 28.6139,
                  longitude: 77.2090,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }}
            >
              <RotateCcw size={20} color="#A593E0" />
              <Text style={styles.mapResetText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.mapConfirmButton}
              onPress={() => {
                handleInputChange('latitude', mapRegion.latitude);
                handleInputChange('longitude', mapRegion.longitude);
                setShowMapModal(false);
              }}
            >
              <Text style={styles.mapConfirmText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render Step Content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBusinessInfo();
      case 2:
        return renderContactDetails();
      case 3:
        return renderAddressInfo();
      case 4:
        return renderFinancialInfo();
      case 5:
        return renderDocuments();
      case 6:
        return renderReview();
      default:
        return null;
    }
  };

  // Step 1: Business Info
  const renderBusinessInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <Building2 size={20} color="#A593E0" />
          </View>
          <Text style={styles.cardTitle}>Business Information</Text>
        </View>
        
        <View style={styles.formGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name *</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Enter your business name"
              placeholderTextColor="#888"
              value={formData.businessName}
              onChangeText={(value) => handleInputChange('businessName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Type *</Text>
            <TouchableOpacity
              style={styles.modernDropdown}
              onPress={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}
            >
              <Text style={[styles.dropdownText, !formData.businessType && styles.placeholderText]}>
                {formData.businessType ? businessTypes.find(t => t.value === formData.businessType)?.label : 'Select business type'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showBusinessTypeDropdown && (
              <View style={styles.dropdownOptions}>
                {businessTypes.map(type => (
                  <TouchableOpacity
                    key={type.value}
                    style={styles.dropdownOption}
                    onPress={() => {
                      handleInputChange('businessType', type.value);
                      setShowBusinessTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GST Registration Number *</Text>
            <View style={styles.gstInputContainer}>
              <TextInput
                style={[styles.modernInput, { paddingRight: 40 }]}
                placeholder="Enter 15-digit GST number"
                placeholderTextColor="#888"
                value={formData.registrationNumber}
                onChangeText={(value) => handleInputChange('registrationNumber', value.toUpperCase())}
                maxLength={15}
              />
              <View style={styles.gstStatusIcon}>
                {gstVerifying && <ActivityIndicator size="small" color="#A593E0" />}
                {!gstVerifying && gstVerified && <Check size={18} color="#4CAF50" />}
                {!gstVerifying && gstError && <AlertCircle size={18} color="#F44336" />}
              </View>
            </View>
            {gstError ? <Text style={styles.errorText}>{gstError}</Text> : null}
            {gstVerified ? <Text style={styles.successText}>✓ GST verified successfully</Text> : null}
          </View>
        </View>
      </View>

      {/* Industry Selection */}
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <CreditCard size={20} color="#5F4B8B" />
          </View>
          <Text style={styles.cardTitle}>Industry Categories *</Text>
          <Text style={styles.cardSubtitle}>(Select multiple)</Text>
        </View>
        
        <View style={styles.industryGrid}>
          {industries.map((industry) => {
            const isSelected = formData.industry.includes(industry.id);
            const IconComponent = industry.icon;
            const scaleAnim = industryAnimations[industry.id] || new Animated.Value(0);
            
            return (
              <Animated.View
                key={industry.id}
                style={[
                  styles.industryItem,
                  {
                    transform: [{
                      scale: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0.95],
                      }),
                    }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.industryButton,
                    {
                      backgroundColor: isSelected ? '#FFFFFF' : '#FAFAFA',
                      borderColor: isSelected ? industry.color : '#E8E8E8',
                      borderWidth: isSelected ? 2 : 1,
                      shadowColor: isSelected ? industry.color : '#000',
                      shadowOpacity: isSelected ? 0.3 : 0.1,
                      elevation: isSelected ? 8 : 2,
                    }
                  ]}
                  onPress={() => handleIndustrySelect(industry.id)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <LinearGradient
                      colors={industry.gradient}
                      style={styles.selectedGradientOverlay}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  )}
                  
                  <View style={[
                    styles.industryIconContainer,
                    { 
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.9)' : '#FFFFFF',
                    }
                  ]}>
                    <IconComponent 
                      size={18} 
                      color={isSelected ? industry.color : '#666'} 
                      strokeWidth={2}
                    />
                  </View>
                  
                  <Text style={[
                    styles.industryText,
                    { 
                      color: isSelected ? '#FFFFFF' : '#333',
                      fontWeight: isSelected ? '700' : '600',
                    }
                  ]}>
                    {industry.label}
                  </Text>
                  
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Check size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {formData.industry.length > 0 && (
          <View style={styles.selectedCategoriesInfo}>
            <Text style={styles.selectedCategoriesText}>
              {formData.industry.length} {formData.industry.length === 1 ? 'industry' : 'industries'} selected
            </Text>
          </View>
        )}

        {showOtherInput && (
          <View style={styles.otherInputContainer}>
            <LinearGradient
              colors={['#F8F6FF', '#FFFFFF']}
              style={styles.otherInputGradient}
            >
              <View style={styles.otherInputWrapper}>
                <Plus size={20} color="#A593E0" style={styles.otherInputIcon} />
                <TextInput
                  style={styles.otherInput}
                  placeholder="Please specify your industry"
                  placeholderTextColor="#A593E0"
                  value={formData.otherIndustry}
                  onChangeText={(value) => handleInputChange('otherIndustry', value)}
                />
              </View>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );

  // Step 2: Contact Details
  const renderContactDetails = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <User size={20} color="#A593E0" />
          </View>
          <Text style={styles.cardTitle}>Contact Information</Text>
        </View>
        
        <View style={styles.formGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Owner/Manager Name *</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Enter owner or manager name"
              placeholderTextColor="#888"
              value={formData.ownerName}
              onChangeText={(value) => handleInputChange('ownerName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputWithIcon}>
              <Mail size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput
                style={[styles.modernInput, { paddingLeft: 40 }]}
                placeholder="Enter email address"
                placeholderTextColor="#888"
                value={formData.ownerEmail}
                onChangeText={(value) => handleInputChange('ownerEmail', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.inputWithIcon}>
              <Phone size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput
                style={[styles.modernInput, { paddingLeft: 40 }]}
                placeholder="Enter phone number"
                placeholderTextColor="#888"
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alternative Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Phone size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput
                style={[styles.modernInput, { paddingLeft: 40 }]}
                placeholder="Enter alternative phone number"
                placeholderTextColor="#888"
                value={formData.alternativePhone}
                onChangeText={(value) => handleInputChange('alternativePhone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website/Social Media</Text>
            <View style={styles.inputWithIcon}>
              <Globe size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput 
                style={[styles.modernInput, { paddingLeft: 40 }]}
                placeholder="Enter website or social media URL"
                placeholderTextColor="#888"
                value={formData.website}
                onChangeText={(value) => handleInputChange('website', value)}
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Step 3: Address Info
  const renderAddressInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <MapPin size={20} color="#A593E0" />
          </View>
          <Text style={styles.cardTitle}>Business Address</Text>
        </View>
        
        <View style={styles.formGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Complete Business Address *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput
                style={[styles.modernInput, { paddingLeft: 40, height: 80 }]}
                placeholder="Enter complete business address"
                placeholderTextColor="#888"
                value={formData.businessAddress}
                onChangeText={(value) => handleInputChange('businessAddress', value)}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PIN Code *</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Enter 6-digit PIN code"
              placeholderTextColor="#888"
              value={formData.postalCode}
              onChangeText={handlePincodeChange}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.modernInput}
                placeholder="City (auto-filled)"
                placeholderTextColor="#888"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.modernInput}
                placeholder="State (auto-filled)"
                placeholderTextColor="#888"
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Country</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Country"
              placeholderTextColor="#888"
              value={formData.country}
              onChangeText={(value) => handleInputChange('country', value)}
            />
          </View>

          <TouchableOpacity style={styles.mapButton} onPress={() => setShowMapModal(true)}>
            <LinearGradient
              colors={['#A593E0', '#5F4B8B']}
              style={styles.mapButtonGradient}
            >
              <Map size={20} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Pin Location on Map</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Step 4: Financial Info
  const renderFinancialInfo = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <DollarSign size={20} color="#A593E0" />
          </View>
          <Text style={styles.cardTitle}>Financial Information</Text>
          <Text style={styles.cardSubtitle}>(Optional)</Text>
        </View>
        
        <View style={styles.formGrid}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Annual Revenue Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
              {revenueRanges.map(range => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.optionChip,
                    formData.annualRevenue === range.value && styles.optionChipSelected
                  ]}
                  onPress={() => handleInputChange('annualRevenue', range.value)}
                >
                  <Text style={[
                    styles.optionChipText,
                    formData.annualRevenue === range.value && styles.optionChipTextSelected
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Employees</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
              {employeeRanges.map(range => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.optionChip,
                    formData.numberOfEmployees === range.value && styles.optionChipSelected
                  ]}
                  onPress={() => handleInputChange('numberOfEmployees', range.value)}
                >
                  <Text style={[
                    styles.optionChipText,
                    formData.numberOfEmployees === range.value && styles.optionChipTextSelected
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Years in Business</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={18} color="#A593E0" style={styles.inputIcon} />
              <TextInput
                style={[styles.modernInput, { paddingLeft: 40 }]}
                placeholder="How many years have you been in business?"
                placeholderTextColor="#888"
                value={formData.yearsInBusiness}
                onChangeText={(value) => handleInputChange('yearsInBusiness', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bank Account Number</Text>
            <TextInput
              style={styles.modernInput}
              placeholder="Enter bank account number for verification"
              placeholderTextColor="#888"
              value={formData.bankAccountNumber}
              onChangeText={(value) => handleInputChange('bankAccountNumber', value)}
              keyboardType="numeric"
              secureTextEntry
            />
            <Text style={styles.helperText}>This helps us verify your business legitimacy</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Step 5: Documents
  const renderDocuments = () => {
    const docReqs = isDocumentRequired();
    
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrapper}>
              <FileText size={20} color="#A593E0" />
            </View>
            <Text style={styles.cardTitle}>Required Documents</Text>
          </View>
          
          <View style={styles.uploadContainer}>
            {/* PAN Document - Required */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadSectionTitle}>PAN Card * (Required)</Text>
              <TouchableOpacity
                style={[styles.uploadButton, formData.panDocument && styles.uploadButtonUploaded]}
                onPress={() => handleDocumentUpload('panDocument')}
              >
                {formData.panDocument ? (
                  <View style={styles.uploadedContent}>
                    <Image source={{ uri: formData.panDocument }} style={styles.uploadedImage} />
                    <View style={styles.uploadedOverlay}>
                      <Check size={24} color="#4CAF50" />
                      <Text style={styles.uploadedText}>PAN Card Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <View style={styles.uploadIconWrapper}>
                      <FileText size={24} color="#A593E0" />
                    </View>
                    <Text style={styles.uploadTitle}>Upload PAN Card</Text>
                    <Text style={styles.uploadSubtitle}>Drag & drop or tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Shop Image - Required */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadSectionTitle}>Business Photo * (Required)</Text>
              <TouchableOpacity
                style={[styles.uploadButton, formData.shopImage && styles.uploadButtonUploaded]}
                onPress={() => handleDocumentUpload('shopImage')}
              >
                {formData.shopImage ? (
                  <View style={styles.uploadedContent}>
                    <Image source={{ uri: formData.shopImage }} style={styles.uploadedImage} />
                    <View style={styles.uploadedOverlay}>
                      <Check size={24} color="#4CAF50" />
                      <Text style={styles.uploadedText}>Business Photo Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <View style={styles.uploadIconWrapper}>
                      <Camera size={24} color="#A593E0" />
                    </View>
                    <Text style={styles.uploadTitle}>Business Photo</Text>
                    <Text style={styles.uploadSubtitle}>Shop/Office exterior or interior</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* GST Document - Optional */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadSectionTitle}>GST Certificate (Optional)</Text>
              <TouchableOpacity
                style={[styles.uploadButton, formData.gstDocument && styles.uploadButtonUploaded]}
                onPress={() => handleDocumentUpload('gstDocument')}
              >
                {formData.gstDocument ? (
                  <View style={styles.uploadedContent}>
                    <Image source={{ uri: formData.gstDocument }} style={styles.uploadedImage} />
                    <View style={styles.uploadedOverlay}>
                      <Check size={24} color="#4CAF50" />
                      <Text style={styles.uploadedText}>GST Certificate Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <View style={styles.uploadIconWrapper}>
                      <Upload size={24} color="#A593E0" />
                    </View>
                    <Text style={styles.uploadTitle}>GST Certificate</Text>
                    <Text style={styles.uploadSubtitle}>Drag & drop or tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* FSSAI Certificate - Required if food industry */}
            {docReqs.fssaiRequired && (
              <View style={styles.uploadSection}>
                <Text style={styles.uploadSectionTitle}>FSSAI Certificate * (Required for Food Business)</Text>
                <TouchableOpacity
                  style={[styles.uploadButton, formData.fssaiCertificate && styles.uploadButtonUploaded]}
                  onPress={() => handleDocumentUpload('fssaiCertificate')}
                >
                  {formData.fssaiCertificate ? (
                    <View style={styles.uploadedContent}>
                      <Image source={{ uri: formData.fssaiCertificate }} style={styles.uploadedImage} />
                      <View style={styles.uploadedOverlay}>
                        <Check size={24} color="#4CAF50" />
                        <Text style={styles.uploadedText}>FSSAI Certificate Uploaded</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.uploadContent}>
                      <View style={styles.uploadIconWrapper}>
                        <Utensils size={24} color="#FF6B6B" />
                      </View>
                      <Text style={styles.uploadTitle}>FSSAI Certificate</Text>
                      <Text style={styles.uploadSubtitle}>Required for food-related business</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.documentNote}>
            <Text style={styles.documentNoteText}>
              💡 Tip: Clear, well-lit photos help speed up the verification process. You can drag and drop files or tap to browse.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Step 6: Review
  const renderReview = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrapper}>
            <Eye size={20} color="#A593E0" />
          </View>
          <Text style={styles.cardTitle}>Review Your Information</Text>
        </View>
        
        <ScrollView style={styles.reviewContainer}>
          {/* Business Info Summary */}
          <TouchableOpacity 
            style={styles.reviewSection}
            onPress={() => toggleSection('business')}
          >
            <View style={styles.reviewSectionHeader}>
              <Text style={styles.reviewSectionTitle}>Business Information</Text>
              <ChevronRight 
                size={20} 
                color="#666" 
                style={[
                  styles.chevron,
                  expandedSections.business && styles.chevronRotated
                ]} 
              />
            </View>
            {expandedSections.business && (
              <View style={styles.reviewSectionContent}>
                <Text style={styles.reviewItem}>Name: {formData.businessName}</Text>
                <Text style={styles.reviewItem}>Type: {businessTypes.find(t => t.value === formData.businessType)?.label}</Text>
                <Text style={styles.reviewItem}>GST: {formData.registrationNumber}</Text>
                <Text style={styles.reviewItem}>Industries: {formData.industry.length} selected</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Contact Summary */}
          <TouchableOpacity 
            style={styles.reviewSection}
            onPress={() => toggleSection('contact')}
          >
            <View style={styles.reviewSectionHeader}>
              <Text style={styles.reviewSectionTitle}>Contact Details</Text>
              <ChevronRight 
                size={20} 
                color="#666" 
                style={[
                  styles.chevron,
                  expandedSections.contact && styles.chevronRotated
                ]} 
              />
            </View>
            {expandedSections.contact && (
              <View style={styles.reviewSectionContent}>
                <Text style={styles.reviewItem}>Owner: {formData.ownerName}</Text>
                <Text style={styles.reviewItem}>Email: {formData.ownerEmail}</Text>
                <Text style={styles.reviewItem}>Phone: {formData.phoneNumber}</Text>
                {formData.website && <Text style={styles.reviewItem}>Website: {formData.website}</Text>}
              </View>
            )}
          </TouchableOpacity>

          {/* Address Summary */}
          <TouchableOpacity 
            style={styles.reviewSection}
            onPress={() => toggleSection('address')}
          >
            <View style={styles.reviewSectionHeader}>
              <Text style={styles.reviewSectionTitle}>Address Information</Text>
              <ChevronRight 
                size={20} 
                color="#666" 
                style={[
                  styles.chevron,
                  expandedSections.address && styles.chevronRotated
                ]} 
              />
            </View>
            {expandedSections.address && (
              <View style={styles.reviewSectionContent}>
                <Text style={styles.reviewItem}>Address: {formData.businessAddress}</Text>
                <Text style={styles.reviewItem}>City: {formData.city}</Text>
                <Text style={styles.reviewItem}>State: {formData.state}</Text>
                <Text style={styles.reviewItem}>PIN: {formData.postalCode}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Financial Summary */}
          <TouchableOpacity 
            style={styles.reviewSection}
            onPress={() => toggleSection('financial')}
          >
            <View style={styles.reviewSectionHeader}>
              <Text style={styles.reviewSectionTitle}>Financial Information</Text>
              <ChevronRight 
                size={20} 
                color="#666" 
                style={[
                  styles.chevron,
                  expandedSections.financial && styles.chevronRotated
                ]} 
              />
            </View>
            {expandedSections.financial && (
              <View style={styles.reviewSectionContent}>
                <Text style={styles.reviewItem}>Revenue: {formData.annualRevenue ? revenueRanges.find(r => r.value === formData.annualRevenue)?.label : 'Not specified'}</Text>
                <Text style={styles.reviewItem}>Employees: {formData.numberOfEmployees ? employeeRanges.find(e => e.value === formData.numberOfEmployees)?.label : 'Not specified'}</Text>
                <Text style={styles.reviewItem}>Years in Business: {formData.yearsInBusiness || 'Not specified'}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Documents Summary */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Documents Uploaded</Text>
            <View style={styles.reviewSectionContent}>
              <Text style={[styles.reviewItem, formData.panDocument ? styles.documentUploaded : styles.documentMissing]}>
                {formData.panDocument ? '✓ PAN Card' : '✗ PAN Card (Required)'}
              </Text>
              <Text style={[styles.reviewItem, formData.shopImage ? styles.documentUploaded : styles.documentMissing]}>
                {formData.shopImage ? '✓ Business Photo' : '✗ Business Photo (Required)'}
              </Text>
              <Text style={[styles.reviewItem, formData.gstDocument ? styles.documentUploaded : styles.documentOptional]}>
                {formData.gstDocument ? '✓ GST Certificate' : '- GST Certificate (Optional)'}
              </Text>
              {isDocumentRequired().fssaiRequired && (
                <Text style={[styles.reviewItem, formData.fssaiCertificate ? styles.documentUploaded : styles.documentMissing]}>
                  {formData.fssaiCertificate ? '✓ FSSAI Certificate' : '✗ FSSAI Certificate (Required)'}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.termsCheckbox}
            onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
          >
            <View style={[styles.checkbox, formData.termsAccepted && styles.checkboxChecked]}>
              {formData.termsAccepted && <Check size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <TouchableOpacity onPress={navigateToTerms}>
                <Text style={styles.termsLink}>Terms & Conditions</Text>
              </TouchableOpacity>
              {' '}and{' '}
              <TouchableOpacity onPress={navigateToTerms}>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Navigation Buttons
  const renderNavigationButtons = () => (
    <View style={styles.navigationContainer}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={styles.previousButton}
          onPress={handlePrevious}
        >
          <ArrowLeft size={20} color="#A593E0" />
          <Text style={styles.previousButtonText}>Previous</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.navigationSpacer} />
      
      {currentStep < 6 ? (
        <TouchableOpacity
          style={styles.nextContainer}
          onPress={handleNext}
        >
          <LinearGradient
            colors={['#A593E0', '#5F4B8B']}
            style={styles.nextButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 5 ? 'Review' : 'Next'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.submitContainer}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.submitButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitText}>Submit for Verification</Text>
            <Check size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#A593E0', '#5F4B8B']} 
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <LinearGradient 
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} 
                style={styles.headerIcon}
              >
                <Building2 size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Business Verification</Text>
            <Text style={styles.subtitle}>Complete 6-step verification process</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Progress */}
        {renderStepProgress()}

        {/* Content */}
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>

        {/* Navigation */}
        {renderNavigationButtons()}
      </LinearGradient>

      {/* Map Modal */}
      {renderMapModal()}

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
    backgroundColor: '#000000',
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Progress Bar
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  
  // Step Progress
  stepProgressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    marginBottom: 8,
  },
  stepProgressContent: {
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  stepItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepItemCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepIconActive: {
    backgroundColor: '#A593E0',
  },
  stepIconCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepTextCompleted: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Content
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  formGrid: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  modernInput: {
    height: 52,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 17,
    zIndex: 1,
  },
  gstInputContainer: {
    position: 'relative',
  },
  gstStatusIcon: {
    position: 'absolute',
    right: 16,
    top: 17,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 6,
    fontWeight: '500',
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 6,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Dropdown
  modernDropdown: {
    height: 52,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  placeholderText: {
    color: '#888',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },

  // Options
  optionsScroll: {
    marginTop: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionChipSelected: {
    backgroundColor: '#A593E0',
    borderColor: '#A593E0',
  },
  optionChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Industries
  industryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  industryItem: {
    width: isTablet ? '23%' : '30%',
  },
  industryButton: {
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  selectedGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  industryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#A593E0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  industryText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 11,
    paddingHorizontal: 2,
    zIndex: 2,
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoriesInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  selectedCategoriesText: {
    fontSize: 14,
    color: '#A593E0',
    fontWeight: '600',
  },
  otherInputContainer: {
    marginTop: 16,
  },
  otherInputGradient: {
    borderRadius: 12,
    padding: 2,
  },
  otherInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  otherInputIcon: {
    marginRight: 12,
  },
  otherInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  // Map
  mapButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  mapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapModalContent: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A593E0',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
  },
  mapActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  mapResetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
  },
  mapResetText: {
    color: '#A593E0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mapConfirmButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#A593E0',
    borderRadius: 8,
  },
  mapConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Documents
  uploadContainer: {
    gap: 16,
  },
  uploadSection: {
    marginBottom: 8,
  },
  uploadSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  uploadButton: {
    height: 120,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadButtonUploaded: {
    borderStyle: 'solid',
    borderColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  uploadedContent: {
    flex: 1,
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  uploadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  documentNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
  },
  documentNoteText: {
    fontSize: 12,
    color: '#6B46C1',
    textAlign: 'center',
  },

  // Review
  reviewContainer: {
    maxHeight: 300,
  },
  reviewSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
  },
  reviewSectionContent: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  reviewItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  documentUploaded: {
    color: '#4CAF50',
  },
  documentMissing: {
    color: '#F44336',
  },
  documentOptional: {
    color: '#888',
  },
  termsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#A593E0',
    borderColor: '#A593E0',
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#A593E0',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // Navigation
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(165, 147, 224, 0.1)',
  },
  previousButtonText: {
    color: '#A593E0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigationSpacer: {
    flex: 1,
  },
  nextContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#A593E0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  submitContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
});