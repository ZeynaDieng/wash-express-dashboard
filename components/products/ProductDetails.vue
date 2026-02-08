<template>
  <div class="space-y-6">
    <div v-if="product" class="bg-white dark:bg-slate-900 rounded-xl overflow-hidden transition-colors">
      <div class="aspect-w-16 aspect-h-9 w-full bg-slate-100 dark:bg-slate-800 relative max-h-64 flex items-center justify-center overflow-hidden transition-colors">
        <img v-if="product.image" :src="getImageUrl(product.image)" class="max-h-full max-w-full object-contain" />
        <div v-else class="h-full w-full flex items-center justify-center text-slate-400">
          <ShoppingBag :size="48" />
        </div>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ product.name }}</h2>
            <p class="text-slate-500 dark:text-slate-400">{{ product.category }}</p>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(product.price) }}</div>
            <span :class="product.stock > 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium' : 'text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-xs font-medium'">
              {{ product.stock }} en stock
            </span>
          </div>
        </div>

        <div class="prose prose-slate max-w-none dark:prose-invert">
          <h3 class="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Description</h3>
          <p class="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{{ product.description }}</p>
        </div>

        <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>Créé le {{ new Date(product.createdAt).toLocaleDateString() }}</div>
          <div>Dernière modification le {{ new Date(product.updatedAt).toLocaleDateString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

const config = useRuntimeConfig()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase}${path}`
}
</script>
