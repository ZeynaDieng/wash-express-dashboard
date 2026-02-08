<template>
  <div class="antialiased text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" richColors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>
