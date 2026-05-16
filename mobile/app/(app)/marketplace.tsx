import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { get, post } from '../../lib/api'

interface Vendor {
  id: string
  businessName: string
  location: string
}

interface Product {
  id: string
  name: string
  category: string
  unit: string
}

interface Listing {
  id: string
  quantity: number
  pricePerUnit: number
  surplus: boolean
  status: string
  product: Product
  vendor: Vendor
}

interface Prediction {
  id: string
  shelfLife: number | null
  quality: string | null
  confidence: number | null
  product: Product
  createdAt: string
}

export default function MarketplaceScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [tab, setTab] = useState<'listings' | 'predictions'>('listings')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [listingsRes, predictionsRes] = await Promise.all([
        get('/listings'),
        get('/predictions'),
      ])
      const activeListings = listingsRes.data.filter(
        (l: Listing) => l.status === 'ACTIVE'
      )
      setListings(activeListings)
      setPredictions(predictionsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter((l) =>
    l.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPredictions = predictions.filter((p) =>
    (p.product?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const expiringPredictions = predictions.filter(
    (p) => p.shelfLife !== null && p.shelfLife < 3
  )

  const displayListings = filterExpiring
    ? filteredListings.slice(0, 5)
    : filteredListings
  const displayPredictions = filterExpiring
    ? expiringPredictions
    : filteredPredictions

  const ListingCard = ({ listing }: { listing: Listing }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{listing.product.name}</Text>
        <Text style={styles.itemMeta}>
          {listing.vendor.businessName} · {listing.vendor.location}
        </Text>
        <Text style={styles.itemDetail}>
          {listing.quantity} {listing.product.unit} @ ${listing.pricePerUnit.toFixed(2)}
          {listing.surplus && ' · Surplus'}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{listing.status}</Text>
      </View>
    </View>
  )

  const PredictionCard = ({ prediction }: { prediction: Prediction }) => (
    <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{prediction.product?.name ?? 'Unknown'}</Text>
        <Text style={styles.itemMeta}>
          {new Date(prediction.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.itemDetail}>
          Shelf life: {prediction.shelfLife !== null ? `${prediction.shelfLife} days` : 'N/A'} ·{' '}
          Quality: {prediction.quality ?? 'N/A'}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: '#dcfce7' }]}>
        <Text style={[styles.badgeText, { color: '#16a34a' }]}>
          {prediction.confidence !== null
            ? `${Math.round(prediction.confidence * 100)}%`
            : '—'}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['listings', 'predictions'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === t && styles.tabTextActive,
                ]}
              >
                {t === 'listings' ? `Listings (${filteredListings.length})` : `Predictions (${filteredPredictions.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filter */}
        <TouchableOpacity
          style={[styles.filterBtn, filterExpiring && styles.filterBtnActive]}
          onPress={() => setFilterExpiring(!filterExpiring)}
        >
          <Text
            style={[styles.filterText, filterExpiring && styles.filterTextActive]}
          >
            {filterExpiring ? 'Showing: first 5 listings' : 'Show all'}
          </Text>
        </TouchableOpacity>

        {/* Content */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
        ) : tab === 'listings' ? (
          displayListings.length === 0 ? (
            <Text style={styles.empty}>No listings available</Text>
          ) : (
            displayListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )
        ) : displayPredictions.length === 0 ? (
          <Text style={styles.empty}>No predictions yet</Text>
        ) : (
          displayPredictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  filterBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  filterBtnActive: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  filterTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  loader: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 48,
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  itemDetail: {
    fontSize: 12,
    color: '#999',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
})
