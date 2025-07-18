// utils/sampleData.js - Fixed version with proper categories
import poster1 from '../assets/images/poster1.jpg';
import poster2 from '../assets/images/poster2.jpg';
import poster3 from '../assets/images/poster3.jpg';
import poster4 from '../assets/images/poster4.jpg';
import poster5 from '../assets/images/poster5.jpg';
import poster8 from '../assets/images/poster8.jpg';
import poster9 from '../assets/images/poster9.jpg';
import poster11 from '../assets/images/poster11.jpg';

// Static sample users with follow system
export const sampleUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: true,
    followersCount: 1247,
    followingCount: 892,
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: false,
    followersCount: 892,
    followingCount: 543,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: false,
    followersCount: 2156,
    followingCount: 234,
  },
  {
    id: 4,
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: true,
    followersCount: 3421,
    followingCount: 1678,
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: false,
    followersCount: 567,
    followingCount: 890,
  },
  {
    id: 6,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    followStatus: 'not_following',
    isPrivate: false,
    isVerified: true,
    followersCount: 5432,
    followingCount: 987,
  },
];

// Sample video URLs with fallbacks
const sampleVideos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-store-commercial-41480-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-electronics-store-promo-41481-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-advertisement-41482-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-restaurant-food-commercial-41483-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-retail-shopping-ad-41484-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-beauty-product-showcase-41485-large.mp4'
];

// Fixed sample images array with error handling
export const sampleImages = [
  poster1,
  poster2,
  poster3,
  poster4,
  poster5,
  poster8,
  poster9,
  poster11,
].filter(Boolean); 

// Sample video thumbnails
const videoThumbnails = [
  'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/3964341/pexels-photo-3964341.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
];

// Enhanced static sample posts with error handling
export const samplePosts = [
  {
    id: 1,
    title: '50% Off Designer Handbags',
    description: 'Limited time offer on premium leather handbags. Perfect for everyday use and special occasions.',
    mediaType: 'image',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    location: 'Fashion District, Mumbai',
    timeAgo: '2h',
    shopkm: '1 km',
    likes: 145,
    comments: 23,
    send: 45,
    isLiked: false,
    isSaved: false,
    originalPrice: 2999,
    discountPrice: 1499,
    discount: 50,
    category: 'fashion',
    hashtags: ['#fashion', '#handbags', '#designer', '#sale', '#style'],
    user: sampleUsers[0],
    deliveryType: 'instore',
  },
  {
    id: 2,
    title: 'Fresh Recipe Tutorial',
    description: 'Learn how to make delicious organic smoothies at home. Perfect for a healthy breakfast!',
    mediaType: 'video',
    video: sampleVideos[0],
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    duration: '2:30',
    location: 'Organic Kitchen, Coimbatore',
    timeAgo: '4h',
    shopkm: '2 km',
    likes: 289,
    comments: 45,
    send: 67,
    isLiked: true,
    isSaved: true,
    originalPrice: 500,
    discountPrice: 350,
    discount: 30,
    category: 'food',
    hashtags: ['#food', '#recipe', '#healthy', '#smoothies', '#organic'],
    user: sampleUsers[1],
    deliveryType: 'delivery',
  },
  {
    id: 3,
    title: 'Smartphone Photography Tips',
    description: 'Professional photography techniques using just your smartphone. Includes editing tips and tricks.',
    mediaType: 'video',
    video: sampleVideos[1],
    thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    duration: '5:45',
    location: 'Tech Hub, Chennai',
    timeAgo: '6h',
    shopkm: '3 km',
    likes: 467,
    comments: 78,
    send: 89,
    isLiked: false,
    isSaved: false,
    originalPrice: 1500,
    discountPrice: 999,
    discount: 33,
    category: 'electronics',
    hashtags: ['#photography', '#smartphone', '#tech', '#tips', '#mobile'],
    user: sampleUsers[2],
    deliveryType: 'delivery',
  },
];

