import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Play, Star, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
// import * as Location from 'expo-location';

interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  platform: string;
  image: string;
  description: string;
}

interface Theater {
  id: string;
  name: string;
  distance: string;
  address: string;
  movies: string[];
}

const popularMovies: Movie[] = [
  {
    id: '1',
    title: 'Guardians of the Galaxy Vol. 3',
    genre: 'Action/Adventure',
    rating: 8.2,
    duration: '150 min',
    platform: 'Theater',
    image: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
    description: 'The final chapter of the Guardians trilogy'
  },
  {
    id: '2',
    title: 'The Menu',
    genre: 'Thriller/Horror',
    rating: 7.8,
    duration: '107 min',
    platform: 'Netflix',
    image: 'https://image.tmdb.org/t/p/w500/v31MsWhF9WFh7Qooq6xSBbmJxoG.jpg',
    description: 'A culinary thriller that will keep you on edge'
  },
  {
    id: '3',
    title: 'Everything Everywhere All at Once',
    genre: 'Sci-Fi/Comedy',
    rating: 9.1,
    duration: '139 min',
    platform: 'Amazon Prime',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    description: 'A mind-bending multiverse adventure'
  },
  {
    id: '4',
    title: 'Top Gun: Maverick',
    genre: 'Action/Drama',
    rating: 8.7,
    duration: '131 min',
    platform: 'Theater',
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    description: 'The long-awaited sequel to the classic'
  },
  {
    id: '5',
    title: 'Spider-Man: No Way Home',
    genre: 'Action/Adventure',
    rating: 8.4,
    duration: '148 min',
    platform: 'Theater',
    image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    description: 'The multiverse brings together all Spider-Men'
  },
  {
    id: '6',
    title: 'Dune',
    genre: 'Sci-Fi/Adventure',
    rating: 8.0,
    duration: '155 min',
    platform: 'Theater',
    image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    description: 'Epic adaptation of Frank Herbert\'s masterpiece'
  }
];

const nearbyTheaters: Theater[] = [
  {
    id: '1',
    name: 'AMC Empire 25',
    distance: '0.8 km',
    address: '234 W 42nd St, New York, NY',
    movies: ['1', '4']
  },
  {
    id: '2',
    name: 'Regal Union Square',
    distance: '1.2 km',
    address: '850 Broadway, New York, NY',
    movies: ['1', '4']
  },
  {
    id: '3',
    name: 'Cinemark Downtown',
    distance: '2.1 km',
    address: '123 Main St, Downtown',
    movies: ['1', '4']
  }
];

export default function MoviesScreen() {
  const [location, setLocation] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'theater' | 'streaming'>('theater');

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      // Mock location for now - replace with actual location when expo-location is installed
      const mockLocation = {
        coords: {
          latitude: 40.7589,
          longitude: -73.9851
        }
      };
      setLocation(mockLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const theaterMovies = popularMovies.filter(movie => movie.platform === 'Theater');
  const streamingMovies = popularMovies.filter(movie => movie.platform !== 'Theater');

  const renderMovieCard = (movie: Movie) => (
    <Animated.View
      key={movie.id}
      entering={FadeInDown.delay(200)}
      style={styles.movieCard}
    >
      <TouchableOpacity
        style={styles.movieContent}
        onPress={() => {
          Alert.alert(movie.title, movie.description);
        }}
      >
        <Image source={{ uri: movie.image }} style={styles.movieImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.movieOverlay}
        >
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieGenre}>{movie.genre}</Text>
            <View style={styles.movieMeta}>
              <View style={styles.ratingContainer}>
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.rating}>{movie.rating}</Text>
              </View>
              <View style={styles.durationContainer}>
                <Clock size={14} color="#a1a1aa" />
                <Text style={styles.duration}>{movie.duration}</Text>
              </View>
            </View>
            <View style={styles.platformBadge}>
              <Text style={styles.platformText}>{movie.platform}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTheaterCard = (theater: Theater) => (
    <Animated.View
      key={theater.id}
      entering={FadeInDown.delay(300)}
      style={styles.theaterCard}
    >
      <TouchableOpacity style={styles.theaterContent}>
        <View style={styles.theaterInfo}>
          <Text style={styles.theaterName}>{theater.name}</Text>
          <View style={styles.theaterMeta}>
            <MapPin size={14} color="#3b82f6" />
            <Text style={styles.theaterDistance}>{theater.distance}</Text>
          </View>
          <Text style={styles.theaterAddress}>{theater.address}</Text>
        </View>
        <TouchableOpacity style={styles.directionsButton}>
          <Text style={styles.directionsText}>Directions</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a', '#1a1a1a']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movies & Entertainment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Selector */}
      <View style={styles.categorySelector}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'theater' && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory('theater')}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === 'theater' && styles.categoryTextActive
          ]}>
            In Theaters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'streaming' && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory('streaming')}
        >
          <Text style={[
            styles.categoryText,
            selectedCategory === 'streaming' && styles.categoryTextActive
          ]}>
            Streaming
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedCategory === 'theater' ? (
          <>
            {/* Location Status */}
            <Animated.View
              entering={FadeInDown.delay(100)}
              style={styles.locationContainer}
            >
              <MapPin size={16} color="#3b82f6" />
              <Text style={styles.locationText}>
                {location ? 'Showing theaters near you' : 'Getting your location...'}
              </Text>
            </Animated.View>

            {/* Theater Movies */}
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.moviesScroll}
            >
              {theaterMovies.map(renderMovieCard)}
            </ScrollView>

            {/* Nearby Theaters */}
            <Text style={styles.sectionTitle}>Nearby Theaters</Text>
            {nearbyTheaters.map(renderTheaterCard)}
          </>
        ) : (
          <>
            {/* Streaming Movies */}
            <Text style={styles.sectionTitle}>Popular on Streaming</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.moviesScroll}
            >
              {streamingMovies.map(renderMovieCard)}
            </ScrollView>

            {/* Streaming Platforms */}
            <Text style={styles.sectionTitle}>Available Platforms</Text>
            <View style={styles.platformsGrid}>
              {['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max'].map((platform) => (
                <TouchableOpacity key={platform} style={styles.platformCard}>
                  <Text style={styles.platformName}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  placeholder: {
    width: 44,
  },
  categorySelector: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 8,
  },
  moviesScroll: {
    marginBottom: 32,
  },
  movieCard: {
    width: 200,
    height: 280,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  movieContent: {
    flex: 1,
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  movieInfo: {
    padding: 16,
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  movieGenre: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#fbbf24',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#a1a1aa',
  },
  platformBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  platformText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  theaterCard: {
    marginBottom: 16,
  },
  theaterContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  theaterInfo: {
    flex: 1,
  },
  theaterName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  theaterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  theaterDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  theaterAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a1a1aa',
  },
  directionsButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  directionsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  platformCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  platformName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});