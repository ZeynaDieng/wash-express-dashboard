<template>
  <div class="space-y-6">
    <div v-if="pack" class="bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 transition-colors shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white dark:border-slate-800 shadow-sm transition-colors" :style="{ backgroundColor: pack.color }">
            {{ pack.name.charAt(0) }}
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ pack.name }}</h2>
        </div>
        <div class="flex items-center gap-4">
             <div class="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
                Période de carence : {{ pack.carence }}
             </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
        <div class="text-center">
          <div class="text-sm text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">Mise</div>
          <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">{{ formatCurrency(pack.mise) }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-slate-500 dark:text-slate-400 uppercase font-medium mb-1">Gain</div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors">{{ formatCurrency(pack.gain) }}</div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100">Fonctionnalités</h3>
        <ul class="space-y-2">
          <li v-for="(feature, index) in pack.features" :key="index" class="flex items-start gap-3">
            <CheckCircle :size="18" class="text-green-500 mt-1" />
            <span class="text-slate-600 dark:text-slate-300 transition-colors">{{ feature }}</span>
          </li>
          <li v-if="!pack.features || pack.features.length === 0" class="text-slate-400 dark:text-slate-500 ">Aucune fonctionnalité listée</li>
        </ul>
      </div>

      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div>Créé le {{ new Date(pack.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(pack.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next'

defineProps({
  pack: {
    type: Object,
    required: true
  }
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}
</script>