// Sample content with proper structure
const sampleContent = {
  fashion: [
    { 
      title: 'Trendy Summer Collection 2024', 
      description: 'Discover the hottest fashion trends for the summer season with our exclusive collection.',
      hashtags: ['#fashion', '#summer', '#trendy', '#style', '#collection']
    },
    { 
      title: 'Vintage Accessories Sale', 
      description: 'Step into the past with our curated vintage jewelry collection.',
      hashtags: ['#vintage', '#accessories', '#jewelry', '#retro', '#fashion']
    },
    { 
      title: 'Designer Ethnic Wear', 
      description: 'Elegant traditional outfits for special occasions.',
      hashtags: ['#ethnic', '#traditional', '#designer', '#fashion', '#wear']
    },
    { 
      title: 'Casual Streetwear Collection', 
      description: 'Urban fashion meets comfort in our latest streetwear line.',
      hashtags: ['#streetwear', '#casual', '#urban', '#fashion', '#style']
    },
  ],
  food: [
    { 
      title: 'Healthy Meal Prep Guide', 
      description: 'Transform your eating habits with our comprehensive meal prep program.',
      hashtags: ['#mealprep', '#healthy', '#cooking', '#nutrition', '#wellness']
    },
    { 
      title: 'Street Food Adventure', 
      description: 'Embark on a culinary journey through authentic street food.',
      hashtags: ['#streetfood', '#local', '#foodie', '#culinary', '#authentic']
    },
    { 
      title: 'Homemade Desserts', 
      description: 'Sweet treats made with love and natural ingredients.',
      hashtags: ['#desserts', '#homemade', '#sweet', '#baking', '#treats']
    },
    { 
      title: 'Regional Cuisine Special', 
      description: 'Explore the rich flavors of traditional regional dishes.',
      hashtags: ['#regional', '#traditional', '#cuisine', '#flavors', '#food']
    },
  ],
  electronics: [
    { 
      title: 'Smartphone Guide 2024', 
      description: 'Make informed decisions with our detailed smartphone analysis.',
      hashtags: ['#smartphone', '#tech', '#review', '#mobile', '#gadgets']
    },
    { 
      title: 'Gaming Setup Guide', 
      description: 'Create your dream gaming setup with our comprehensive guide.',
      hashtags: ['#gaming', '#pc', '#setup', '#tech', '#build']
    },
    { 
      title: 'Smart Home Devices', 
      description: 'Transform your home into a smart living space.',
      hashtags: ['#smarthome', '#iot', '#automation', '#tech', '#devices']
    },
    { 
      title: 'Latest Gadget Reviews', 
      description: 'Honest reviews of the newest tech gadgets in the market.',
      hashtags: ['#gadgets', '#reviews', '#tech', '#latest', '#electronics']
    },
  ],
  home: [
    { 
      title: 'Interior Design Trends', 
      description: 'Stay ahead with the latest interior design trends.',
      hashtags: ['#interiordesign', '#homedecor', '#design', '#home', '#style']
    },
    { 
      title: 'DIY Home Projects', 
      description: 'Upgrade your home with budget-friendly DIY projects.',
      hashtags: ['#diy', '#homeimprovement', '#renovation', '#crafts', '#home']
    },
    { 
      title: 'Garden & Outdoor Decor', 
      description: 'Create beautiful outdoor spaces with our decor ideas.',
      hashtags: ['#garden', '#outdoor', '#decor', '#landscaping', '#home']
    },
    { 
      title: 'Kitchen Organization', 
      description: 'Maximize your kitchen space with smart organization solutions.',
      hashtags: ['#kitchen', '#organization', '#storage', '#home', '#efficiency']
    },
  ],
  health: [
    { 
      title: 'Fitness for Beginners', 
      description: 'Start your fitness journey with our beginner-friendly program.',
      hashtags: ['#fitness', '#workout', '#health', '#beginner', '#exercise']
    },
    { 
      title: 'Mental Health Guide', 
      description: 'Prioritize your mental health with evidence-based strategies.',
      hashtags: ['#mentalhealth', '#wellness', '#selfcare', '#mindfulness', '#health']
    },
    { 
      title: 'Yoga & Meditation', 
      description: 'Find inner peace with our yoga and meditation practices.',
      hashtags: ['#yoga', '#meditation', '#mindfulness', '#wellness', '#health']
    },
    { 
      title: 'Nutrition Tips', 
      description: 'Expert advice on maintaining a balanced and healthy diet.',
      hashtags: ['#nutrition', '#diet', '#healthy', '#wellness', '#food']
    },
  ],
  beauty: [
    { 
      title: 'Skincare Routine Guide', 
      description: 'Achieve glowing skin with our step-by-step skincare routine.',
      hashtags: ['#skincare', '#beauty', '#routine', '#glowing', '#healthy']
    },
    { 
      title: 'Makeup Tutorials', 
      description: 'Master the art of makeup with our detailed tutorials.',
      hashtags: ['#makeup', '#tutorial', '#beauty', '#cosmetics', '#style']
    },
    { 
      title: 'Hair Care Tips', 
      description: 'Keep your hair healthy and beautiful with expert care tips.',
      hashtags: ['#haircare', '#beauty', '#healthy', '#hair', '#tips']
    },
    { 
      title: 'Natural Beauty Remedies', 
      description: 'Discover the power of natural ingredients for beauty.',
      hashtags: ['#natural', '#beauty', '#organic', '#remedies', '#skincare']
    },
  ],
  sports: [
    { 
      title: 'Sports Equipment Guide', 
      description: 'Choose the right equipment for your favorite sports.',
      hashtags: ['#sports', '#equipment', '#fitness', '#gear', '#athletics']
    },
    { 
      title: 'Training Tips', 
      description: 'Professional training advice for athletes of all levels.',
      hashtags: ['#training', '#sports', '#fitness', '#athletics', '#performance']
    },
    { 
      title: 'Team Sports Strategies', 
      description: 'Learn winning strategies for popular team sports.',
      hashtags: ['#team', '#sports', '#strategy', '#game', '#competition']
    },
    { 
      title: 'Outdoor Adventure Gear', 
      description: 'Essential gear for your next outdoor adventure.',
      hashtags: ['#outdoor', '#adventure', '#gear', '#sports', '#nature']
    },
  ],
  books: [
    { 
      title: 'Must-Read Books 2024', 
      description: 'Discover this year\'s most compelling books across all genres.',
      hashtags: ['#books', '#reading', '#literature', '#mustread', '#2024']
    },
    { 
      title: 'Book Review Series', 
      description: 'Honest reviews of latest bestsellers and hidden gems.',
      hashtags: ['#bookreview', '#literature', '#reading', '#books', '#review']
    },
    { 
      title: 'Reading Challenge', 
      description: 'Join our reading challenge and discover new authors.',
      hashtags: ['#reading', '#challenge', '#books', '#literature', '#goals']
    },
    { 
      title: 'Author Interviews', 
      description: 'Exclusive interviews with bestselling authors.',
      hashtags: ['#author', '#interview', '#books', '#writing', '#literature']
    },
  ],
  travel: [
    { 
      title: 'Travel Destinations 2024', 
      description: 'Explore the world\'s most beautiful and trending destinations.',
      hashtags: ['#travel', '#destinations', '#wanderlust', '#explore', '#adventure']
    },
    { 
      title: 'Budget Travel Tips', 
      description: 'Travel more while spending less with our money-saving tips.',
      hashtags: ['#budget', '#travel', '#backpacking', '#tips', '#savings']
    },
    { 
      title: 'Local Culture Guide', 
      description: 'Immerse yourself in local cultures and traditions.',
      hashtags: ['#culture', '#local', '#travel', '#traditions', '#explore']
    },
    { 
      title: 'Adventure Travel', 
      description: 'Thrilling adventures for the bold and brave travelers.',
      hashtags: ['#adventure', '#travel', '#extreme', '#outdoors', '#thrill']
    },
  ],
  art: [
    { 
      title: 'Art Techniques Tutorial', 
      description: 'Master various art techniques with step-by-step guidance.',
      hashtags: ['#art', '#tutorial', '#techniques', '#drawing', '#painting']
    },
    { 
      title: 'Digital Art Guide', 
      description: 'Create stunning digital artwork with modern tools.',
      hashtags: ['#digitalart', '#art', '#design', '#creative', '#digital']
    },
    { 
      title: 'Art History Insights', 
      description: 'Explore the rich history of art and famous masterpieces.',
      hashtags: ['#arthistory', '#art', '#culture', '#history', '#masterpieces']
    },
    { 
      title: 'Art Supply Reviews', 
      description: 'Find the best art supplies for your creative projects.',
      hashtags: ['#artsupplies', '#art', '#materials', '#review', '#creative']
    },
  ],
};

