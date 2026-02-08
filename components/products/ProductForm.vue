<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-slate-700">Nom du Produit</label>
      <input v-model="form.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700">Prix (FCFA)</label>
        <input v-model.number="form.price" type="number" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Stock</label>
        <input v-model.number="form.stock" type="number" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Catégorie</label>
      <select v-model="form.category" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
        <option value="Detergents">Détergents</option>
        <option value="Accessoires">Accessoires</option>
        <option value="Services">Services</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Description</label>
      <textarea v-model="form.description" rows="3" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
    </div>
    
    <ImageUpload v-model="form.image" label="Image du Produit" />

    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Annuler</button>
      <button type="submit" :disabled="loading" class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
        {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import ImageUpload from '../ui/ImageUpload.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: '',
      price: 0,
      stock: 0,
      category: 'Detergents',
      description: '',
      image: ''
    })
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({ ...props.initialData })

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    // Reset if null/undefined passed (checking for create mode)
    form.value = {
      name: '',
      price: 0,
      stock: 0,
      category: 'Detergents',
      description: '',
      image: ''
    }
  }
}, { immediate: true })


const submit = () => {
  // Explicitly select allowed fields to avoid 400 error
  const payload = {
    name: form.value.name,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    description: form.value.description,
    image: form.value.image,
    category: form.value.category
  }
  emit('submit', payload)
}
</script>
