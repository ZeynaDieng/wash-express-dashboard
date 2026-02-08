<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/products" class="text-slate-500 hover:text-slate-700">
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900">Détails du Produit</h1>
    </div>

    <div v-if="product" class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="aspect-w-16 aspect-h-9 w-full bg-slate-100 relative h-64">
        <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
          <ShoppingBag :size="48" />
        </div>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">{{ product.name }}</h2>
            <p class="text-slate-500">{{ product.category }}</p>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold text-slate-900">{{ formatCurrency(product.price) }}</div>
            <span :class="product.stock > 0 ? 'text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium' : 'text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium'">
              {{ product.stock }} en stock
            </span>
          </div>
        </div>

        <div class="prose prose-slate max-w-none">
          <h3 class="text-lg font-medium text-slate-900 mb-2">Description</h3>
          <p class="text-slate-600 whitespace-pre-wrap">{{ product.description }}</p>
        </div>

        <div class="pt-6 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
          <div>Créé le {{ new Date(product.createdAt).toLocaleDateString() }}</div>
          <div>Dernière modification le {{ new Date(product.updatedAt).toLocaleDateString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ShoppingBag } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()

const id = route.params.id as string

const { data: product } = await useFetch<any>(`${config.public.apiBase}/products/${id}`)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}
</script>