// Sample locations with delivery info
const sampleLocations = [
  { name: 'Fashion District, Mumbai', distance: '450 km', deliveryAvailable: true },
  { name: 'Tech Hub, Chennai', distance: '350 km', deliveryAvailable: true },
  { name: 'Art Gallery, Kochi', distance: '190 km', deliveryAvailable: true },
  { name: 'Wellness Center, Bangalore', distance: '210 km', deliveryAvailable: true },
  { name: 'Style Studio, Delhi', distance: '1800 km', deliveryAvailable: true },
  { name: 'Organic Kitchen, Coimbatore', distance: '2 km', deliveryAvailable: true },
  { name: 'Sports Store, Pune', distance: '800 km', deliveryAvailable: true },
  { name: 'Book Cafe, Hyderabad', distance: '400 km', deliveryAvailable: true },
];

// Time and distance options
const timeAgoOptions = ['1h', '2h', '3h', '4h', '6h', '8h', '12h', '1d', '2d', '3d', '1w'];
const shopLocationKm = ['1 km', '2 km', '3 km', '4 km', '7 km', '12 km', '15 km', '20 km'];
const videoDurations = ['1:30', '2:15', '3:45', '5:20', '7:10', '8:30', '10:15', '12:45'];

// Enhanced post generator with delivery types
export const generateSamplePosts = (count = 20, category = 'trending') => {
  const posts = [];
  const categories = Object.keys(sampleContent);
  
  for (let i = 0; i < count; i++) {
    try {
      const postCategory = category === 'trending' 
        ? categories[Math.floor(Math.random() * categories.length)] 
        : category;
      
      const categoryContent = sampleContent[postCategory];
      if (!categoryContent || categoryContent.length === 0) continue;
      
      const isVideo = Math.random() > 0.4;
      const selectedContent = categoryContent[Math.floor(Math.random() * categoryContent.length)];
      const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      
      const originalPrice = Math.floor(Math.random() * 5000) + 500;
      const discountPercentage = Math.floor(Math.random() * 50) + 10;
      const discountPrice = Math.floor(originalPrice * (1 - discountPercentage / 100));
      
      // Determine delivery type based on distance
      const distance = parseFloat(location.distance);
      const deliveryType = distance <= 5 ? 
        (Math.random() > 0.4 ? 'instore' : 'delivery') : 
        'delivery';
      
      const post = {
        id: samplePosts.length + i + 1,
        title: selectedContent.title,
        description: selectedContent.description,
        mediaType: isVideo ? 'video' : 'image',
        location: location.name,
        timeAgo: timeAgoOptions[Math.floor(Math.random() * timeAgoOptions.length)],
        shopkm: location.distance,
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 200) + 10,
        send: Math.floor(Math.random() * 300) + 40,
        isLiked: Math.random() > 0.7,
        isSaved: Math.random() > 0.8,
        originalPrice: originalPrice,
        discountPrice: discountPrice,
        discount: discountPercentage,
        category: postCategory,
        hashtags: selectedContent.hashtags || [],
        user: user,
        deliveryType: deliveryType,
        deliveryAvailable: location.deliveryAvailable,
      };
      
      if (isVideo) {
        post.video = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
        post.thumbnail = videoThumbnails[Math.floor(Math.random() * videoThumbnails.length)];
        post.duration = videoDurations[Math.floor(Math.random() * videoDurations.length)];
      } else {
        post.image = sampleImages.length > 0 
          ? sampleImages[Math.floor(Math.random() * sampleImages.length)]
          : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62';
      }
      
      posts.push(post);
    } catch (error) {
      console.warn(`Error generating post ${i}:`, error);
    }
  }
  
  return posts;
};

