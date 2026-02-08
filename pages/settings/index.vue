<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Paramètres Système</h1>
      <button @click="openCreateDrawer" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
        <Plus :size="16" />
        Nouveau Paramètre
      </button>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clé</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valeur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="setting in settings" :key="setting.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100 font-mono">{{ setting.key }}</td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" :title="setting.value">{{ setting.value }}</td>
            <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{{ setting.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ActionMenu 
                @view="openViewDrawer(setting)"
                @edit="openEditDrawer(setting)"
                @delete="deleteSetting(setting.id)"
              />
            </td>
          </tr>
          <tr v-if="settings?.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun paramètre trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" :title="editingSetting ? 'Modifier Paramètre' : 'Nouveau Paramètre'" @close="closeDrawer">
      <SettingForm :initial-data="editingSetting" :loading="loading" @submit="handleFormSubmit" @cancel="closeDrawer" />
    </BaseDrawer>

    <!-- Details Drawer -->
    <BaseDrawer :is-open="isViewDrawerOpen" title="Détails du Paramètre" @close="closeViewDrawer">
      <SettingDetails v-if="viewingSetting" :setting="viewingSetting" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import SettingForm from '~/components/settings/SettingForm.vue'
import SettingDetails from '~/components/settings/SettingDetails.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: settings, refresh } = await useFetch<any[]>(`${config.public.apiBase}/settings`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})

const isDrawerOpen = ref(false)
const editingSetting = ref(null)
const loading = ref(false)

const openCreateDrawer = () => {
  editingSetting.value = null
  isDrawerOpen.value = true
}

const openEditDrawer = (setting: any) => {
  editingSetting.value = setting
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingSetting.value = null
}

const isViewDrawerOpen = ref(false)
const viewingSetting = ref(null)

const openViewDrawer = (setting: any) => {
  viewingSetting.value = setting
  isViewDrawerOpen.value = true
}

const closeViewDrawer = () => {
  isViewDrawerOpen.value = false
  viewingSetting.value = null
}

const handleFormSubmit = async (payload: any) => {
  loading.value = true
  try {
    const isEditing = !!editingSetting.value
    const url = isEditing 
      ? `${config.public.apiBase}/settings/${editingSetting.value.id}`
      : `${config.public.apiBase}/settings`
    
    const method = isEditing ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success(isEditing ? 'Paramètre modifié' : 'Paramètre créé')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

const deleteSetting = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) return

  try {
    await $fetch(`${config.public.apiBase}/settings/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    toast.success('Paramètre supprimé')
    refresh()
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}
</script>
