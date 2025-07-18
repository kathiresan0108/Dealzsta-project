import React, { useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { Heart, Bookmark, Store, Truck } from 'lucide-react-native';
import ClaimOverlay from '@/components/modals/ClaimOverlay';

const { height: screenHeight } = Dimensions.get('window');

export default function PostImageComponent({
  mediaSource,
  mediaHeight = screenHeight * 0.5,
  onDoubleTap,
  onSave,
  isPostSaved,
  saveScale,
  doubleTapScale,
  doubleTapOpacity,
  claimScale,
  postId,
  onClaim,
}) {
  // Randomly determine if post has in-store or delivery
  const deliveryType = useMemo(() => {
    return Math.random() < 0.5 ? 'instore' : 'delivery';
  }, [postId]); // Using postId as dependency to ensure consistency per post

  const getDeliveryConfig = () => {
    if (deliveryType === 'instore') {
      return {
        text: '',

        icon: Store,
      };
    } else {
      return {
        text: '',
        icon: Truck,
      };
    }
  };

  const { text: deliveryText, icon: DeliveryIcon } = getDeliveryConfig();

  return (
    <View style={styles.mediaContainer}>
      <TouchableOpacity
        style={[styles.imageContainer, { height: mediaHeight }]}
        onPressIn={onDoubleTap}
        activeOpacity={1}
      >
       <Image
  source={mediaSource}  // Remove the extra braces and uri
  style={[styles.postImage, { height: mediaHeight }]}
  resizeMode="cover"
/>

        {/* Delivery type indicator in top left corner */}
        <View style={styles.deliveryTypeContainer}>
          <DeliveryIcon size={16} color="#FFFFFF" />
       
        </View>

        {/* Saved icon in top right corner */}
        <TouchableOpacity
          style={styles.savedButtonTopRight}
          onPress={onSave}
        >
          <Animated.View style={{ transform: [{ scale: saveScale }] }}>
            <Bookmark
              size={15}
              color={isPostSaved ? '#FFFFFF' : '#FFFFFF'}
              fill={isPostSaved ? '#FFFFFF' : 'transparent'}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Double tap heart animation */}
        <Animated.View
          style={[
            styles.doubleTapHeart,
            {
              transform: [{ scale: doubleTapScale }],
              opacity: doubleTapOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <Heart size={80} color="#FF3040" fill="#FF3040" />
        </Animated.View>

        {/* Claim overlay for images */}
        <ClaimOverlay
          postId={postId}
          onClaim={onClaim}
          claimAnimation={claimScale}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
  },
  deliveryTypeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius:50,
   backgroundColor:'rgba(0,0,0,0.6)',
  },
  deliveryTypeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  savedButtonTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  doubleTapHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
});