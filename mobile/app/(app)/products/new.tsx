import { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { get, post } from '../../lib/api'
import { useRouter } from 'expo-router'

const CATEGORIES = [
  'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Seafood', 'Spices', 'Other',
]
const UNITS = ['kg', 'lb', 'tons', 'boxes', 'crates', 'bundles']

export default function NewProductScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [unitOpen, setUnitOpen] = useState(false)

  const validate =
    name.trim().length > 0 && category.length > 0 && unit.length > 0

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo access to upload images.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri)
    }
  }, [])

  const handleSubmit = async () => {
    if (!validate) return

    setLoading(true)
    try {
      const formData = new Record<string, unknown>()
      formData.name = name.trim()
      formData.category = category
      formData.unit = unit
      formData.description = description.trim()

      if (imageUri) {
        const res = await fetch(imageUri)
        const blob = await res.blob()
        // @ts-expect-error Blob → form-data cast
        delete (formData as Record<string, unknown>)['image']
        // @ts-expect-error Blob is not Record<string, unknown>
        await post('/products', formData, { 'Content-Type': 'multipart/form-data' })
      } else {
        await post('/products', formData)
      }

      Alert.alert('Success', 'Product created')
      router.back()
    } catch (err) {
      console.error('Create product error:', err)
      Alert.alert('Error', 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const Picker = ({
    open, setOpen, label, value, options,
  }: {
    open: boolean
    setOpen: (v: boolean) => void
    label: string
    value: string
    options: string[]
  }) => {
    if (!open) {
      return (
        <TouchableOpacity style={styles.selectBox} onPress={() => setOpen(true)}>
          <Text style={value ? styles.selectText : styles.selectPlaceholder}>
            {value || `Select ${label}`}
          </Text>
          <Text style={styles.selectArrow}>▾</Text>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.selectOpen}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.selectOption}
            onPress={() => {
              setOpen(false)
              ;(label === 'Category' ? setCategory : setUnit)(opt)
            }}
          >
            <Text style={[styles.selectOptionText, opt === value && styles.selectOptionActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Product</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Product Name *</Text>
          <View style={styles.inputBox}>
            <Text
              style={styles.inputText}
              placeholderTextColor="#999"
              onChangeText={setName}
              value={name}
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category *</Text>
          <Picker
            open={categoryOpen}
            setOpen={setCategoryOpen}
            label="Category"
            value={category}
            options={CATEGORIES}
          />
        </View>

        {/* Unit */}
        <View style={styles.field}>
          <Text style={styles.label}>Unit of Measurement *</Text>
          <Picker
            open={unitOpen}
            setOpen={setUnitOpen}
            label="Unit"
            value={unit}
            options={UNITS}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <View style={[styles.inputBox, styles.textArea]}>
            <Text
              style={styles.inputTextArea}
              multiline
              placeholder="Optional description"
              placeholderTextColor="#999"
              onChangeText={setDescription}
              value={description}
            />
          </View>
        </View>

        {/* Image */}
        <View style={styles.field}>
          <Text style={styles.label}>Product Image (optional)</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {imageUri ? (
              <Text style={styles.uploadHas}>📸 Image selected</Text>
            ) : (
              <>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Tap to upload an image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading || !validate}
        >
          <Text style={styles.submitText}>
            {loading ? 'Creating…' : 'Create Product'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 15,
    color: '#111827',
  },
  inputTextArea: {
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  textArea: {},
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
  selectOption: { paddingHorizontal: 12, paddingVertical: 10 },
  selectOptionText: { fontSize: 15, color: '#374151' },
  selectOptionActive: { color: '#2563eb', fontWeight: '600' },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#dbeafe',
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  uploadHas: { fontSize: 15, color: '#2563eb', fontWeight: '600' },
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
