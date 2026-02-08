<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/packs" class="text-slate-500 hover:text-slate-700">
        <ArrowLeft :size="20" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-slate-900">Détails du Pack</h1>
    </div>

    <div v-if="pack" class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-sm" :style="{ backgroundColor: pack.color }">
            {{ pack.name.charAt(0) }}
          </div>
          <h2 class="text-2xl font-bold text-slate-900">{{ pack.name }}</h2>
        </div>
        <div class="flex items-center gap-4">
             <div class="text-sm font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Période de carence : {{ pack.carence }}
             </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl">
        <div class="text-center">
          <div class="text-sm text-slate-500 uppercase font-medium mb-1">Mise</div>
          <div class="text-2xl font-bold text-slate-900">{{ formatCurrency(pack.mise) }}</div>
        </div>
        <div class="text-center">
          <div class="text-sm text-slate-500 uppercase font-medium mb-1">Gain</div>
          <div class="text-2xl font-bold text-green-600">{{ formatCurrency(pack.gain) }}</div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-lg font-medium text-slate-900">Fonctionnalités</h3>
        <ul class="space-y-2">
          <li v-for="(feature, index) in pack.features" :key="index" class="flex items-start gap-3">
            <CheckCircle :size="18" class="text-green-500 mt-1" />
            <span class="text-slate-600">{{ feature }}</span>
          </li>
          <li v-if="!pack.features || pack.features.length === 0" class="text-slate-400 ">Aucune fonctionnalité listée</li>
        </ul>
      </div>

      <div class="pt-6 border-t border-slate-100 flex gap-4 text-sm text-slate-500">
        <div>Créé le {{ new Date(pack.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(pack.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()

const id = route.params.id as string

const { data: pack } = await useFetch<any>(`${config.public.apiBase}/packs/${id}`)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}
</script>
