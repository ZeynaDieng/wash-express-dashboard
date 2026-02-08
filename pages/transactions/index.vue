<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Transactions</h1>
      <div class="flex items-center gap-2">
        <button @click="handleRefresh" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Actualiser">
          <RefreshCw :size="18" :class="{ 'animate-spin': pending }" />
        </button>
      </div>
    </div>

    <!-- Stats Summary for Transactions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in transStats" :key="stat.label" class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
        <div class="text-sm text-slate-500 dark:text-slate-400 font-medium">{{ stat.label }}</div>
        <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors flex flex-col md:flex-row gap-4 items-center">
      <div class="relative flex-1 w-full">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par référence ou article..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm transition-colors"
        />
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <Filter class="text-slate-400" :size="18" />
        <select 
          v-model="statusFilter"
          class="bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm py-2 px-4 transition-colors w-full md:w-auto"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="INITIALIZED">Initialisée</option>
          <option value="SUCCESS">Succès</option>
          <option value="FAILED">Échec</option>
        </select>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Référence</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Article</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Montant</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="tx in filteredTransactions" :key="tx.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600 dark:text-slate-300">
              {{ tx.ref_command }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ tx.item_name }}</div>
              <div v-if="tx.command_name" class="text-xs text-slate-500 dark:text-slate-400">{{ tx.command_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 font-bold">
              {{ formatCurrency(tx.item_price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClasses(tx.status)">
                {{ tx.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
              {{ new Date(tx.createdAt).toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openDetails(tx)" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                Détails
              </button>
            </td>
          </tr>
          <tr v-if="filteredTransactions?.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucune transaction trouvée</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" title="Détails de la Transaction" @close="closeDrawer">
      <div v-if="selectedTx" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p class="text-xs text-slate-500 mb-1">ID Interne</p>
            <p class="text-sm font-medium dark:text-slate-200 truncate">{{ selectedTx.id }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <p class="text-xs text-slate-500 mb-1">Référence Commande</p>
            <p class="text-sm font-medium dark:text-slate-200">{{ selectedTx.ref_command }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 border-b dark:border-slate-800 pb-2">Informations Article</h4>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Nom:</span>
            <span class="text-sm font-medium dark:text-slate-200">{{ selectedTx.item_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Montant:</span>
            <span class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ formatCurrency(selectedTx.item_price) }}</span>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 border-b dark:border-slate-800 pb-2">PayTech Info</h4>
          <div class="flex justify-between">
            <span class="text-sm text-slate-500">Token:</span>
            <span class="text-sm font-mono dark:text-slate-200">{{ selectedTx.token || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-2">
            <span class="text-sm text-slate-500">Lien de redirection:</span>
            <a v-if="selectedTx.redirect_url" :href="selectedTx.redirect_url" target="_blank" class="text-xs text-blue-500 truncate hover:underline">
              {{ selectedTx.redirect_url }}
            </a>
            <span v-else class="text-sm dark:text-slate-400">N/A</span>
          </div>
        </div>

        <div v-if="selectedTx.custom_field" class="space-y-4">
          <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 border-b dark:border-slate-800 pb-2">Données Personnalisées</h4>
          <pre class="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs dark:text-slate-300 overflow-x-auto">{{ JSON.stringify(selectedTx.custom_field, null, 2) }}</pre>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Search, Filter, RefreshCw } from 'lucide-vue-next'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: transactions, refresh, pending } = await useFetch<any[]>(`${config.public.apiBase}/payment`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})

const searchQuery = ref('')
const statusFilter = ref('')
const isDrawerOpen = ref(false)
const selectedTx = ref<any>(null)

const handleRefresh = async () => {
  await refresh()
}

const filteredTransactions = computed(() => {
  if (!transactions.value) return []
  return transactions.value.filter(tx => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = tx.ref_command.toLowerCase().includes(query) || 
                          tx.item_name.toLowerCase().includes(query)
    const matchesStatus = !statusFilter.value || tx.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const transStats = computed(() => {
  if (!transactions.value) return []
  const total = transactions.value.length
  const success = transactions.value.filter(t => t.status === 'SUCCESS').length
  const volume = transactions.value
    .filter(t => t.status === 'SUCCESS' || t.status === 'INITIALIZED')
    .reduce((acc, curr) => acc + Number(curr.item_price), 0)

  return [
    { label: 'Total Transactions', value: total },
    { label: 'Réussies', value: success },
    { label: 'Volume d\'affaires', value: formatCurrency(volume) }
  ]
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getStatusClasses = (status: string) => {
  const base = 'px-2 py-1 rounded-full text-xs font-medium '
  switch (status) {
    case 'SUCCESS': return base + 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    case 'FAILED': return base + 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    case 'INITIALIZED': return base + 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    case 'PENDING': return base + 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    default: return base + 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
  }
}

const openDetails = (tx: any) => {
  selectedTx.value = tx
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  selectedTx.value = null
}
</script>
