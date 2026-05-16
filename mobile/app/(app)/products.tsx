import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { get } from '../../lib/api'

interface Product {
  id: string
  name: string
  category: string
  unit: string
  description: string | null
  createdAt: string
}

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Meat',
  'Seafood',
  'Spices',
  'Other',
]

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [activeCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await get('/products')
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryRow}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.center}>
            <Text style={styles.muted}>Loading…</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.empty}>No products yet</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardMeta}>
                    {item.category} · {item.unit}
                  </Text>
                  {item.description ? (
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.cardDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { paddingVertical: 32, alignItems: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, paddingTop: 16 },
  categoryRow: { marginBottom: 16, maxHeight: 44 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  categoryChipActive: { backgroundColor: '#2563eb' },
  categoryText: { fontSize: 13, color: '#666', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  muted: { fontSize: 14, color: '#666' },
  empty: { fontSize: 16, color: '#666' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 13, color: '#666', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#999', lineHeight: 16 },
  cardDate: { fontSize: 11, color: '#9ca3af', marginLeft: 12 },
})
