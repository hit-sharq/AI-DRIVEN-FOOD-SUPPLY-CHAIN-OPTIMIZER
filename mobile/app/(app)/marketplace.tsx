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
  FlatList,
} from 'react-native'
import axios from 'axios'

interface Listing {
  id: string
  quantity: number
  pricePerUnit: number
  product: {
    name: string
    category: string
    unit: string
    vendor: {
      name: string
      location: string
    }
  }
}

export default function MarketplaceScreen() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other']

  useEffect(() => {
    fetchListings()
  }, [category])

  const fetchListings = async () => {
    try {
      setLoading(true)
      // Mock data for now
      setListings([
        {
          id: '1',
          quantity: 100,
          pricePerUnit: 2.5,
          product: {
            name: 'Fresh Tomatoes',
            category: 'Vegetables',
            unit: 'kg',
            vendor: {
              name: 'Green Farm Co.',
              location: 'Nairobi',
            },
          },
        },
        {
          id: '2',
          quantity: 50,
          pricePerUnit: 3.0,
          product: {
            name: 'Bananas',
            category: 'Fruits',
            unit: 'kg',
            vendor: {
              name: 'Tropical Farms',
              location: 'Kisumu',
            },
          },
        },
      ])
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(
    (listing) =>
      listing.product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!category || listing.product.category === category)
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat === category ? '' : cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Listings */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
        ) : filteredListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No listings found</Text>
          </View>
        ) : (
          <View style={styles.listingsContainer}>
            {filteredListings.map((listing) => (
              <TouchableOpacity key={listing.id} style={styles.listingCard}>
                <View>
                  <Text style={styles.productName}>{listing.product.name}</Text>
                  <Text style={styles.vendorName}>
                    {listing.product.vendor.name}
                  </Text>
                  <Text style={styles.location}>
                    📍 {listing.product.vendor.location}
                  </Text>
                </View>
                <View style={styles.priceSection}>
                  <Text style={styles.price}>
                    ${listing.pricePerUnit.toFixed(2)}
                  </Text>
                  <Text style={styles.unit}>per {listing.product.unit}</Text>
                  <Text style={styles.available}>
                    {listing.quantity} {listing.product.unit}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
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
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  loader: {
    marginTop: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listingsContainer: {
    marginBottom: 16,
  },
  listingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  unit: {
    fontSize: 12,
    color: '#666',
  },
  available: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
})
