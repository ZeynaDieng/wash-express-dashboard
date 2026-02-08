<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/users" class="text-slate-500 hover:text-slate-700">
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900">Détails de l'Utilisateur</h1>
    </div>

    <div v-if="user" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
              {{ user.fullName.charAt(0) }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900">{{ user.fullName }}</h2>
              <div class="text-slate-500">{{ user.email }}</div>
            </div>
         </div>
         <div>
            <span :class="user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium' : 'bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium'">
                {{ user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur' }}
            </span>
         </div>
      </div>

      <div class="pt-6 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
        <div>Inscrit le {{ new Date(user.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(user.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const id = route.params.id as string

const { data: user } = await useFetch<any>(`${config.public.apiBase}/users/${id}`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})
</script>
