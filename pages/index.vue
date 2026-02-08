<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Vue d'ensemble</h1>
      <div class="text-sm text-slate-500 dark:text-slate-400">Dernière mise à jour: {{ new Date().toLocaleDateString() }}</div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.name" class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div class="flex items-center justify-between mb-4">
          <div :class="[stat.color, 'p-2 rounded-lg bg-opacity-10']">
            <component :is="stat.icon" :size="20" :class="stat.iconColor" />
          </div>
          <div :class="[stat.trend > 0 ? 'text-green-500' : 'text-red-500', 'text-xs font-medium flex items-center gap-1']">
            <span>{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%</span>
            <TrendingUp v-if="stat.trend > 0" :size="12" />
            <TrendingDown v-else :size="12" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.name }}</h3>
        <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stat.value }}</div>
        
        <!-- Sparkline simulation -->
        <div class="mt-4 h-8 flex items-end gap-1">
          <div v-for="i in 12" :key="i" 
               :style="{ height: Math.random() * 100 + '%' }" 
               class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-sm hover:bg-blue-400 dark:hover:bg-blue-500 transition-all duration-300">
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors overflow-hidden">
        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 class="font-bold text-slate-900 dark:text-slate-100">Activité Récente</h3>
          <button class="text-xs text-blue-500 hover:underline">Tout voir</button>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-800">
          <div v-for="activity in recentActivity" :key="activity.id" class="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div :class="[activity.color, 'h-10 w-10 rounded-full flex items-center justify-center bg-opacity-10']">
              <component :is="activity.icon" :size="18" :class="activity.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ activity.subtitle }}</p>
            </div>
            <div class="text-xs text-slate-400">{{ activity.time }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions / Reports -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
          <div class="relative z-10">
            <h3 class="font-bold text-lg mb-2">Performance du mois</h3>
            <p class="text-blue-100 text-sm mb-4">Votre chiffre d'affaires a augmenté de 15% par rapport au mois dernier.</p>
            <button class="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Générer Rapport</button>
          </div>
          <div class="absolute -right-4 -bottom-4 opacity-10">
            <TrendingUp :size="120" />
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors p-6">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm">Répartition par Catégorie</h3>
          <div class="space-y-4">
            <div v-for="cat in categories" :key="cat.name">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-slate-600 dark:text-slate-400">{{ cat.name }}</span>
                <span class="font-bold text-slate-900 dark:text-slate-100">{{ cat.value }}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                <div :class="cat.color" class="h-1.5 rounded-full transition-all duration-1000" :style="{ width: cat.value + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, ShoppingBag, Package, TrendingUp, TrendingDown, 
  CreditCard, Zap, UserPlus, ShoppingCart, Loader2
} from 'lucide-vue-next'

useHead({
  title: 'Dashboard - Wash Admin'
})

const config = useRuntimeConfig()
const authStore = useAuthStore()
const { token } = storeToRefs(authStore)

// Fetch Data
const { data: users, pending: usersPending } = await useFetch<any[]>('/users', {
  baseURL: config.public.apiBase,
  headers: {
    Authorization: `Bearer ${token.value}`
  }
})

const { data: transactions, pending: txPending } = await useFetch<any[]>('/payment', {
  baseURL: config.public.apiBase,
  // Payment endpoint is public for now, but good to have auth ready
})

// Computations
const totalUsers = computed(() => users.value?.length || 0)

const confirmedTransactions = computed(() => 
  transactions.value?.filter(t => t.status === 'COMPLETED' || t.status === 'SUCCESS' || t.status === 'INITIALIZED') || []
)

const totalSales = computed(() => 
  confirmedTransactions.value.reduce((acc, t) => acc + Number(t.item_price), 0)
)

const totalInvestments = computed(() => 
  confirmedTransactions.value.filter(t => t.item_name.toLowerCase().includes('pack') || t.command_name.toLowerCase().includes('invest')).length
)

const conversionRate = computed(() => {
  if (!users.value?.length) return 0
  return ((confirmedTransactions.value.length / users.value.length) * 100).toFixed(1)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)
}

const stats = computed(() => [
  { name: 'Utilisateurs', value: totalUsers.value, trend: 12, icon: Users, color: 'bg-blue-500', iconColor: 'text-blue-500' },
  { name: 'Chiffre d\'affaires', value: formatCurrency(totalSales.value), trend: 8, icon: ShoppingBag, color: 'bg-purple-500', iconColor: 'text-purple-500' },
  { name: 'Investissements', value: totalInvestments.value + ' Packs', trend: -3, icon: Package, color: 'bg-amber-500', iconColor: 'text-amber-500' },
  { name: 'Conversion', value: conversionRate.value + '%', trend: 5, icon: Zap, color: 'bg-green-500', iconColor: 'text-green-500' }
])

// Recent Activity (Merge Users & Transactions)
const recentActivity = computed(() => {
  const allActivity = [
    ...(users.value?.map(u => ({
      id: u.id,
      type: 'user',
      title: 'Nouvel utilisateur',
      subtitle: `${u.fullName || u.email} s'est inscrit(e)`,
      date: new Date(u.createdAt),
      icon: UserPlus,
      color: 'bg-purple-500',
      iconColor: 'text-purple-500'
    })) || []),
    ...(transactions.value?.map(t => ({
      id: t.id,
      type: 'transaction',
      title: `Transaction ${t.status}`,
      subtitle: `${t.item_name} - ${formatCurrency(t.item_price)}`,
      date: new Date(t.createdAt),
      icon: t.item_name.toLowerCase().includes('pack') ? Package : CreditCard,
      color: t.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500',
      iconColor: t.status === 'COMPLETED' ? 'text-green-500' : 'text-blue-500'
    })) || [])
  ]

  return allActivity
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
    .map(a => ({
      ...a,
      time: useTimeAgo(a.date).value // Using vueuse if available, otherwise simplified format
    }))
})

// Categories (Simulated for now as we don't have product categories explicitly in transactions yet)
const categories = [
  { name: 'Boutique', value: 45, color: 'bg-blue-500' },
  { name: 'Packs Invest', value: 35, color: 'bg-purple-500' },
  { name: 'Services Pro', value: 20, color: 'bg-amber-500' }
]

import { useTimeAgo } from '@vueuse/core'
</script>
