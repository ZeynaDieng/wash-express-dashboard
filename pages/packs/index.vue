<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Packs d'Investissement</h1>
      <button @click="openCreateDrawer" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 self-start md:self-auto">
        <Plus :size="16" />
        Nouveau Pack
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un pack..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm transition-colors"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Pack</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Prix d'entrée</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rendement</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="pack in filteredPacks" :key="pack.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-lg">
                  <Package :size="18" />
                </div>
                <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ pack.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">{{ pack.mise ? formatCurrency(pack.mise) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-bold">{{ pack.gain ? formatCurrency(pack.gain) : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ActionMenu 
                @view="openViewDrawer(pack)"
                @edit="openEditDrawer(pack)"
                @delete="deletePack(pack.id)"
              />
            </td>
          </tr>
          <tr v-if="filteredPacks.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun pack trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" :title="editingPack ? 'Modifier Pack' : 'Nouveau Pack'" @close="closeDrawer">
      <PackForm :initial-data="editingPack" :loading="loading" @submit="handleFormSubmit" @cancel="closeDrawer" />
    </BaseDrawer>

    <!-- Details Drawer -->
    <BaseDrawer :is-open="isViewDrawerOpen" title="Détails du Pack" @close="closeViewDrawer">
      <PackDetails v-if="viewingPack" :pack="viewingPack" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import PackForm from '~/components/packs/PackForm.vue'
import PackDetails from '~/components/packs/PackDetails.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: packs, refresh } = await useFetch<any[]>(`${config.public.apiBase}/packs`)

const searchQuery = ref('')

const filteredPacks = computed(() => {
  if (!packs.value) return []
  return packs.value.filter(pack => {
    return pack.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const isDrawerOpen = ref(false)
const editingPack = ref(null)
const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const openCreateDrawer = () => {
  editingPack.value = null
  isDrawerOpen.value = true
}

const openEditDrawer = (pack: any) => {
  editingPack.value = pack
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingPack.value = null
}

const handleFormSubmit = async (payload: any) => {
  loading.value = true
  try {
    const isEditing = !!editingPack.value
    const url = isEditing 
      ? `${config.public.apiBase}/packs/${editingPack.value.id}`
      : `${config.public.apiBase}/packs`
    
    const method = isEditing ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success(isEditing ? 'Pack modifié' : 'Pack créé')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

const deletePack = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) return

  try {
    await $fetch(`${config.public.apiBase}/packs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    toast.success('Pack supprimé')
    refresh()
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}

// View Drawer Logic
const isViewDrawerOpen = ref(false)
const viewingPack = ref(null)

const openViewDrawer = (pack: any) => {
  viewingPack.value = pack
  isViewDrawerOpen.value = true
}

const closeViewDrawer = () => {
  isViewDrawerOpen.value = false
  viewingPack.value = null
}
</script>
