import { useUser } from '@clerk/expo'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { get } from '../../lib/api'

interface Stats {
  products: number
  listings: number
  wasteReduced: number
  revenue: number
}

export default function DashboardScreen() {
  const { user } = useUser()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    products: 0,
    listings: 0,
    wasteReduced: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, listingsRes] = await Promise.all([
        get('/products'),
        get('/listings'),
      ])
      setStats({
        products: productsRes.data.length || 0,
        listings: listingsRes.data.length || 0,
        wasteReduced: 0,
        revenue: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Browse Marketplace',
      icon: '🛒',
      onPress: () => router.push('/(app)/marketplace'),
    },
    {
      title: 'My Products',
      icon: '📦',
      onPress: () => router.push('/(app)/products'),
    },
    {
      title: 'Upload Predictions',
      icon: '📸',
      onPress: () => router.push('/(app)/predictions'),
    },
    {
      title: 'New Listing',
      icon: '🏷️',
      onPress: () => router.push('/(app)/listings/new'),
    },
    {
      title: 'Transaction History',
      icon: '💳',
      onPress: () => router.push('/(app)/transactions'),
    },
    {
      title: 'View My Profile',
      icon: '👤',
      onPress: () => router.push('/(app)/profile'),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.userName}>{user?.firstName || 'Vendor'}</Text>
        </View>

        {/* Stats Grid */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.products}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.listings}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.wasteReduced}</Text>
              <Text style={styles.statLabel}>Waste (kg)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${stats.revenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 14, color: '#666', marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: 'bold' },
  loader: { marginTop: 32 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666' },
  section: { marginBottom: 32 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIcon: { fontSize: 20, marginRight: 12 },
  actionTitle: { flex: 1, fontSize: 16, fontWeight: '500' },
  actionArrow: { fontSize: 20, color: '#9ca3af' },
})
