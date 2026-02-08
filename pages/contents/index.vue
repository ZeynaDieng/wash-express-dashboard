<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestion du Contenu</h1>
      <button @click="refresh" class="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Actualiser">
        <RefreshCw :size="18" :class="{ 'animate-spin': pending }" />
      </button>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Section</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dernière Mise à jour</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="content in contents" :key="content.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate" :title="formatSectionName(content.key)">
                {{ formatSectionName(content.key) }}
              </div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">{{ content.key }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{{ content.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
              {{ new Date(content.updatedAt).toLocaleString('fr-FR') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditDrawer(content)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Modifier</button>
            </td>
          </tr>
          <tr v-if="contents?.length === 0">
            <td colspan="4" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun contenu trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" title="Modifier le Contenu" @close="closeDrawer">
      <div v-if="editingContent" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest">Clé (Lecture seule)</label>
          <input :value="editingContent.key" disabled class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-500 font-mono text-sm cursor-not-allowed" />
        </div>

        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-widest">Données du Contenu</label>
          <div class="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <DynamicContentForm v-model="editingContentData" />
          </div>
        </div>

        <div class="pt-4 flex items-center gap-4">
          <button 
            @click="handleSave" 
            :disabled="loading" 
            class="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
          <button @click="closeDrawer" class="px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import DynamicContentForm from '~/components/content/DynamicContentForm.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: contents, refresh, pending } = await useFetch<any[]>(`${config.public.apiBase}/contents`, {
    headers: {
        Authorization: `Bearer ${authStore.token}`
    }
})

const isDrawerOpen = ref(false)
const editingContent = ref(null)
const editingContentData = ref({}) // Holds the object being edited by DynamicContentForm
const loading = ref(false)

const openEditDrawer = (content: any) => {
  editingContent.value = content
  // Deep clone to avoid mutating original data before save
  editingContentData.value = JSON.parse(JSON.stringify(content.data))
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingContent.value = null
  editingContentData.value = {}
}

const sectionNames: Record<string, string> = {
  'home.hero': 'Page d\'Accueil - Bannière Principale',
  'home.expertise': 'Page d\'Accueil - Notre Expertise',
  'about.mission': 'À Propos - Notre Mission',
  'about.why_choose': 'À Propos - Pourquoi Nous Choisir',
  'about.educational': 'À Propos - Éducatif',
  'services_b2c.hero': 'Services B2C - Bannière',
  'invest_packs.hero': 'Investissement Packs - Bannière',
  'vision.intro': 'Vision - Introduction',
  'how_it_works.steps': 'Comment Ça Marche - Étapes',
  'contact.info': 'Contact - Informations',
  'global.footer': 'Pied de Page (Footer)',
  'global.disclaimer': 'Avertissement (Disclaimer)',
  'legal.sections': 'Mentions Légales',
  'privacy.sections': 'Politique de Confidentialité'
}

const formatSectionName = (key: string) => {
  return sectionNames[key] || key.replace(/_/g, ' ').replace(/\./g, ' - ').replace(/\b\w/g, l => l.toUpperCase())
}

const handleSave = async () => {
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/contents/${editingContent.value.key}`, {
      method: 'PATCH',
      body: { data: editingContentData.value },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success('Contenu mis à jour avec succès')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de la mise à jour')
  } finally {
    loading.value = false
  }
}
</script>
