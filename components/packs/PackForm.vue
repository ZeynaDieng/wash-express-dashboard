<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-slate-700">Nom du Pack</label>
        <input v-model="form.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Couleur (Hex)</label>
        <div class="flex gap-2">
          <input v-model="form.color" type="color" class="h-10 w-10 p-0 border-0 rounded overflow-hidden" />
          <input v-model="form.color" type="text" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 uppercase" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Mise (FCFA)</label>
        <input v-model.number="form.mise" type="number" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Gain (FCFA)</label>
        <input v-model.number="form.gain" type="number" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700">Période de Carence</label>
        <input v-model="form.carence" type="text" required placeholder="ex: 21 Jours" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Fonctionnalités (une par ligne)</label>
      <textarea v-model="featuresText" rows="4" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Support 24/7&#10;Contrat signé"></textarea>
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
      name: '',
      mise: 0,
      gain: 0,
      carence: '',
      color: '#000000',
      features: [] as string[]
    })
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({ ...props.initialData })

const featuresText = computed({
  get: () => form.value.features?.join('\n') || '',
  set: (val) => form.value.features = val.split('\n').filter(Boolean)
})

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = {
      name: '',
      mise: 0,
      gain: 0,
      carence: '',
      color: '#000000',
      features: [] as string[]
    }
  }
}, { immediate: true })

const submit = () => {
  // Only send allowed fields to avoid 400 error with forbidNonWhitelisted
  const payload = {
    name: form.value.name,
    mise: Number(form.value.mise),
    gain: Number(form.value.gain),
    carence: form.value.carence,
    color: form.value.color,
    features: form.value.features
  }
  emit('submit', payload)
}
</script>
