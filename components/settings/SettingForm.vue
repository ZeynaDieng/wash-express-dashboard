<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-slate-700">Clé (Identifiant unique)</label>
      <input v-model="form.key" type="text" required :disabled="!isNew" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500" />
      <p v-if="!isNew" class="mt-1 text-xs text-slate-500">La clé ne peut pas être modifiée.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Valeur</label>
      <textarea v-model="form.value" rows="3" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Description</label>
      <textarea v-model="form.description" rows="3" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
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
    default: null
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  key: '',
  value: '',
  description: ''
})

const isNew = computed(() => !props.initialData)

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = {
      key: '',
      value: '',
      description: ''
    }
  }
}, { immediate: true })

const submit = () => {
    // Only send key if new to avoid backend issues if it tries to update key (though backend DTO should handle it)
    const payload: any = {
        value: form.value.value,
        description: form.value.description
    }
    if (isNew.value) {
        payload.key = form.value.key
    }
    emit('submit', payload)
}
</script>
