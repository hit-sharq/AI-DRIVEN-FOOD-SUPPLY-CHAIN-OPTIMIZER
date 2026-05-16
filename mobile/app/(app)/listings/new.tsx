import { useState, useEffect } from 'react'
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
  Alert,
} from 'react-native'
import { get, post } from '../../lib/api'
import { useRouter } from 'expo-router'

interface Product {
  id: string
  name: string
  unit: string
}

export default function NewListingScreen() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loading, setLoading] = useState(false)

  const [productId, setProductId] = useState('')
  const [quantityStr, setQuantityStr] = useState('')
  const [priceStr, setPriceStr] = useState('')
  const [description, setDescription] = useState('')
  const [productSelectOpen, setProductSelectOpen] = useState(false)

  useEffect(() => {
    get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingProducts(false))
  }, [])

  const selectedProduct = products.find((p) => p.id === productId)
  const canSubmit =
    productId.length > 0 &&
    parseFloat(quantityStr) > 0 &&
    parseFloat(priceStr) > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    try {
      await post('/listings', {
        productId,
        quantity: parseFloat(quantityStr),
        pricePerUnit: parseFloat(priceStr),
        description: description.trim() || undefined,
      })
      Alert.alert('Success', 'Listing created')
      router.back()
    } catch (err) {
      console.error('Create listing error:', err)
      Alert.alert('Error', 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProducts) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Listing</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator color="#2563eb" />
        </View>
      </SafeAreaView>
    )
  }

  if (products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Listing</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.center}>
            <Text style={styles.empty}>
              No products yet. Create a product first.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Listing</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Product */}
        <View style={styles.field}>
          <Text style={styles.label}>Product *</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setProductSelectOpen(!productSelectOpen)}
          >
            <Text
              style={selectedProduct ? styles.selectText : styles.selectPlaceholder}
            >
              {selectedProduct?.name ?? 'Select a product'}
            </Text>
            <Text style={styles.selectArrow}>▾</Text>
          </TouchableOpacity>
          {productSelectOpen && (
            <View style={styles.selectOpen}>
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="always"
                renderItem={({ item: p }) => (
                  <TouchableOpacity
                    style={styles.selectOption}
                    onPress={() => {
                      setProductSelectOpen(false)
                      setProductId(p.id)
                    }}
                  >
                    <Text
                      style={[
                        styles.selectOptionText,
                        p.id === productId && styles.selectOptionActive,
                      ]}
                    >
                      {p.name} ({p.unit})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Quantity */}
        <View style={styles.field}>
          <Text style={styles.label}>Quantity Available *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 100"
            placeholderTextColor="#999"
            value={quantityStr}
            onChangeText={setQuantityStr}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>

        {/* Price */}
        <View style={styles.field}>
          <Text style={styles.label}>Price per Unit (USD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2.50"
            placeholderTextColor="#999"
            value={priceStr}
            onChangeText={setPriceStr}
            keyboardType="numbers-and-punctuation"
            returnKeyType="done"
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputBox, styles.textArea]}>
            <Text
              style={styles.inputTextArea}
              multiline
              placeholder="Condition, harvest date, etc."
              placeholderTextColor="#999"
              onChangeText={setDescription}
              value={description}
            />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, (!canSubmit || loading) && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Creating…' : 'Create Listing'}
          </Text>
        </TouchableOpacity>
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
  content: { flex: 1, padding: 16 },
  empty: { fontSize: 16, color: '#666', textAlign: 'center', padding: 32 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  inputTextArea: {
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 15, color: '#111827' },
  selectPlaceholder: { fontSize: 15, color: '#999' },
  selectArrow: { fontSize: 12, color: '#999' },
  selectOpen: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    maxHeight: 200,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  selectOption: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  selectOptionText: { fontSize: 15, color: '#374151' },
  selectOptionActive: { color: '#2563eb', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitDisabled: { backgroundColor: '#93c5fd' },
  submitText: { color: '#fff', fontWeight: '600', fontSize: 16 },
})
