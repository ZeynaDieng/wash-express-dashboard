<template>
  <div class="space-y-6">
    <div v-if="service" class="bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 transition-colors shadow-sm">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors">
            <component :is="getIcon(service.icon)" :size="32" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ service.title }}</h2>
            <span :class="service.category === 'B2B' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'" class="px-2 py-1 rounded-full text-xs font-medium transition-colors">
              {{ service.category === 'B2B' ? 'Entreprises (B2B)' : 'Particuliers (B2C)' }}
            </span>
          </div>
        </div>
        <div class="text-xl font-bold text-slate-900 dark:text-slate-100">
          <span v-if="service.price">{{ formatCurrency(service.price) }}</span>
          <span v-else class="text-slate-400 dark:text-slate-500  font-normal text-base">Sur devis</span>
        </div>
      </div>

      <div class="prose prose-slate max-w-none dark:prose-invert">
        <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Description</h3>
        <p class="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{{ service.description }}</p>
      </div>

      <div v-if="service.unit" class="space-y-2">
        <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100">Unité</h3>
        <p class="text-slate-600 dark:text-slate-300">{{ service.unit }}</p>
      </div>

      <div v-if="service.features && service.features.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100">Avantages & Points Clés</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3 list-none p-0">
          <li v-for="(f, i) in service.features" :key="i" class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            {{ f }}
          </li>
        </ul>
      </div>

      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div>Créé le {{ new Date(service.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(service.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Briefcase, Zap, Home, Settings, Truck, Crown, BedDouble, Layers, ShieldCheck, Droplets } from 'lucide-vue-next'

defineProps({
  service: {
    type: Object,
    required: true
  }
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = { Briefcase, Zap, Home, Settings, Truck, Crown, BedDouble, Layers, ShieldCheck, Droplets }
  return icons[iconName] || Briefcase
}
</script>
