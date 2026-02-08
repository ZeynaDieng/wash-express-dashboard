<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Produits Boutique</h1>
      <button @click="openCreateDrawer" class="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 self-start md:self-auto">
        <Plus :size="16" />
        Nouveau Produit
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <div class="relative flex-1 w-full">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un produit..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm transition-colors"
        />
      </div>
      <div class="relative w-full sm:w-48">
        <Filter class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
        <select 
          v-model="selectedCategory" 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-slate-200 text-sm appearance-none transition-colors"
        >
          <option value="">Toutes catégories</option>
          <option value="Detergents">Détergents</option>
          <option value="Accessoires">Accessoires</option>
          <option value="Services">Services</option>
        </select>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Produit</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Prix</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Catégorie</th>
            <th class="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                  <img v-if="product.image" :src="getImageUrl(product.image)" class="h-full w-full object-cover" />
                  <div v-else class="h-full w-full flex items-center justify-center text-slate-400">
                    <ShoppingBag :size="16" />
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ product.name }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">{{ formatCurrency(product.price) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="product.stock > 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium' : 'text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full text-xs font-medium text-red-500'">
                {{ product.stock }} en stock
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-100">
              <span class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs">{{ product.category || '-' }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ActionMenu 
                @view="openViewDrawer(product)"
                @edit="openEditDrawer(product)"
                @delete="deleteProduct(product.id)"
              />
            </td>
          </tr>
          <tr v-if="filteredProducts?.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Aucun produit trouvé</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Drawer -->
    <BaseDrawer :is-open="isDrawerOpen" :title="editingProduct ? 'Modifier Produit' : 'Nouveau Produit'" @close="closeDrawer">
      <ProductForm :initial-data="editingProduct" :loading="loading" @submit="handleFormSubmit" @cancel="closeDrawer" />
    </BaseDrawer>

    <!-- Details Drawer -->
    <BaseDrawer :is-open="isViewDrawerOpen" title="Détails du Produit" @close="closeViewDrawer">
      <ProductDetails v-if="viewingProduct" :product="viewingProduct" />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { Plus, ShoppingBag, Search, Filter } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import BaseDrawer from '~/components/ui/BaseDrawer.vue'
import ProductForm from '~/components/products/ProductForm.vue'
import ProductDetails from '~/components/products/ProductDetails.vue'
import ActionMenu from '~/components/ui/ActionMenu.vue'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: products, refresh } = await useFetch<any[]>(`${config.public.apiBase}/products`)

const searchQuery = ref('')
const selectedCategory = ref('')

const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const isDrawerOpen = ref(false)
const editingProduct = ref(null)
const loading = ref(false)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(value)
}

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${config.public.apiBase}${path}`
}

const openCreateDrawer = () => {
  editingProduct.value = null
  isDrawerOpen.value = true
}

const openEditDrawer = (product: any) => {
  editingProduct.value = product
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  editingProduct.value = null
}

const handleFormSubmit = async (payload: any) => {
  loading.value = true
  try {
    const isEditing = !!editingProduct.value
    const url = isEditing 
      ? `${config.public.apiBase}/products/${editingProduct.value.id}`
      : `${config.public.apiBase}/products`
    
    const method = isEditing ? 'PATCH' : 'POST'

    await $fetch(url, {
      method,
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    toast.success(isEditing ? 'Produit modifié' : 'Produit créé')
    refresh()
    closeDrawer()
  } catch (error) {
    toast.error('Erreur lors de l\'enregistrement')
  } finally {
    loading.value = false
  }
}

const deleteProduct = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    toast.success('Produit supprimé')
    refresh()
  } catch (error) {
    toast.error('Erreur lors de la suppression')
  }
}

// View Drawer Logic
const isViewDrawerOpen = ref(false)
const viewingProduct = ref(null)

const openViewDrawer = (product: any) => {
  viewingProduct.value = product
  isViewDrawerOpen.value = true
}

const closeViewDrawer = () => {
  isViewDrawerOpen.value = false
  viewingProduct.value = null
}
</script>
