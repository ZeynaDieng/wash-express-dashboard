<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Utilisateurs</h1>
      <button @click="openCreateDrawer" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 self-start md:self-auto">
        <Plus :size="16" />
        Nouvel Utilisateur
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher par nom ou email..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm transition-colors"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Utilisateur</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rôle</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-slate-900 dark:text-slate-100">
                <div v-if="user.fullName">{{ user.fullName }}</div>
                <div v-else class="text-slate-400  font-normal">Sans nom</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-100">
              <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs capitalize">{{ user.role }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ActionMenu 
                @view="openViewDrawer(user)"
                @edit="openEditDrawer(user)"
                @delete="deleteUser(user.id)"
              />
            </td>
          </tr>
          <tr v-if="filteredUsers?.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun utilisateur trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" :title="editingUser ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'" @close="closeDrawer">
      <UserForm :initial-data="editingUser" :loading="loading" @submit="handleFormSubmit" @cancel="closeDrawer" />
    </BaseDrawer>

    <!-- Details Drawer -->
    <BaseDrawer :is-open="isViewDrawerOpen" title="Détails de l'Utilisateur" @close="closeViewDrawer">
      <UserDetails v-if="viewingUser" :user="viewingUser" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import UserForm from '~/components/users/UserForm.vue'
import UserDetails from '~/components/users/UserDetails.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: users, refresh } = await useFetch<any[]>(`${config.public.apiBase}/users`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!users.value) return []
  return users.value.filter(user => {
    const query = searchQuery.value.toLowerCase()
    return (user.fullName || '').toLowerCase().includes(query) || 
           (user.email || '').toLowerCase().includes(query)
  })
})

const isDrawerOpen = ref(false)
const editingUser = ref(null)
const loading = ref(false)

const openCreateDrawer = () => {
  editingUser.value = null
  isDrawerOpen.value = true
}

const openEditDrawer = (user: any) => {
  editingUser.value = user
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingUser.value = null
}

const handleFormSubmit = async (payload: any) => {
  loading.value = true
  try {
    const isEditing = !!editingUser.value
    const url = isEditing 
      ? `${config.public.apiBase}/users/${editingUser.value.id}`
      : `${config.public.apiBase}/users`
    
    const method = isEditing ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success(isEditing ? 'Utilisateur modifié' : 'Utilisateur créé')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

  try {
    await $fetch(`${config.public.apiBase}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    toast.success('Utilisateur supprimé')
    refresh()
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}

// View Drawer Logic
const isViewDrawerOpen = ref(false)
const viewingUser = ref(null)

const openViewDrawer = (user: any) => {
  viewingUser.value = user
  isViewDrawerOpen.value = true
}

const closeViewDrawer = () => {
  isViewDrawerOpen.value = false
  viewingUser.value = null
}
</script>
