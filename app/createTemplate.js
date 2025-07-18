import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  PanResponder,
  Animated,
  Image,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Download,
  Palette,
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Layers,
  Undo,
  Redo,
  Move,
  RotateCw,
  Trash2,
  Plus,
  Zap,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Star,
  Heart,
  Camera,
  Upload,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { 
  Rect, 
  Circle as SvgCircle, 
  Text as SvgText, 
  Path,
  Polygon,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop 
} from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CANVAS_WIDTH = screenWidth - 40;
const CANVAS_HEIGHT = 400;

export default function CreateTemplate() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [canvasBackground, setCanvasBackground] = useState('#FFFFFF');
  const [backgroundType, setBackgroundType] = useState('solid'); // 'solid', 'gradient'
  const [gradientColors, setGradientColors] = useState(['#6C63FF', '#9C88FF']);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { theme } = useTheme();
  const router = useRouter();

  // Enhanced templates with modern designs
  const templates = [
    {
      id: 1,
      name: 'Modern Sale',
      background: { type: 'gradient', colors: ['#667eea', '#764ba2'] },
      elements: [
        { 
          id: 'shape1', 
          type: 'rectangle', 
          x: 20, 
          y: 50, 
          width: CANVAS_WIDTH - 40, 
          height: 120, 
          color: 'rgba(255,255,255,0.15)', 
          borderRadius: 20 
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: 'MEGA SALE', 
          x: 50, 
          y: 90, 
          fontSize: 36, 
          color: '#FFFFFF', 
          fontWeight: 'bold',
          fontFamily: 'System',
          textAlign: 'left',
          textShadow: true
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: 'UP TO 70% OFF', 
          x: 50, 
          y: 130, 
          fontSize: 18, 
          color: '#FFE66D',
          fontWeight: '600',
          letterSpacing: 2
        },
        {
          id: 'shape2',
          type: 'circle',
          x: CANVAS_WIDTH - 80,
          y: 20,
          radius: 25,
          color: '#FFE66D',
          opacity: 0.8
        }
      ]
    },
    {
      id: 2,
      name: 'Food Delivery',
      background: { type: 'gradient', colors: ['#ffeaa7', '#fab1a0'] },
      elements: [
        {
          id: 'shape1',
          type: 'rectangle',
          x: 30,
          y: 40,
          width: CANVAS_WIDTH - 60,
          height: 80,
          color: 'rgba(255,255,255,0.9)',
          borderRadius: 15
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: '🍕 Fresh Food', 
          x: 50, 
          y: 70, 
          fontSize: 28, 
          color: '#2d3436', 
          fontWeight: 'bold',
          fontFamily: 'System'
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: 'Fast Delivery • Hot & Fresh', 
          x: 50, 
          y: 100, 
          fontSize: 16, 
          color: '#636e72',
          fontWeight: '500'
        },
        {
          id: 'shape2',
          type: 'star',
          x: CANVAS_WIDTH - 60,
          y: 150,
          size: 30,
          color: '#fdcb6e'
        }
      ]
    },
    {
      id: 3,
      name: 'Business Card',
      background: { type: 'solid', color: '#2d3436' },
      elements: [
        {
          id: 'shape1',
          type: 'rectangle',
          x: 0,
          y: 0,
          width: CANVAS_WIDTH,
          height: 4,
          color: '#00b894',
          borderRadius: 0
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: 'JOHN DOE', 
          x: 30, 
          y: 60, 
          fontSize: 32, 
          color: '#FFFFFF', 
          fontWeight: 'bold',
          letterSpacing: 3
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: 'Creative Designer', 
          x: 30, 
          y: 90, 
          fontSize: 16, 
          color: '#00b894',
          fontWeight: '600'
        },
        { 
          id: 'text3', 
          type: 'text', 
          content: 'john@example.com • +1234567890', 
          x: 30, 
          y: 120, 
          fontSize: 14, 
          color: '#b2bec3',
          fontWeight: '400'
        }
      ]
    },
    {
      id: 4,
      name: 'Event Poster',
      background: { type: 'gradient', colors: ['#a29bfe', '#6c5ce7'] },
      elements: [
        {
          id: 'shape1',
          type: 'circle',
          x: -30,
          y: -30,
          radius: 80,
          color: 'rgba(255,255,255,0.1)'
        },
        {
          id: 'shape2',
          type: 'circle',
          x: CANVAS_WIDTH - 50,
          y: CANVAS_HEIGHT - 50,
          radius: 60,
          color: 'rgba(255,255,255,0.1)'
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: 'MUSIC FEST', 
          x: 40, 
          y: 120, 
          fontSize: 34, 
          color: '#FFFFFF', 
          fontWeight: 'bold',
          textAlign: 'center'
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: '2024', 
          x: 40, 
          y: 160, 
          fontSize: 48, 
          color: '#ffeaa7',
          fontWeight: 'bold'
        },
        { 
          id: 'text3', 
          type: 'text', 
          content: 'JUNE 25-27 • CENTRAL PARK', 
          x: 40, 
          y: 190, 
          fontSize: 12, 
          color: '#FFFFFF',
          letterSpacing: 2
        }
      ]
    },
    {
      id: 5,
      name: 'Social Media',
      background: { type: 'gradient', colors: ['#ff7675', '#fd79a8'] },
      elements: [
        {
          id: 'shape1',
          type: 'rectangle',
          x: 20,
          y: 30,
          width: CANVAS_WIDTH - 40,
          height: 100,
          color: 'rgba(255,255,255,0.2)',
          borderRadius: 25
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: 'Follow Us!', 
          x: 50, 
          y: 70, 
          fontSize: 32, 
          color: '#FFFFFF', 
          fontWeight: 'bold'
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: '@YourBrand', 
          x: 50, 
          y: 105, 
          fontSize: 20, 
          color: '#FFFFFF',
          fontStyle: 'italic'
        },
        {
          id: 'shape2',
          type: 'heart',
          x: CANVAS_WIDTH - 70,
          y: 50,
          size: 35,
          color: '#FFFFFF'
        }
      ]
    },
    {
      id: 6,
      name: 'Product Launch',
      background: { type: 'solid', color: '#0984e3' },
      elements: [
        {
          id: 'shape1',
          type: 'rectangle',
          x: 0,
          y: CANVAS_HEIGHT - 60,
          width: CANVAS_WIDTH,
          height: 60,
          color: 'rgba(255,255,255,0.9)',
          borderRadius: 0
        },
        { 
          id: 'text1', 
          type: 'text', 
          content: 'NEW LAUNCH', 
          x: 30, 
          y: 80, 
          fontSize: 28, 
          color: '#FFFFFF', 
          fontWeight: 'bold',
          letterSpacing: 3
        },
        { 
          id: 'text2', 
          type: 'text', 
          content: 'Revolutionary Product', 
          x: 30, 
          y: 110, 
          fontSize: 18, 
          color: '#ddd',
          fontWeight: '500'
        },
        { 
          id: 'text3', 
          type: 'text', 
          content: 'Coming Soon...', 
          x: 30, 
          y: CANVAS_HEIGHT - 30, 
          fontSize: 16, 
          color: '#0984e3',
          fontWeight: 'bold'
        }
      ]
    }
  ];

  // Enhanced color palette
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#82E0AA',
    '#BB8FCE', '#F8C471', '#85C1E9', '#F1948A', '#6C63FF',
    '#FF8C94', '#FFD93D', '#6BCF7F', '#4D96FF', '#9B59B6',
    '#E74C3C', '#2ECC71', '#3498DB', '#F39C12', '#8E44AD',
    '#2d3436', '#636e72', '#b2bec3', '#ddd', '#fff',
    '#667eea', '#764ba2', '#ffeaa7', '#fab1a0', '#00b894',
    '#fd79a8', '#fdcb6e', '#a29bfe', '#6c5ce7', '#ff7675'
  ];

  // Enhanced font options
  const fonts = [
    { name: 'System', value: 'System' },
    { name: 'System Bold', value: 'System-Bold' },
    { name: 'System Light', value: 'System-Light' },
    { name: 'Monospace', value: 'Courier' },
  ];

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48];

  const addElement = (type, config = {}) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 50,
      ...config,
    };

    switch (type) {
      case 'text':
        newElement.content = config.content || 'Sample Text';
        newElement.fontSize = config.fontSize || 18;
        newElement.color = config.color || '#000000';
        newElement.fontWeight = config.fontWeight || 'normal';
        newElement.fontFamily = config.fontFamily || 'System';
        newElement.fontStyle = config.fontStyle || 'normal';
        newElement.textAlign = config.textAlign || 'left';
        newElement.letterSpacing = config.letterSpacing || 0;
        newElement.textShadow = config.textShadow || false;
        break;
      case 'rectangle':
        newElement.width = config.width || 100;
        newElement.height = config.height || 60;
        newElement.color = config.color || '#4ECDC4';
        newElement.borderRadius = config.borderRadius || 0;
        newElement.opacity = config.opacity || 1;
        break;
      case 'circle':
        newElement.radius = config.radius || 30;
        newElement.color = config.color || '#FF6B6B';
        newElement.opacity = config.opacity || 1;
        break;
      case 'image':
        newElement.width = config.width || 120;
        newElement.height = config.height || 120;
        newElement.uri = config.uri || null;
        newElement.borderRadius = config.borderRadius || 0;
        break;
      case 'star':
        newElement.size = config.size || 30;
        newElement.color = config.color || '#FFD93D';
        break;
      case 'heart':
        newElement.size = config.size || 30;
        newElement.color = config.color || '#FF6B6B';
        break;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    saveToHistory(newElements);
  };

  const updateElement = (id, updates) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    if (selectedElement?.id === id) {
      setSelectedElement({...selectedElement, ...updates});
    }
    saveToHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setElements([...history[newIndex]]);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setElements([...history[newIndex]]);
      setHistoryIndex(newIndex);
    }
  };

  const loadTemplate = (template) => {
    if (template.background.type === 'gradient') {
      setBackgroundType('gradient');
      setGradientColors(template.background.colors);
      setCanvasBackground(template.background.colors[0]);
    } else {
      setBackgroundType('solid');
      setCanvasBackground(template.background.color);
    }
    setElements([...template.elements]);
    setSelectedElement(null);
    saveToHistory(template.elements);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      addElement('image', { uri: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      addElement('image', { uri: result.assets[0].uri });
    }
  };

  const exportTemplate = () => {
    Alert.alert(
      'Template Saved!',
      'Your template has been saved and can be used for creating posts.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderShape = (element) => {
    switch (element.type) {
      case 'star':
        const starPath = `M${element.x + element.size/2},${element.y} L${element.x + element.size*0.6},${element.y + element.size*0.4} L${element.x + element.size},${element.y + element.size*0.4} L${element.x + element.size*0.7},${element.y + element.size*0.65} L${element.x + element.size*0.8},${element.y + element.size} L${element.x + element.size/2},${element.y + element.size*0.8} L${element.x + element.size*0.2},${element.y + element.size} L${element.x + element.size*0.3},${element.y + element.size*0.65} L${element.x},${element.y + element.size*0.4} L${element.x + element.size*0.4},${element.y + element.size*0.4} Z`;
        return (
          <Path
            key={element.id}
            d={starPath}
            fill={element.color}
            stroke={selectedElement?.id === element.id ? '#007AFF' : 'none'}
            strokeWidth={selectedElement?.id === element.id ? 2 : 0}
            onPress={() => setSelectedElement(element)}
          />
        );
      case 'heart':
        const heartPath = `M${element.x + element.size/2},${element.y + element.size*0.8} C${element.x + element.size/2},${element.y + element.size*0.8} ${element.x},${element.y + element.size*0.3} ${element.x},${element.y + element.size*0.15} C${element.x},${element.y} ${element.x + element.size*0.25},${element.y} ${element.x + element.size/2},${element.y + element.size*0.15} C${element.x + element.size*0.75},${element.y} ${element.x + element.size},${element.y} ${element.x + element.size},${element.y + element.size*0.15} C${element.x + element.size},${element.y + element.size*0.3} ${element.x + element.size/2},${element.y + element.size*0.8} ${element.x + element.size/2},${element.y + element.size*0.8} Z`;
        return (
          <Path
            key={element.id}
            d={heartPath}
            fill={element.color}
            stroke={selectedElement?.id === element.id ? '#007AFF' : 'none'}
            strokeWidth={selectedElement?.id === element.id ? 2 : 0}
            onPress={() => setSelectedElement(element)}
          />
        );
      default:
        return null;
    }
  };

  const renderCanvas = () => {
    const canvasStyle = backgroundType === 'gradient' 
      ? { backgroundColor: 'transparent' }
      : { backgroundColor: canvasBackground };

    return (
      <View style={[styles.canvas, canvasStyle]}>
        {backgroundType === 'gradient' && (
          <LinearGradient
            colors={gradientColors}
            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        )}
        
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          {elements.map(element => {
            switch (element.type) {
              case 'rectangle':
                return (
                  <Rect
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    fill={element.color}
                    fillOpacity={element.opacity || 1}
                    rx={element.borderRadius}
                    stroke={selectedElement?.id === element.id ? '#007AFF' : 'none'}
                    strokeWidth={selectedElement?.id === element.id ? 2 : 0}
                    strokeDasharray={selectedElement?.id === element.id ? '5,5' : 'none'}
                    onPress={() => setSelectedElement(element)}
                  />
                );
              case 'circle':
                return (
                  <SvgCircle
                    key={element.id}
                    cx={element.x + element.radius}
                    cy={element.y + element.radius}
                    r={element.radius}
                    fill={element.color}
                    fillOpacity={element.opacity || 1}
                    stroke={selectedElement?.id === element.id ? '#007AFF' : 'none'}
                    strokeWidth={selectedElement?.id === element.id ? 2 : 0}
                    strokeDasharray={selectedElement?.id === element.id ? '5,5' : 'none'}
                    onPress={() => setSelectedElement(element)}
                  />
                );
              case 'text':
                return (
                  <SvgText
                    key={element.id}
                    x={element.x}
                    y={element.y + element.fontSize}
                    fontSize={element.fontSize}
                    fill={element.color}
                    fontWeight={element.fontWeight}
                    fontFamily={element.fontFamily}
                    fontStyle={element.fontStyle}
                    textAnchor={element.textAlign === 'center' ? 'middle' : element.textAlign === 'right' ? 'end' : 'start'}
                    letterSpacing={element.letterSpacing}
                    onPress={() => setSelectedElement(element)}
                  >
                    {element.content}
                  </SvgText>
                );
              case 'star':
              case 'heart':
                return renderShape(element);
              default:
                return null;
            }
          })}
        </Svg>
        
        {/* Render images separately as they can't be in SVG */}
        {elements.filter(el => el.type === 'image').map(element => (
          <TouchableOpacity
            key={element.id}
            style={[
              styles.imageElement,
              {
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                borderRadius: element.borderRadius,
                borderWidth: selectedElement?.id === element.id ? 2 : 0,
                borderColor: selectedElement?.id === element.id ? '#007AFF' : 'transparent',
              }
            ]}
            onPress={() => setSelectedElement(element)}
          >
            {element.uri && (
              <Image
                source={{ uri: element.uri }}
                style={[
                  styles.image,
                  { borderRadius: element.borderRadius }
                ]}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        ))}
        
        {/* Selection handles */}
        {selectedElement && (
          <View style={styles.selectionOverlay}>
            <TouchableOpacity
              style={styles.deleteHandle}
              onPress={() => deleteElement(selectedElement.id)}
            >
              <Trash2 size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderToolPanel = () => {
    const tabs = [
      { id: 'templates', icon: Layers, label: 'Templates' },
      { id: 'text', icon: Type, label: 'Text' },
      { id: 'shapes', icon: Square, label: 'Shapes' },
      { id: 'images', icon: ImageIcon, label: 'Images' },
      { id: 'colors', icon: Palette, label: 'Colors' },
    ];

    return (
      <View style={[styles.toolPanel, { backgroundColor: theme.surface }]}>
        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          style={styles.tabBar}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: theme.primary }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <tab.icon 
                size={18} 
                color={activeTab === tab.id ? 'white' : theme.textSecondary} 
              />
              <Text style={[
                styles.tabLabel,
                { color: activeTab === tab.id ? 'white' : theme.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'templates' && (
            <View style={styles.templatesGrid}>
              {templates.map(template => (
                <TouchableOpacity
                  key={template.id}
                  style={[styles.templateCard]}
                  onPress={() => loadTemplate(template)}
                >
                  {template.background.type === 'gradient' ? (
                    <LinearGradient
                      colors={template.background.colors}
                      style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                    />
                  ) : (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: template.background.color, borderRadius: 12 }]} />
                  )}
                  <Text style={styles.templateName}>{template.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'text' && (
            <View style={styles.textTools}>
              <TouchableOpacity
                style={[styles.toolButton, { backgroundColor: theme.primary }]}
                onPress={() => addElement('text')}
              >
                <Plus size={20} color="white" />
                <Text style={styles.toolButtonText}>Add Text</Text>
              </TouchableOpacity>
              
              {selectedElement?.type === 'text' && (
                <View style={styles.textControls}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Text Content</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.background, color: theme.text }]}
                    value={selectedElement.content}
                    onChangeText={(text) => updateElement(selectedElement.id, { content: text })}
                    placeholder="Enter text..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                  />
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Font Family</Text>
                  <ScrollView horizontal style={styles.fontSelector}>
                    {fonts.map(font => (
                      <TouchableOpacity
                        key={font.value}
                        style={[
                          styles.fontOption,
                          selectedElement.fontFamily === font.value && { backgroundColor: theme.primary }
                        ]}
                        onPress={() => updateElement(selectedElement.id, { fontFamily: font.value })}
                      >
                        <Text style={[
                          styles.fontOptionText,
                          { color: selectedElement.fontFamily === font.value ? 'white' : theme.text }
                        ]}>
                          {font.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Font Size</Text>
                  <ScrollView horizontal style={styles.fontSizeSelector}>
                    {fontSizes.map(size => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.fontSizeOption,
                          selectedElement.fontSize === size && { backgroundColor: theme.primary }
                        ]}
                        onPress={() => updateElement(selectedElement.id, { fontSize: size })}
                      >
                        <Text style={[
                          styles.fontSizeText,
                          { color: selectedElement.fontSize === size ? 'white' : theme.text }
                        ]}>
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Text Style</Text>
                  <View style={styles.textStyleControls}>
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.fontWeight === 'bold' && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { 
                        fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                      })}
                    >
                      <Bold size={18} color={selectedElement.fontWeight === 'bold' ? 'white' : theme.text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.fontStyle === 'italic' && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { 
                        fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                      })}
                    >
                      <Italic size={18} color={selectedElement.fontStyle === 'italic' ? 'white' : theme.text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.textShadow && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { 
                        textShadow: !selectedElement.textShadow 
                      })}
                    >
                      <Text style={[
                        styles.shadowButtonText,
                        { color: selectedElement.textShadow ? 'white' : theme.text }
                      ]}>S</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Text Alignment</Text>
                  <View style={styles.alignmentControls}>
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.textAlign === 'left' && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { textAlign: 'left' })}
                    >
                      <AlignLeft size={18} color={selectedElement.textAlign === 'left' ? 'white' : theme.text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.textAlign === 'center' && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { textAlign: 'center' })}
                    >
                      <AlignCenter size={18} color={selectedElement.textAlign === 'center' ? 'white' : theme.text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.styleButton,
                        selectedElement.textAlign === 'right' && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => updateElement(selectedElement.id, { textAlign: 'right' })}
                    >
                      <AlignRight size={18} color={selectedElement.textAlign === 'right' ? 'white' : theme.text} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Letter Spacing</Text>
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        letterSpacing: Math.max(-2, (selectedElement.letterSpacing || 0) - 0.5) 
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={[styles.sliderValue, { color: theme.text }]}>
                      {selectedElement.letterSpacing || 0}px
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        letterSpacing: Math.min(5, (selectedElement.letterSpacing || 0) + 0.5) 
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'shapes' && (
            <View style={styles.shapesTools}>
              <View style={styles.shapeButtonsRow}>
                <TouchableOpacity
                  style={[styles.shapeButton, { backgroundColor: theme.primary }]}
                  onPress={() => addElement('rectangle')}
                >
                  <Square size={20} color="white" />
                  <Text style={styles.toolButtonText}>Rectangle</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.shapeButton, { backgroundColor: theme.secondary }]}
                  onPress={() => addElement('circle')}
                >
                  <Circle size={20} color="white" />
                  <Text style={styles.toolButtonText}>Circle</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.shapeButtonsRow}>
                <TouchableOpacity
                  style={[styles.shapeButton, { backgroundColor: '#FFD93D' }]}
                  onPress={() => addElement('star')}
                >
                  <Star size={20} color="white" />
                  <Text style={styles.toolButtonText}>Star</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.shapeButton, { backgroundColor: '#FF6B6B' }]}
                  onPress={() => addElement('heart')}
                >
                  <Heart size={20} color="white" />
                  <Text style={styles.toolButtonText}>Heart</Text>
                </TouchableOpacity>
              </View>
              
              {selectedElement && ['rectangle', 'circle', 'star', 'heart'].includes(selectedElement.type) && (
                <View style={styles.shapeControls}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Shape Color</Text>
                  <ScrollView horizontal style={styles.colorPalette}>
                    {colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch, 
                          { backgroundColor: color },
                          selectedElement.color === color && styles.selectedColorSwatch
                        ]}
                        onPress={() => updateElement(selectedElement.id, { color })}
                      />
                    ))}
                  </ScrollView>
                  
                  {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle') && (
                    <>
                      <Text style={[styles.controlLabel, { color: theme.text }]}>Opacity</Text>
                      <View style={styles.sliderContainer}>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => updateElement(selectedElement.id, { 
                            opacity: Math.max(0.1, (selectedElement.opacity || 1) - 0.1) 
                          })}
                        >
                          <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
                        </TouchableOpacity>
                        
                        <Text style={[styles.sliderValue, { color: theme.text }]}>
                          {Math.round((selectedElement.opacity || 1) * 100)}%
                        </Text>
                        
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => updateElement(selectedElement.id, { 
                            opacity: Math.min(1, (selectedElement.opacity || 1) + 0.1) 
                          })}
                        >
                          <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  
                  {selectedElement.type === 'rectangle' && (
                    <>
                      <Text style={[styles.controlLabel, { color: theme.text }]}>Border Radius</Text>
                      <View style={styles.sliderContainer}>
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => updateElement(selectedElement.id, { 
                            borderRadius: Math.max(0, (selectedElement.borderRadius || 0) - 2) 
                          })}
                        >
                          <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
                        </TouchableOpacity>
                        
                        <Text style={[styles.sliderValue, { color: theme.text }]}>
                          {selectedElement.borderRadius || 0}px
                        </Text>
                        
                        <TouchableOpacity
                          style={styles.sliderButton}
                          onPress={() => updateElement(selectedElement.id, { 
                            borderRadius: Math.min(50, (selectedElement.borderRadius || 0) + 2) 
                          })}
                        >
                          <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          )}

          {activeTab === 'images' && (
            <View style={styles.imageTools}>
              <View style={styles.imageButtonsRow}>
                <TouchableOpacity
                  style={[styles.imageButton, { backgroundColor: theme.primary }]}
                  onPress={pickImage}
                >
                  <Upload size={20} color="white" />
                  <Text style={styles.toolButtonText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.imageButton, { backgroundColor: theme.secondary }]}
                  onPress={takePhoto}
                >
                  <Camera size={20} color="white" />
                  <Text style={styles.toolButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
              
              {selectedElement?.type === 'image' && (
                <View style={styles.imageControls}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Image Size</Text>
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        width: Math.max(50, selectedElement.width - 10),
                        height: Math.max(50, selectedElement.height - 10)
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={[styles.sliderValue, { color: theme.text }]}>
                      {selectedElement.width}x{selectedElement.height}
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        width: Math.min(CANVAS_WIDTH - 20, selectedElement.width + 10),
                        height: Math.min(CANVAS_HEIGHT - 20, selectedElement.height + 10)
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Border Radius</Text>
                  <View style={styles.sliderContainer}>
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        borderRadius: Math.max(0, (selectedElement.borderRadius || 0) - 2) 
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={[styles.sliderValue, { color: theme.text }]}>
                      {selectedElement.borderRadius || 0}px
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.sliderButton}
                      onPress={() => updateElement(selectedElement.id, { 
                        borderRadius: Math.min(60, (selectedElement.borderRadius || 0) + 2) 
                      })}
                    >
                      <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'colors' && (
            <View style={styles.colorTools}>
              <Text style={[styles.controlLabel, { color: theme.text }]}>Background Type</Text>
              <View style={styles.backgroundTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    backgroundType === 'solid' && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => setBackgroundType('solid')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    { color: backgroundType === 'solid' ? 'white' : theme.text }
                  ]}>Solid</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    backgroundType === 'gradient' && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => setBackgroundType('gradient')}
                >
                  <Text style={[
                    styles.typeButtonText,
                    { color: backgroundType === 'gradient' ? 'white' : theme.text }
                  ]}>Gradient</Text>
                </TouchableOpacity>
              </View>
              
              {backgroundType === 'solid' ? (
                <>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Background Color</Text>
                  <ScrollView horizontal style={styles.colorPalette}>
                    {colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch, 
                          { backgroundColor: color },
                          canvasBackground === color && styles.selectedColorSwatch
                        ]}
                        onPress={() => setCanvasBackground(color)}
                      />
                    ))}
                  </ScrollView>
                </>
              ) : (
                <>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Gradient Start Color</Text>
                  <ScrollView horizontal style={styles.colorPalette}>
                    {colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch, 
                          { backgroundColor: color },
                          gradientColors[0] === color && styles.selectedColorSwatch
                        ]}
                        onPress={() => setGradientColors([color, gradientColors[1]])}
                      />
                    ))}
                  </ScrollView>
                  
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Gradient End Color</Text>
                  <ScrollView horizontal style={styles.colorPalette}>
                    {colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch, 
                          { backgroundColor: color },
                          gradientColors[1] === color && styles.selectedColorSwatch
                        ]}
                        onPress={() => setGradientColors([gradientColors[0], color])}
                      />
                    ))}
                  </ScrollView>
                </>
              )}
              
              {selectedElement && (
                <View style={styles.elementColorSection}>
                  <Text style={[styles.controlLabel, { color: theme.text }]}>Element Color</Text>
                  <ScrollView horizontal style={styles.colorPalette}>
                    {colors.map(color => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorSwatch, 
                          { backgroundColor: color },
                          selectedElement.color === color && styles.selectedColorSwatch
                        ]}
                        onPress={() => updateElement(selectedElement.id, { color })}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#9C88FF']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Template Creator</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={undo}
              disabled={historyIndex <= 0}
            >
              <Undo size={20} color={historyIndex <= 0 ? '#FFFFFF60' : 'white'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo size={20} color={historyIndex >= history.length - 1 ? '#FFFFFF60' : 'white'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={exportTemplate}
            >
              <Save size={16} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        <Text style={[styles.canvasLabel, { color: theme.textSecondary }]}>
          Design Canvas
        </Text>
        {renderCanvas()}
      </View>

      {/* Tool Panel */}
      {renderToolPanel()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  canvasContainer: {
    padding: 20,
    alignItems: 'center',
  },
  canvasLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageElement: {
    position: 'absolute',
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  deleteHandle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolPanel: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBar: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 20,
  },
  templateCard: {
    width: (screenWidth - 64) / 2,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  templateName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textTools: {
    paddingBottom: 20,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  toolButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  textControls: {
    gap: 16,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    minHeight: 44,
    maxHeight: 88,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  fontSelector: {
    marginBottom: 8,
  },
  fontOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  fontOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fontSizeSelector: {
    marginBottom: 8,
  },
  fontSizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
    minWidth: 40,
    alignItems: 'center',
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textStyleControls: {
    flexDirection: 'row',
    gap: 8,
  },
  styleButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alignmentControls: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  shapesTools: {
    paddingBottom: 20,
    gap: 16,
  },
  shapeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shapeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  shapeControls: {
    marginTop: 8,
    gap: 16,
  },
  imageTools: {
    paddingBottom: 20,
    gap: 16,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  imageControls: {
    gap: 16,
  },
  colorTools: {
    paddingBottom: 40,
    gap: 16,
  },
  backgroundTypeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorPalette: {
    marginBottom: 8,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedColorSwatch: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  elementColorSection: {
    marginTop: 8,
  },
});