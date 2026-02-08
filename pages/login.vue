<template>
  <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-slate-900">Wash Admin</h1>
      <p class="mt-2 text-sm text-slate-500">Connectez-vous pour gérer la plateforme</p>
    </div>
    
    <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
          <input v-model="form.email" id="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-slate-700">Mot de passe</label>
          <input v-model="form.password" id="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <button type="submit" :disabled="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="loading">Connexion...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value)
    toast.success('Connexion réussie')
    router.push('/')
  } catch (error) {
    toast.error('Identifiants incorrects')
  } finally {
    loading.value = false
  }
}
</script>
