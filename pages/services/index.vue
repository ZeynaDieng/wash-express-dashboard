```html
<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Services</h1>
      <button @click="openCreateDrawer" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 self-start md:self-auto">
        <Plus :size="16" />
        Nouveau Service
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un service..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm transition-colors"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Service</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Catégorie</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Prix</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="service in filteredServices" :key="service.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-lg">
                  <component :is="getIcon(service.icon)" v-if="service.icon" :size="18" />
                  <Zap v-else :size="18" />
                </div>
                <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ service.title }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">{{ service.category }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
              {{ service.price ? formatCurrency(service.price) : 'Sur devis' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ActionMenu 
                @view="openViewDrawer(service)"
                @edit="openEditDrawer(service)"
                @delete="deleteService(service.id)"
              />
            </td>
          </tr>
          <tr v-if="filteredServices?.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun service trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" :title="editingService ? 'Modifier Service' : 'Nouveau Service'" @close="closeDrawer">
      <ServiceForm :initial-data="editingService" :loading="loading" @submit="handleFormSubmit" @cancel="closeDrawer" />
    </BaseDrawer>

    <!-- Details Drawer -->
    <BaseDrawer :is-open="isViewDrawerOpen" title="Détails du Service" @close="closeViewDrawer">
      <ServiceDetails v-if="viewingService" :service="viewingService" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Plus, Briefcase, Zap, Home, Settings, Truck, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import ServiceForm from '~/components/services/ServiceForm.vue'
import ServiceDetails from '~/components/services/ServiceDetails.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: services, refresh } = await useFetch<any[]>(`${config.public.apiBase}/services`)

const searchQuery = ref('')

const filteredServices = computed(() => {
  if (!services.value) return []
  return services.value.filter(service => {
    const query = searchQuery.value.toLowerCase()
    return service.title.toLowerCase().includes(query) || 
           service.description?.toLowerCase().includes(query)
  })
})

const isDrawerOpen = ref(false)
const editingService = ref(null)
const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = { Briefcase, Zap, Home, Settings, Truck }
  return icons[iconName] || Briefcase
}

const openCreateDrawer = () => {
  editingService.value = null
  isDrawerOpen.value = true
}

const openEditDrawer = (service: any) => {
  editingService.value = service
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingService.value = null
}

const handleFormSubmit = async (payload: any) => {
  loading.value = true
  try {
    const isEditing = !!editingService.value
    const url = isEditing 
      ? `${config.public.apiBase}/services/${editingService.value.id}`
      : `${config.public.apiBase}/services`
    
    const method = isEditing ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success(isEditing ? 'Service modifié' : 'Service créé')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

const deleteService = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return

  try {
    await $fetch(`${config.public.apiBase}/services/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    toast.success('Service supprimé')
    refresh()
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}

// View Drawer Logic
const isViewDrawerOpen = ref(false)
const viewingService = ref(null)

const openViewDrawer = (service: any) => {
  viewingService.value = service
  isViewDrawerOpen.value = true
}

const closeViewDrawer = () => {
  isViewDrawerOpen.value = false
  viewingService.value = null
}
</script>