// Fixed categories data with unique entries
export const categoriesData = [
  {
    id: 1,
    name: 'Food',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop',
    stories: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
        type: 'food',
        mediaType: 'image',
        user: {
          username: 'foodie_chef',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          isFollowing: false,
          followers: 1250,
          following: 890
        },
        likes: 245,
        timestamp: '2h ago',
        caption: 'Delicious homemade pizza! 🍕'
      }
    ]
  },
  {
    id: 2,
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=100&h=100&fit=crop',
    stories: [
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
        type: 'fashion',
        mediaType: 'image',
        user: {
          username: 'style_queen',
          profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          isFollowing: true,
          followers: 5600,
          following: 1200
        },
        likes: 678,
        timestamp: '1h ago',
        caption: 'Summer vibes ☀️'
      }
    ]
  },
  {
    id: 3,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&h=100&fit=crop',
    stories: [
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=600&fit=crop',
        type: 'electronics',
        mediaType: 'image',
        user: {
          username: 'tech_guru',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          isFollowing: false,
          followers: 3400,
          following: 567
        },
        likes: 892,
        timestamp: '3h ago',
        caption: 'Latest tech review 📱'
      }
    ]
  },
  {
    id: 4,
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
    stories: [
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop',
        type: 'home',
        mediaType: 'image',
        user: {
          username: 'home_designer',
          profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          isFollowing: true,
          followers: 2100,
          following: 445
        },
        likes: 567,
        timestamp: '4h ago',
        caption: 'Modern home decor 🏠'
      }
    ]
  },
  {
    id: 5,
    name: 'Health',
    image: 'https://images.unsplash.com/photo-1571019613914-85d597825dbd?w=100&h=100&fit=crop',
    stories: [
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1571019613914-85d597825dbd?w=400&h=600&fit=crop',
        type: 'health',
        mediaType: 'image',
        user: {
          username: 'fitness_pro',
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
          isFollowing: false,
          followers: 4200,
          following: 789
        },
        likes: 1245,
        timestamp: '5h ago',
        caption: 'Healthy lifestyle tips 💪'
      }
    ]
  },
  {
    id: 6,
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop',
    stories: [
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop',
        type: 'beauty',
        mediaType: 'image',
        user: {
          username: 'beauty_expert',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop',
          isFollowing: true,
          followers: 6700,
          following: 234
        },
        likes: 789,
        timestamp: '6h ago',
        caption: 'Skincare routine ✨'
      }
    ]
  },
  {
    id: 7,
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100&h=100&fit=crop',
    stories: [
      {
        id: 7,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=600&fit=crop',
        type: 'sports',
        mediaType: 'image',
        user: {
          username: 'sports_fan',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          isFollowing: false,
          followers: 3300,
          following: 890
        },
        likes: 456,
        timestamp: '7h ago',
        caption: 'Game day! ⚽'
      }
    ]
  },
{
    id: 8,
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop',
    stories: [
      {
        id: 8,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        type: 'books',
        mediaType: 'image',
        user: {
          username: 'book_lover',
          profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
          isFollowing: true,
          followers: 2800,
          following: 1500
        },
        likes: 324,
        timestamp: '8h ago',
        caption: 'Must-read books 📚'
      }
    ]
  },
  {
    id: 9,
    name: 'Travel',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
    stories: [
      {
        id: 9,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=600&fit=crop',
        type: 'travel',
        mediaType: 'image',
        user: {
          username: 'wanderlust',
          profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
          isFollowing: false,
          followers: 5200,
          following: 678
        },
        likes: 1120,
        timestamp: '9h ago',
        caption: 'Mountain adventures 🏔️'
      }
    ]
  },
  {
    id: 10,
    name: 'Art',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100&h=100&fit=crop',
    stories: [
      {
        id: 10,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
        type: 'art',
        mediaType: 'image',
        user: {
          username: 'artist_studio',
          profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          isFollowing: true,
          followers: 4500,
          following: 234
        },
        likes: 892,
        timestamp: '10h ago',
        caption: 'Creative artwork 🎨'
      }
    ]
  }
];

// Export all data
export default {
  sampleUsers,
  samplePosts,
  sampleImages,
  generateSamplePosts,
  categoriesData,
  sampleContent
};