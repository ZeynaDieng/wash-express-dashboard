<template>
  <div class="space-y-6">
    <div v-if="user" class="bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 transition-colors shadow-sm">
      <div class="flex items-center justify-between">
         <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300 transition-colors">
              {{ (user.firstName || user.email).charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">
                {{ user.firstName }} {{ user.lastName }}
              </h2>
              <div class="text-slate-500 dark:text-slate-400 transition-colors">{{ user.email }}</div>
            </div>
         </div>
         <div>
            <span :class="user.role === 'ADMIN' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
                {{ user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur' }}
            </span>
         </div>
      </div>

      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
        <div>Inscrit le {{ new Date(user.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(user.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>
