<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/services" class="text-slate-500 hover:text-slate-700">
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900">Détails du Service</h1>
    </div>

    <div v-if="service" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <component :is="getIcon(service.icon)" :size="32" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-slate-900">{{ service.title }}</h2>
            <span :class="service.category === 'B2B' ? 'bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium' : 'bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium'">
              {{ service.category === 'B2B' ? 'Entreprises (B2B)' : 'Particuliers (B2C)' }}
            </span>
          </div>
        </div>
        <div class="text-xl font-bold text-slate-900">
          <span v-if="service.price">{{ formatCurrency(service.price) }}</span>
          <span v-else class="text-slate-400  font-normal text-base">Sur devis</span>
        </div>
      </div>

      <div class="prose prose-slate max-w-none">
        <h3 class="text-lg font-medium text-slate-900 mb-2">Description</h3>
        <p class="text-slate-600 whitespace-pre-wrap">{{ service.description }}</p>
      </div>

      <div class="pt-6 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
        <div>Créé le {{ new Date(service.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(service.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Briefcase, Zap, Home, Settings, Truck } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()

const id = route.params.id as string

const { data: service } = await useFetch<any>(`${config.public.apiBase}/services/${id}`)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = { Briefcase, Zap, Home, Settings, Truck }
  return icons[iconName] || Briefcase
}
</script>
