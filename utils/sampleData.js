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

  const users = [];
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user_${i}`,
      name: names[i % names.length],
      email: `user${i}@example.com`,
      avatar: sampleAvatars[i % sampleAvatars.length],
      accountType: Math.random() > 0.7 ? 'business' : 'user',
      verified: Math.random() > 0.4,
      followers: Math.floor(Math.random() * 10000) + 100,
      following: Math.floor(Math.random() * 1000) + 50,
      posts: Math.floor(Math.random() * 500) + 10,
      bio: 'Living life to the fullest 🌟 | Food lover 🍕 | Travel enthusiast ✈️',
      joined: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return users;
};