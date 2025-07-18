const eventData = {
  id: 1,
  title: 'Hukum World Tour | Chennai',
  date: 'Sat, 26 Jul | 6 PM onwards',
  location: 'Thiruvidanthai, ECR, Chennai',
  distance: '495.6 km away',
  description:
    'After 3 long years, Anirudh Ravichander returns to his hometown for a thunderous comeback like never before! The Hukum World Tour arrives in Chennai with all guns blazing — a grand spectacle...',
  language: 'Tamil',
  duration: '4 Hours',
  ageLimit: '5 years & above',
  entryAllowed: 'All ages',
  layout: 'Outdoor',
  seating: 'Seated & Standing',
  kidFriendly: 'Yes',
  petFriendly: 'No',
  artist: {
    name: 'Anirudh Ravichander',
    category: 'Tamil, Music',
    songs: [
      'Chikitu (From “Coolie”)',
      'Chaleya (From “Jawan”)',
      'Chuttamalle (From “Devara Part 1”)',
      'Pathikichu (From “Vidaa Muyarchi”)',
      'Hukum – Thalaivar Alappara',
    ],
  },
  gallery: [
    require('../../assets/images/hip.jpg'),
    require('../../assets/images/hip.jpg'),
    require('../../assets/images/hip.jpg'),
    require('../../assets/images/hip.jpg'),
  ],
  prohibited: [
    'Outside Food & Beverage',
    'Alcohol',
    'Metal Container',
    'Glass containers',
    'Flammable Materials',
    'Lighter and Matchbox',
    'Aerosols/Deodorants',
    'Laser pointer/flashlight',
    'Drones',
    'Professional Cameras',
  ],
};

export default eventData;