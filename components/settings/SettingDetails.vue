<template>
  <div class="space-y-6">
    <div v-if="setting" class="bg-white dark:bg-slate-900 rounded-xl p-6 space-y-6 transition-colors shadow-sm">
      <div>
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2 transition-colors">
            Clé
            <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700 transition-colors">IMMUTABLE</span>
        </h2>
        <div class="mt-2 text-slate-800 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            {{ setting.key }}
        </div>
      </div>

      <div>
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">Valeur</h2>
        <div class="mt-2 text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors min-h-[60px]">
            {{ setting.value }}
        </div>
      </div>

      <div v-if="setting.description">
        <h2 class="text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors">Description</h2>
        <p class="mt-2 text-slate-600 dark:text-slate-400 transition-colors">{{ setting.description }}</p>
      </div>

      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 text-sm text-slate-500 dark:text-slate-400 transition-colors">
        <div>Créé le {{ new Date(setting.createdAt).toLocaleDateString() }}</div>
        <div>Dernière modification le {{ new Date(setting.updatedAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  setting: {
    type: Object,
    required: true
  }
})
</script>
