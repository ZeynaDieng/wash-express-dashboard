<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-slate-700">Titre du Service</label>
      <input v-model="form.title" type="text" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700">Prix (FCFA)</label>
        <input v-model.number="form.price" type="number" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Catégorie</label>
        <select v-model="form.category" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="B2C">Particuliers (B2C)</option>
          <option value="B2B">Entreprises (B2B)</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Description</label>
      <textarea v-model="form.description" rows="4" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700">Unité de Prix</label>
        <input v-model="form.unit" type="text" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="ex: FCFA / Mois" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Couleur (Tailwind)</label>
        <select v-model="form.color" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          <option value="blue">Bleu</option>
          <option value="emerald">Émeraude</option>
          <option value="violet">Violet</option>
          <option value="amber">Ambre</option>
          <option value="cyan">Cyan</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Badge (Optionnel)</label>
      <input v-model="form.badge" type="text" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="ex: Offre Spéciale" />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Points Clés (un par ligne)</label>
      <textarea v-model="featuresText" rows="3" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Entrez chaque avantage sur une nouvelle ligne..."></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Nom de l'icône (Lucide)</label>
      <input v-model="form.icon" type="text" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="ex: Briefcase, Zap, Home" />
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <button type="button" @click="$emit('cancel')" class="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">Annuler</button>
      <button type="submit" :disabled="loading" class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50">
        {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      price: 0,
      category: 'B2C',
      icon: '',
      unit: '',
      features: [],
      color: 'blue',
      badge: ''
    })
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({ ...props.initialData })
const featuresText = ref('')

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
    featuresText.value = newVal.features ? newVal.features.join('\n') : ''
  } else {
    form.value = {
      title: '',
      description: '',
      price: 0,
      category: 'B2C',
      icon: '',
      unit: '',
      features: [],
      color: 'blue',
      badge: ''
    }
    featuresText.value = ''
  }
}, { immediate: true })

const submit = () => {
  // Explicitly select allowed fields to avoid 400 error
  const payload = {
    title: form.value.title,
    description: form.value.description,
    price: Number(form.value.price),
    category: form.value.category,
    icon: form.value.icon,
    unit: form.value.unit,
    features: featuresText.value.split('\n').filter(line => line.trim() !== ''),
    color: form.value.color,
    badge: form.value.badge
  }
  emit('submit', payload)
}
</script>
