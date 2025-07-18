import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';

export default function ClaimOverlay({ 
  claimedCount: initialClaimedCount,
  isClaimed: initialIsClaimed,
  isClaimProcessing: initialIsClaimProcessing,
  onClaim,
  claimAnimation,
  postId,
  // New prop to trigger scan completion from parent
  onScanCompleted,
  scanCompleted: propScanCompleted = false
}) {
  // Local state management for claim functionality
  const [claimedCount, setClaimedCount] = useState(initialClaimedCount || Math.floor(Math.random() * 20) + 10);
  const [isClaimed, setIsClaimed] = useState(initialIsClaimed || false);
  const [isClaimProcessing, setIsClaimProcessing] = useState(initialIsClaimProcessing || false);
  const [scanCompleted, setScanCompleted] = useState(propScanCompleted);

  // Listen for scan completion from parent
  useEffect(() => {
    if (propScanCompleted && !scanCompleted) {
      setScanCompleted(true);
    }
  }, [propScanCompleted, scanCompleted]);

  // Handle claim process
  const handleClaim = async () => {
    // Prevent re-scanning if already completed
    if (scanCompleted || isClaimProcessing) return;

    setIsClaimProcessing(true);

    try {
      // Navigate to scanner
      onClaim?.(postId, { type: 'navigate_to_scanner' });
      
      // Update claim count and mark as claimed (but not scan completed yet)
      setClaimedCount((prev) => prev + 1);
      setIsClaimed(true);
      
    } catch (error) {
      console.log('Claim error:', error);
    }

    setIsClaimProcessing(false);
  };

  // Function to be called when scan is actually completed
  const handleScanCompleted = () => {
    setScanCompleted(true);
  };

  // Demo: Simulate scan completion after claim (remove this in production)
  useEffect(() => {
    if (isClaimed && !scanCompleted && !isClaimProcessing) {
      // Simulate scan completion after 3 seconds for demo
      const timer = setTimeout(() => {
        setScanCompleted(true);
        
        // Call parent callback when scan is completed
        onClaim?.(postId, { 
          success: true, 
          type: 'scan_completed',
          scanCompleted: true
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isClaimed, scanCompleted, isClaimProcessing]);

  return (
    <View style={styles.claimOverlay}>
      <Animated.View style={{ transform: [{ scale: claimAnimation }] }}>
        <TouchableOpacity 
          style={[
            styles.claimButton,
            isClaimed && styles.claimedButton,
            isClaimProcessing && styles.processingButton,
            scanCompleted && styles.completedButton
          ]} 
          onPress={handleClaim}
          disabled={scanCompleted || isClaimProcessing}
        >
          <View style={styles.claimContent}>
            <View style={styles.claimLeft}>
              <View style={styles.claimBadge}>
                <Text style={styles.claimBadgeText}>{claimedCount}</Text>
              </View>
              <Text style={styles.claimText}>
                {isClaimProcessing ? 'Processing...' : 
                 scanCompleted ? 'Completed!' :
                 isClaimed ? 'Claimed!' : 'Claim'}
              </Text>
            </View>
            <View style={styles.claimRight}>
              <ChevronRight size={25} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  claimOverlay: {
    position: 'absolute',
    bottom: 0.1,
  },
  
  claimButton: {
    backgroundColor: '#A593E0',
    paddingHorizontal: 23,
    paddingVertical: 11,
    minWidth: "100%",
  },
  
  claimedButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  
  processingButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  completedButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  
  claimContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  claimLeft: {
    flex: 1,
  },
  
  claimBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 2,
  },
  
  claimBadgeText: {
    position: "absolute",
    top: -10,
    left: -10,
    backgroundColor: "red",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 50,
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  claimText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  claimRight: {
    marginTop: 1,
    marginLeft: 8,
  },
});