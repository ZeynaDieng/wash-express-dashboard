<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-slate-700">Nom complet</label>
      <input v-model="form.fullName" type="text" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Email</label>
      <input v-model="form.email" type="email" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div>
      <label class="block text-sm font-medium text-slate-700">Rôle</label>
      <select v-model="form.role" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
        <option value="USER">Utilisateur</option>
        <option value="ADMIN">Administrateur</option>
      </select>
    </div>

    <!-- Password field only for new users or if explicitly changing -->
    <div v-if="!initialData || showPasswordInput">
      <label class="block text-sm font-medium text-slate-700">Mot de passe {{ initialData ? '(Laisser vide pour ne pas changer)' : '' }}</label>
      <input v-model="form.password" type="password" :required="!initialData" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
    </div>

    <div v-if="initialData" class="flex gap-2 text-sm text-blue-600 cursor-pointer">
       <span @click="showPasswordInput = !showPasswordInput">
         {{ showPasswordInput ? 'Annuler le changement de mot de passe' : 'Changer le mot de passe' }}
       </span>
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
  fullName: '',
  email: '',
  role: 'USER',
  password: ''
})

const showPasswordInput = ref(false)

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = { 
        fullName: newVal.fullName,
        email: newVal.email,
        role: newVal.role,
        password: ''
    }
    showPasswordInput.value = false
  } else {
    form.value = {
      fullName: '',
      email: '',
      role: 'USER',
      password: ''
    }
  }
}, { immediate: true })


const submit = () => {
  const payload: any = {
    fullName: form.value.fullName,
    email: form.value.email,
    role: form.value.role,
  }
  if (form.value.password) {
    payload.password = form.value.password
  }
  emit('submit', payload)
}
</script>
