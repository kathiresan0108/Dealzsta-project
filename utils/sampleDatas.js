// utils/sampleData.js - Complete sample data with Instagram-style follow system

// Static sample users with follow system
export const sampleUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c',
    followStatus: 'not_following', // 'following', 'requested', 'not_following'
    isPrivate: false,
    isVerified: true,
    followersCount: 1247,
    followingCount: 892,
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    followStatus: 'following',
    isPrivate: false,
    isVerified: false,
    followersCount: 892,
    followingCount: 543,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    followStatus: 'requested',
    isPrivate: true,
    isVerified: false,
    followersCount: 2156,
    followingCount: 234,
  },
  {
    id: 4,
    name: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    followStatus: 'following',
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
    isPrivate: true,
    isVerified: false,
    followersCount: 567,
    followingCount: 890,
  },
  {
    id: 6,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    followStatus: 'following',
    isPrivate: false,
    isVerified: true,
    followersCount: 5432,
    followingCount: 987,
  },
];

// Static sample posts
export const samplePosts = [
  {
    id: 1,
    title: '50% Off Designer Handbags',
    description: 'Limited time offer on premium leather handbags. Perfect for everyday use and special occasions.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    location: 'Fashion District, Mumbai',
    timeAgo: '2h',
    likes: 145,
    comments: 23,
    isLiked: false,
    isSaved: false,
    originalPrice: 2999,
    discountPrice: 1499,
    discount: 50,
    category: 'fashion',
  },
  {
    id: 2,
    title: 'Fresh Organic Vegetables',
    description: 'Farm-fresh vegetables delivered to your doorstep. Chemical-free and organic certified.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    location: 'Organic Farm, Coimbatore',
    timeAgo: '4h',
    likes: 89,
    comments: 12,
    isLiked: true,
    isSaved: true,
    originalPrice: 500,
    discountPrice: 350,
    discount: 30,
    category: 'food',
  },
  {
    id: 3,
    title: 'Smartphone Photography Workshop',
    description: 'Learn professional photography techniques using just your smartphone. Includes editing tips and tricks.',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    location: 'Tech Hub, Chennai',
    timeAgo: '6h',
    likes: 267,
    comments: 45,
    isLiked: false,
    isSaved: false,
    originalPrice: 1500,
    discountPrice: 999,
    discount: 33,
    category: 'electronics',
  },
  {
    id: 4,
    title: 'Handmade Pottery Collection',
    description: 'Beautiful handcrafted ceramic pieces made by local artisans. Each piece is unique and tells a story.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    location: 'Art Gallery, Kochi',
    timeAgo: '8h',
    likes: 198,
    comments: 34,
    isLiked: true,
    isSaved: false,
    originalPrice: 800,
    discountPrice: 600,
    discount: 25,
    category: 'home',
  },
  {
    id: 5,
    title: 'Yoga Classes for Beginners',
    description: 'Start your wellness journey with our beginner-friendly yoga sessions. All equipment provided.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    location: 'Wellness Center, Bangalore',
    timeAgo: '12h',
    likes: 156,
    comments: 28,
    isLiked: false,
    isSaved: true,
    originalPrice: 1200,
    discountPrice: 900,
    discount: 25,
    category: 'health',
  },
];

