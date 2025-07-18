import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PaymentPage = ({ visible, onClose, onPaymentSuccess, storyData, amount = '₹99', onWalletUpdate }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [upiId, setUpiId] = useState('');
  const [walletPoints, setWalletPoints] = useState(0);

  // Load wallet points from storage (in real app, this would come from backend/local storage)
  useEffect(() => {
    // Simulate loading wallet points from storage
    const loadWalletPoints = async () => {
      try {
        // In a real app, you would fetch from AsyncStorage or your backend
        const savedPoints = 0; // Default starting points
        setWalletPoints(savedPoints);
      } catch (error) {
        console.error('Error loading wallet points:', error);
      }
    };

    if (visible) {
      loadWalletPoints();
    }
  }, [visible]);

  const calculatePointsToAdd = (amount) => {
    // Convert amount to number (removing ₹ symbol)
    const numericAmount = parseInt(amount.replace('₹', ''));
    // Add 1 point for every 1 rupee spent
    return numericAmount;
  };

  const handlePayment = async () => {
    // Validation based on payment method
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        Alert.alert('Error', 'Please enter your UPI ID');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate points to add
      const pointsToAdd = calculatePointsToAdd(amount);
      const newWalletPoints = walletPoints + pointsToAdd;
      
      // Update wallet points
      setWalletPoints(newWalletPoints);
      
      // In a real app, you would save to AsyncStorage or send to backend
      // await AsyncStorage.setItem('walletPoints', newWalletPoints.toString());
      
      // Notify parent component about wallet update
      if (onWalletUpdate) {
        onWalletUpdate(newWalletPoints);
      }
      
      Alert.alert(
        'Payment Successful!',
        `Your payment of ${amount} has been processed successfully.\n\n✨ ${pointsToAdd} points have been added to your wallet!\n\nWallet Balance: ${newWalletPoints} points`,
        [
          {
            text: 'OK',
            onPress: () => {
              onPaymentSuccess();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return match;
    }
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + (cleaned.length > 2 ? '/' + cleaned.substring(2, 4) : '');
    }
    return cleaned;
  };

  const WalletInfo = () => (
    <View style={styles.walletContainer}>
      <View style={styles.walletHeader}>
        <Icon name="wallet" size={20} color="#9051c3" />
        <Text style={styles.walletTitle}>Wallet Balance</Text>
      </View>
      <Text style={styles.walletBalance}>{walletPoints} points</Text>
      <Text style={styles.walletReward}>
        +{calculatePointsToAdd(amount)} points will be added after payment
      </Text>
    </View>
  );

  const PaymentMethodSelector = () => (
    <View style={styles.paymentMethodContainer}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            paymentMethod === 'card' && styles.selectedPaymentMethod,
          ]}
          onPress={() => setPaymentMethod('card')}
          activeOpacity={0.8}
        >
          <Icon name="credit-card" size={28} color={paymentMethod === 'card' ? '#9051c3' : '#666'} />
          <Text style={[styles.paymentMethodText, paymentMethod === 'card' && styles.selectedPaymentMethodText]}>
            Credit/Debit Card
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            paymentMethod === 'upi' && styles.selectedPaymentMethod,
          ]}
          onPress={() => setPaymentMethod('upi')}
          activeOpacity={0.8}
        >
          <Icon name="account-cash" size={28} color={paymentMethod === 'upi' ? '#9051c3' : '#666'} />
          <Text style={[styles.paymentMethodText, paymentMethod === 'upi' && styles.selectedPaymentMethodText]}>
            UPI
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentMethodCard,
            paymentMethod === 'paypal' && styles.selectedPaymentMethod,
          ]}
          onPress={() => setPaymentMethod('paypal')}
          activeOpacity={0.8}
        >
          <Icon name="paypal" size={28} color={paymentMethod === 'paypal' ? '#9051c3' : '#666'} />
          <Text style={[styles.paymentMethodText, paymentMethod === 'paypal' && styles.selectedPaymentMethodText]}>
            PayPal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CardDetailsForm = () => (
    <View style={styles.cardDetailsContainer}>
      <Text style={styles.sectionTitle}>Card Details</Text>
      
      <View style={styles.cardForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number}
            onChangeText={(text) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(text) }))}
            keyboardType="numeric"
            maxLength={19}
          />
        </View>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChangeText={(text) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(text) }))}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.cardInput}
              placeholder="123"
              value={cardDetails.cvv}
              onChangeText={(text) => setCardDetails(prev => ({ ...prev, cvv: text.replace(/\D/g, '') }))}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="John Doe"
            value={cardDetails.name}
            onChangeText={(text) => setCardDetails(prev => ({ ...prev, name: text }))}
            autoCapitalize="words"
          />
        </View>
      </View>
    </View>
  );

  const UPIForm = () => (
    <View style={styles.cardDetailsContainer}>
      <Text style={styles.sectionTitle}>UPI Details</Text>
      
      <View style={styles.cardForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>UPI ID</Text>
          <TextInput
            style={styles.cardInput}
            placeholder="yourname@paytm"
            value={upiId}
            onChangeText={setUpiId}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.upiApps}>
          <Text style={styles.inputLabel}>Quick UPI Apps</Text>
          <View style={styles.upiAppsList}>
            <TouchableOpacity style={styles.upiApp} onPress={() => setUpiId('yourname@paytm')}>
              <Text style={styles.upiAppText}>Paytm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.upiApp} onPress={() => setUpiId('yourname@okaxis')}>
              <Text style={styles.upiAppText}>PhonePe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.upiApp} onPress={() => setUpiId('yourname@upi')}>
              <Text style={styles.upiAppText}>GPay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const PayPalForm = () => (
    <View style={styles.cardDetailsContainer}>
      <Text style={styles.sectionTitle}>PayPal Payment</Text>
      
      <View style={styles.cardForm}>
        <View style={styles.paypalInfo}>
          <Icon name="paypal" size={40} color="#0070ba" />
          <Text style={styles.paypalText}>
            You will be redirected to PayPal to complete your payment securely.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.8}>
              <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Payment</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              bounces={true}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled"
              alwaysBounceVertical={true}
            >
              {/* Story Preview */}
              {storyData && (
                <View style={styles.storyPreview}>
                  <Text style={styles.previewTitle}>Story Preview</Text>
                  <View style={styles.previewCard}>
                    <Image source={{ uri: storyData.imageUri }} style={styles.previewImage} />
                    <Text style={styles.previewCategory}>{storyData.category}</Text>
                  </View>
                </View>
              )}

              {/* Wallet Info */}
              <WalletInfo />

              {/* Payment Amount */}
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Amount to Pay</Text>
                <Text style={styles.amountValue}>{amount}</Text>
              </View>

              {/* Payment Method */}
              <PaymentMethodSelector />

              {/* Payment Forms */}
              {paymentMethod === 'card' && <CardDetailsForm />}
              {paymentMethod === 'upi' && <UPIForm />}
              {paymentMethod === 'paypal' && <PayPalForm />}

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Icon name="shield-check" size={20} color="#28a745" />
                <Text style={styles.securityText}>
                  Your payment information is secure and encrypted
                </Text>
              </View>
            </ScrollView>

            {/* Fixed Bottom Actions */}
            <View style={styles.bottomActions}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>{amount}</Text>
              </View>
              
              <TouchableOpacity
                style={[styles.payButton, isProcessing && styles.disabledButton]}
                onPress={handlePayment}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Icon name="credit-card" size={20} color="white" />
                    <Text style={styles.payButtonText}>Pay {amount}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#cba3ea',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140, // Space for fixed bottom actions
  },
  storyPreview: {
    marginBottom: 25,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  previewCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  walletContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#9051c3',
    marginBottom: 5,
  },
  walletReward: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    backgroundColor: '#9051c3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  amountContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#9051c3',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  paymentMethodContainer: {
    marginBottom: 25,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  paymentMethodCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPaymentMethod: {
    borderColor: '#9051c3',
    backgroundColor: '#ffffff',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedPaymentMethodText: {
    color: '#9051c3',
    fontWeight: '700',
  },
  cardDetailsContainer: {
    marginBottom: 25,
  },
  cardForm: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  upiApps: {
    marginTop: 10,
  },
  upiAppsList: {
    flexDirection: 'row',
    gap: 10,
  },
  upiApp: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upiAppText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  paypalInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  paypalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  securityText: {
    fontSize: 14,
    color: '#28a745',
    marginLeft: 10,
    fontWeight: '500',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#9051c3',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9051c3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0.1,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
});

export default PaymentPage;