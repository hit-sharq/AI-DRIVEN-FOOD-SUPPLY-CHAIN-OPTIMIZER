import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

interface Prediction {
  id: string
  shelfLifeDays: number
  expiryDate: string
  confidence: number
  product: {
    name: string
  }
  createdAt: string
}

export default function PredictionsScreen() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      // Mock data for now
      setPredictions([
        {
          id: '1',
          shelfLifeDays: 5,
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          confidence: 92,
          product: {
            name: 'Tomatoes',
          },
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error fetching predictions:', error)
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        // Upload image and create prediction
        await uploadPrediction(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const uploadPrediction = async (imageUri: string) => {
    setUploading(true)
    try {
      // For now, just add mock prediction
      const newPrediction: Prediction = {
        id: Date.now().toString(),
        shelfLifeDays: Math.floor(Math.random() * 10) + 2,
        expiryDate: new Date(
          Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        confidence: Math.floor(Math.random() * 15 + 85),
        product: { name: 'Uploaded Product' },
        createdAt: new Date().toISOString(),
      }
      setPredictions([newPrediction, ...predictions])
    } catch (error) {
      console.error('Error uploading prediction:', error)
    } finally {
      setUploading(false)
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    return Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  }

  const getStatus = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return { label: 'Expired', color: '#dc2626' }
    if (daysUntilExpiry < 2) return { label: 'Critical', color: '#ea580c' }
    return { label: 'Good', color: '#16a34a' }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shelf-Life Predictions</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>Upload Image</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Predictions */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loader}
          />
        ) : predictions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No predictions yet. Upload an image to get started!
            </Text>
          </View>
        ) : (
          <View style={styles.predictionsContainer}>
            {predictions.map((prediction) => {
              const daysUntilExpiry = getDaysUntilExpiry(prediction.expiryDate)
              const status = getStatus(daysUntilExpiry)

              return (
                <View key={prediction.id} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <View>
                      <Text style={styles.productName}>
                        {prediction.product.name}
                      </Text>
                      <Text style={styles.date}>
                        {new Date(prediction.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.color + '20' },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Shelf Life</Text>
                      <Text style={styles.statValue}>
                        {prediction.shelfLifeDays} days
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Expires</Text>
                      <Text style={styles.statValue}>
                        {new Date(prediction.expiryDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Confidence</Text>
                      <Text style={styles.statValue}>
                        {prediction.confidence}%
                      </Text>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  predictionsContainer: {
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
})
