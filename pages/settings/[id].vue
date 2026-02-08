<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/settings" class="text-slate-500 hover:text-slate-700">
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900">Détails du Paramètre</h1>
    </div>

    <div v-if="setting" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div>
        <h2 class="text-lg font-medium text-slate-900 flex items-center gap-2">
            Clé
            <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">IMMUTABLE</span>
        </h2>
        <div class="mt-2 text-slate-800 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
            {{ setting.key }}
        </div>
      </div>

      <div>
        <h2 class="text-lg font-medium text-slate-900">Valeur</h2>
        <div class="mt-2 text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-[60px]">
            {{ setting.value }}
        </div>
      </div>

      <div v-if="setting.description">
        <h2 class="text-lg font-medium text-slate-900">Description</h2>
        <p class="mt-2 text-slate-600">{{ setting.description }}</p>
      </div>

      <div class="pt-6 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
        <div>Créé le {{ new Date(setting.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(setting.updatedAt).toLocaleDateString() }}</div>
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

const { data: setting } = await useFetch<any>(`${config.public.apiBase}/settings/${id}`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})
</script>