// Dynamic post generator function
export const generateSamplePosts = (count = 20, category = 'trending') => {
  const sampleImages = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  ];

  const sampleAvatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  ];

  const businessNames = [
    'Milano Restaurant', 'TechZone Electronics', 'Bella Fashion', 'FreshMart Grocery',
    'StyleHub Boutique', 'GadgetWorld', 'Cafe Delight', 'SportMax Store',
    'Beauty Palace', 'BookHaven', 'FoodieCorner', 'WearWell Fashion'
  ];

  const locations = [
    'Downtown', 'City Center', 'Mall Road', 'Park Street', 'Main Market',
    'Commercial Complex', 'Shopping District', 'Business Area'
  ];

  const categoryOffers = {
    food: [
      { title: '50% OFF on Pizza', description: 'Get delicious wood-fired pizza at half price! Limited time offer.' },
      { title: 'Buy 1 Get 1 Burger', description: 'Tasty burgers with fresh ingredients. Perfect for lunch!' },
      { title: 'Free Dessert with Meal', description: 'Enjoy complimentary dessert with any main course order.' },
    ],
    fashion: [
      { title: '40% OFF Summer Collection', description: 'Latest trendy clothes for the summer season. Limited stock!' },
      { title: 'Designer Shoes Sale', description: 'Premium quality shoes from top brands at unbeatable prices.' },
      { title: 'Ethnic Wear Festival', description: 'Beautiful traditional outfits for special occasions.' },
    ],
    electronics: [
      { title: 'Smartphone Mega Sale', description: 'Latest smartphones with amazing features at discounted prices.' },
      { title: 'Laptop Clearance Sale', description: 'High-performance laptops for work and gaming. Hurry up!' },
      { title: 'Gadget Combo Offers', description: 'Bundle deals on electronics. Save more when you buy together.' },
    ],
    beauty: [
      { title: 'Spa Package Deal', description: 'Relaxing spa treatments for complete rejuvenation and wellness.' },
      { title: 'Makeup Masterclass', description: 'Learn professional makeup techniques from expert artists.' },
      { title: 'Skincare Routine Set', description: 'Complete skincare products for healthy and glowing skin.' },
    ],
    trending: [
      { title: 'Flash Sale Today Only', description: 'Amazing deals across all categories. Don\'t miss out!' },
      { title: 'Weekend Special Offer', description: 'Extra savings on your favorite items this weekend only.' },
      { title: 'New Store Opening', description: 'Grand opening celebration with exclusive discounts and gifts.' },
    ]
  };

  const posts = [];
  const offers = categoryOffers[category] || categoryOffers.trending;

  for (let i = 0; i < count; i++) {
    const offer = offers[i % offers.length];
    const originalPrice = Math.floor(Math.random() * 5000) + 500;
    const discount = Math.floor(Math.random() * 60) + 20;
    const discountPrice = Math.floor(originalPrice * (100 - discount) / 100);

    posts.push({
      id: `post_${category}_${i}`,
      user: {
        id: `user_${i % 5}`,
        name: businessNames[i % businessNames.length],
        avatar: sampleAvatars[i % sampleAvatars.length],
        verified: Math.random() > 0.3,
      },
      image: sampleImages[i % sampleImages.length],
      title: offer.title,
      description: offer.description,
      location: locations[i % locations.length],
      timeAgo: `${Math.floor(Math.random() * 24) + 1}h`,
      likes: Math.floor(Math.random() * 1000) + 50,
      comments: Math.floor(Math.random() * 100) + 5,
      shares: Math.floor(Math.random() * 50) + 2,
      originalPrice,
      discountPrice,
      discount,
      category,
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.8,
      claimable: true,
      validUntil: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return posts;
};

// Dynamic user generator function
export const generateSampleUsers = (count = 10) => {
  const sampleAvatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  ];

  const names = [
    'Alex Johnson', 'Sarah Wilson', 'Mike Brown', 'Emily Davis', 'Chris Lee',
    'Jessica Miller', 'David Garcia', 'Lisa Anderson', 'Kevin Martinez', 'Amanda Taylor'
  ];

  const followStatuses = ['following', 'requested', 'not_following'];

  const users = [];
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user_${i}`,
      name: names[i % names.length],
      email: `user${i}@example.com`,
      avatar: sampleAvatars[i % sampleAvatars.length],
      followStatus: followStatuses[Math.floor(Math.random() * followStatuses.length)],
      isPrivate: Math.random() > 0.7,
      isVerified: Math.random() > 0.4,
      followersCount: Math.floor(Math.random() * 10000) + 100,
      followingCount: Math.floor(Math.random() * 1000) + 50,
      accountType: Math.random() > 0.7 ? 'business' : 'user',
      posts: Math.floor(Math.random() * 500) + 10,
      bio: 'Living life to the fullest 🌟 | Food lover 🍕 | Travel enthusiast ✈',
      joined: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
};

// Combined function to get all posts (static + generated)
export const getAllPosts = (generatedCount = 20, category = 'trending') => {
  const generatedPosts = generateSamplePosts(generatedCount, category);
  return [...samplePosts, ...generatedPosts];
};

// Combined function to get all users (static + generated)
export const getAllUsers = (generatedCount = 10) => {
  const generatedUsers = generateSampleUsers(generatedCount);
  return [...sampleUsers, ...generatedUsers];
};

// Utility function to get posts by category
export const getPostsByCategory = (category, count = 10) => {
  if (category === 'all') {
    return getAllPosts(count);
  }
  
  const staticCategoryPosts = samplePosts.filter(post => post.category === category);
  const generatedCategoryPosts = generateSamplePosts(count, category);
  
  return [...staticCategoryPosts, ...generatedCategoryPosts];
};

// Utility function to get user by ID
export const getUserById = (userId) => {
  const allUsers = getAllUsers();
  return allUsers.find(user => user.id === userId);
};

// Utility function to get post by ID
export const getPostById = (postId) => {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.id === postId);
};

// Categories configuration
export const categories = [
  { id: 'all', name: 'All', icon: '🏠' },
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'home', name: 'Home', icon: '🏡' },
  { id: 'health', name: 'Health', icon: '🏥' },
];
export const generateSamplePostss = (count = 10) => {
  const names = [
    'kathiresan', 'john_doe', 'jane_doe', 'tech_guru', 'mario123', 'nina_xo',
    'sunny_dev', 'react_master', 'cat_lover', 'game_champ'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    user: {
      name: names[i % names.length],
    },
  }));
};
// utils/sampleData.js

// Category users mapping - each category has its default user
export const categoryUsers = {
  food: {
    username: 'chef_marie',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a41b28?w=100&h=100&fit=crop&crop=face'
  },
  travel: {
    username: 'wanderlust',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  fashion: {
    username: 'style_queen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
  },
  tech: {
    username: 'tech_reviewer',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face'
  }
};

// Categories with stories data
export const initialCategoriesData = {
  food: {
    id: 'food',
    name: 'Food',
    icon: 'food',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    stories: [
      {
        id: 1,
        username: 'chef_marie',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a41b28?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'food',
        segments: [
          {
            id: 1,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=700&fit=crop',
            timestamp: '2h',
            duration: 5000
          },
          {
            id: 2,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=700&fit=crop',
            timestamp: '1h',
            duration: 5000
          }
        ]
      },
      {
        id: 2,
        username: 'food_blogger',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'food',
        segments: [
          {
            id: 3,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=700&fit=crop',
            timestamp: '30m',
            duration: 5000
          }
        ]
      }
    ]
  },
  travel: {
    id: 'travel',
    name: 'Travel',
    icon: 'airplane',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
    stories: [
      {
        id: 4,
        username: 'wanderlust',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'travel',
        segments: [
          {
            id: 5,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
            timestamp: '1h',
            duration: 5000
          }
        ]
      },
      {
        id: 5,
        username: 'travel_addict',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'travel',
        segments: [
          {
            id: 6,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop',
            timestamp: '45m',
            duration: 5000
          }
        ]
      }
    ]
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion',
    icon: 'tshirt-crew',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop',
    stories: [
      {
        id: 6,
        username: 'style_queen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'fashion',
        segments: [
          {
            id: 7,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=700&fit=crop',
            timestamp: '1h',
            duration: 5000
          }
        ]
      },
      {
        id: 7,
        username: 'fashion_guru',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'fashion',
        segments: [
          {
            id: 8,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=700&fit=crop',
            timestamp: '30m',
            duration: 5000
          }
        ]
      }
    ]
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
    stories: [
      {
        id: 8,
        username: 'tech_reviewer',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'tech',
        segments: [
          {
            id: 9,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=700&fit=crop',
            timestamp: '30m',
            duration: 5000
          }
        ]
      },
      {
        id: 9,
        username: 'gadget_master',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face',
        hasNewStory: true,
        category: 'tech',
        segments: [
          {
            id: 10,
            type: 'image',
            content: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=700&fit=crop',
            timestamp: '20m',
            duration: 5000
          }
        ]
      }
    ]
  }
};


// sampleData.js
export const getSampleData = () => {
  return {
    food: {
      id: 'food',
      name: 'Food',
      icon: 'food',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      stories: [
        {
          id: 1,
          username: 'chef_marie',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a41b28?w=100&h=100&fit=crop&crop=face',
          hasNewStory: true,
          category: 'food',
          segments: [
            {
              id: 1,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=700&fit=crop',
              timestamp: '2h',
              duration: 5000
            },
            {
              id: 2,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=700&fit=crop',
              timestamp: '1h',
              duration: 5000
            }
          ]
        },
        {
          id: 2,
          username: 'food_blogger',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          hasNewStory: true,
          category: 'food',
          segments: [
            {
              id: 3,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=700&fit=crop',
              timestamp: '30m',
              duration: 5000
            }
          ]
        }
      ]
    },
    travel: {
      id: 'travel',
      name: 'Travel',
      icon: 'airplane',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
      stories: [
        {
          id: 4,
          username: 'wanderlust',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          hasNewStory: true,
          category: 'travel',
          segments: [
            {
              id: 5,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
              timestamp: '1h',
              duration: 5000
            }
          ]
        }
      ]
    },
    fashion: {
      id: 'fashion',
      name: 'Fashion',
      icon: 'tshirt-crew',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop',
      stories: [
        {
          id: 6,
          username: 'style_queen',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
          hasNewStory: true,
          category: 'fashion',
          segments: [
            {
              id: 8,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=700&fit=crop',
              timestamp: '1h',
              duration: 5000
            }
          ]
        }
      ]
    },
    tech: {
      id: 'tech',
      name: 'Tech',
      icon: 'laptop',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=100&fit=crop',
      stories: [
        {
          id: 8,
          username: 'tech_reviewer',
          avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
          hasNewStory: true,
          category: 'tech',
          segments: [
            {
              id: 10,
              type: 'image',
              content: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=700&fit=crop',
              timestamp: '30m',
              duration: 5000
            }
          ]
        }
      ]
    }
  };
};
// Payment Methods
export const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card', color: '#4CAF50' },
  { id: 'upi', name: 'UPI Payment', icon: 'account-cash', color: '#FF9800' },
  { id: 'wallet', name: 'Digital Wallet', icon: 'wallet', color: '#2196F3' },
  { id: 'netbanking', name: 'Net Banking', icon: 'bank', color: '#9C27B0' },
];

// Story pricing
export const storyPrice = 49; // ₹49 per story
export default {
  sampleUsers,
  samplePosts,
  generateSamplePosts,
  generateSampleUsers,
  getAllPosts,
  getAllUsers,
  getPostsByCategory,
  getUserById,
  getPostById,
  generateSamplePostss,
  categories,
};