import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    home: 'Home',
    search: 'Search',
    create: 'Create',
    profile: 'Profile',
    messages: 'Messages',
    settings: 'Settings',
    login: 'Login',
    events: "Events",
    signup: 'Sign Up',
    logout: 'Logout',
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    save: 'Save',
    claim: 'Claim',
    trending: 'Trending',
    food: 'Food',
    fashion: 'Fashion',
    electronics: 'Electronics',
    beauty: 'Beauty',
    sports: 'Sports',
    business: 'Business',
    user: 'User',
    location: 'Location',
    notifications: 'Notifications',
    followers: 'Followers',
    following: 'Following',
    posts: 'Posts',
    edit_profile: 'Edit Profile',
    change_language: 'Change Language',
    theme: 'Theme',
    report: 'Report',
    hide: 'Don\'t show again',
    saved_posts: 'Saved Posts',
    scan_qr: 'Scan QR Code',
    welcome: 'Welcome to Dealzsta',
    find_deals: 'Find amazing deals near you',
  },
  es: {
    home: 'Inicio',
    search: 'Buscar',
    create: 'Crear',
    profile: 'Perfil',
    messages: 'Mensajes',
    settings: 'Configuración',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
    like: 'Me Gusta',
    comment: 'Comentar',
    share: 'Compartir',
    save: 'Guardar',
    claim: 'Reclamar',
    trending: 'Tendencia',
    food: 'Comida',
    fashion: 'Moda',
    electronics: 'Electrónicos',
    beauty: 'Belleza',
    sports: 'Deportes',
    business: 'Negocio',
    user: 'Usuario',
    location: 'Ubicación',
    notifications: 'Notificaciones',
    followers: 'Seguidores',
    following: 'Siguiendo',
    posts: 'Publicaciones',
    edit_profile: 'Editar Perfil',
    change_language: 'Cambiar Idioma',
    theme: 'Tema',
    report: 'Reportar',
    hide: 'No mostrar de nuevo',
    saved_posts: 'Publicaciones Guardadas',
    scan_qr: 'Escanear Código QR',
    welcome: 'Bienvenido a Dealzsta',
    find_deals: 'Encuentra ofertas increíbles cerca de ti',
  },
  fr: {
    home: 'Accueil',
    search: 'Rechercher',
    create: 'Créer',
    profile: 'Profil',
    messages: 'Messages',
    settings: 'Paramètres',
    login: 'Connexion',
    signup: 'S\'inscrire',
    logout: 'Déconnexion',
    like: 'J\'aime',
    comment: 'Commenter',
    share: 'Partager',
    save: 'Sauvegarder',
    claim: 'Réclamer',
    trending: 'Tendance',
    food: 'Nourriture',
    fashion: 'Mode',
    electronics: 'Électronique',
    beauty: 'Beauté',
    sports: 'Sports',
    business: 'Entreprise',
    user: 'Utilisateur',
    location: 'Emplacement',
    notifications: 'Notifications',
    followers: 'Abonnés',
    following: 'Abonnements',
    posts: 'Publications',
    edit_profile: 'Modifier le Profil',
    change_language: 'Changer la Langue',
    theme: 'Thème',
    report: 'Signaler',
    hide: 'Ne plus afficher',
    saved_posts: 'Publications Sauvegardées',
    scan_qr: 'Scanner le Code QR',
    welcome: 'Bienvenue sur Dealzsta',
    find_deals: 'Trouvez des offres incroyables près de chez vous',
  },
  de: {
    home: 'Startseite',
    search: 'Suchen',
    create: 'Erstellen',
    profile: 'Profil',
    messages: 'Nachrichten',
    settings: 'Einstellungen',
    login: 'Anmelden',
    signup: 'Registrieren',
    logout: 'Abmelden',
    like: 'Gefällt mir',
    comment: 'Kommentieren',
    share: 'Teilen',
    save: 'Speichern',
    claim: 'Beanspruchen',
    trending: 'Trending',
    food: 'Essen',
    fashion: 'Mode',
    electronics: 'Elektronik',
    beauty: 'Schönheit',
    sports: 'Sport',
    business: 'Geschäft',
    user: 'Benutzer',
    location: 'Standort',
    notifications: 'Benachrichtigungen',
    followers: 'Follower',
    following: 'Folgt',
    posts: 'Beiträge',
    edit_profile: 'Profil Bearbeiten',
    change_language: 'Sprache Ändern',
    theme: 'Design',
    report: 'Melden',
    hide: 'Nicht mehr anzeigen',
    saved_posts: 'Gespeicherte Beiträge',
    scan_qr: 'QR-Code Scannen',
    welcome: 'Willkommen bei Dealzsta',
    find_deals: 'Finden Sie tolle Angebote in Ihrer Nähe',
  },
  hi: {
    home: 'होम',
    search: 'खोजें',
    create: 'बनाएं',
    profile: 'प्रोफ़ाइल',
    messages: 'संदेश',
    settings: 'सेटिंग्स',
    login: 'लॉगिन',
    signup: 'साइन अप',
    logout: 'लॉगआउट',
    like: 'लाइक',
    comment: 'टिप्पणी',
    share: 'साझा करें',
    save: 'सेव करें',
    claim: 'दावा करें',
    trending: 'ट्रेंडिंग',
    food: 'खाना',
    fashion: 'फैशन',
    electronics: 'इलेक्ट्रॉनिक्स',
    beauty: 'सुंदरता',
    sports: 'खेल',
    business: 'व्यापार',
    user: 'उपयोगकर्ता',
    location: 'स्थान',
    notifications: 'सूचनाएं',
    followers: 'फॉलोअर्स',
    following: 'फॉलोइंग',
    posts: 'पोस्ट',
    edit_profile: 'प्रोफ़ाइल संपादित करें',
    change_language: 'भाषा बदलें',
    theme: 'थीम',
    report: 'रिपोर्ट',
    hide: 'फिर से न दिखाएं',
    saved_posts: 'सेव की गई पोस्ट',
    scan_qr: 'QR कोड स्कैन करें',
    welcome: 'Dealzsta में आपका स्वागत है',
    find_deals: 'अपने पास के बेहतरीन ऑफर खोजें',
  },
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [t, setT] = useState(translations.en);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        setT(translations[savedLanguage]);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      if (translations[language]) {
        setCurrentLanguage(language);
        setT(translations[language]);
        await AsyncStorage.setItem('language', language);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, t, changeLanguage, availableLanguages: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
};