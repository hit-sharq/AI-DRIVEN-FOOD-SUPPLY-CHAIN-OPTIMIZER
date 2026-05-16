import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { get } from '../../lib/api'

interface ListingInfo {
  product: { name: string }
}

interface Transaction {
  id: string
  totalPrice: number
  quantity: number
  status: string
  createdAt: string
  listing: ListingInfo
}

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await get('/transactions')
      setTransactions(res.data)
    } catch (error) {
      console.error('Transactions fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.muted}>Loading…</Text>
        </View>
      </SafeAreaView>
    )
  }

  const totalSpent = transactions.reduce((s, t) => s + t.totalPrice, 0)
  const completed = transactions.filter((t) => t.status === 'COMPLETED').length

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Summary chips */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipValue}>{transactions.length}</Text>
            <Text style={styles.chipLabel}>Total</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipValue}>{completed}</Text>
            <Text style={styles.chipLabel}>Completed</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipValue}>${totalSpent.toFixed(0)}</Text>
            <Text style={styles.chipLabel}>Spent</Text>
          </View>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>No transactions yet</Text>
          </View>
        ) : (
          transactions.map((tx) => {
            const isBuyer = tx.listing?.product?.name != null
            return (
              <View key={tx.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>
                      {tx.listing?.product?.name ?? 'Unknown product'}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {isBuyer
                        ? `Bought · Qty ${tx.quantity}`
                        : `Sold · Qty ${tx.quantity}`}
                    </Text>
                    <Text style={styles.cardDate}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.amountBox}>
                    <Text style={styles.amount}>${tx.totalPrice.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={styles.footer}>
                  <Text style={[styles.badge, styles.badgeText]}>
                    {tx.status}
                  </Text>
                  <Text style={styles.unitPrice}>
                    ${tx.quantity > 0 ? (tx.totalPrice / tx.quantity).toFixed(2) : '—'}
                    {' '}/ unit
                  </Text>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { paddingVertical: 60, alignItems: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  muted: { fontSize: 14, color: '#666' },
  empty: { fontSize: 16, color: '#666' },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  chipValue: { fontSize: 18, fontWeight: '700', color: '#2563eb', marginBottom: 2 },
  chipLabel: { fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardRow: { flexDirection: 'row', marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 13, color: '#666', marginBottom: 2 },
  cardDate: { fontSize: 12, color: '#999' },
  amountBox: { justifyContent: 'center', alignItems: 'flex-end' },
  amount: { fontSize: 18, fontWeight: '700', color: '#111827' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  unitPrice: { fontSize: 12, color: '#999' },
})
