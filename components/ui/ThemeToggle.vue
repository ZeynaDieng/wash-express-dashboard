<template>
  <button
    @click="toggleColorMode"
    class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
    :title="colorMode.value === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'"
  >
    <Sun v-if="colorMode.value === 'dark'" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
