<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-brand-navy border-r border-white/10 text-white hidden md:flex flex-col flex-shrink-0 transition-colors duration-300">
      <div class="p-6 flex items-center justify-center">
        <img src="/logo.jpg" alt="Wash Express" class="w-32 rounded-xl shadow-lg" />
      </div>
      
      <nav class="flex-1 px-4 space-y-2 overflow-y-auto py-6">
        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <LayoutDashboard :size="18" />
          <span>Tableau de bord</span>
        </NuxtLink>
        
        <div class="pt-6 pb-2 px-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Gestion</div>
        
        <NuxtLink to="/packs" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <Package :size="18" />
          <span>Packs Invest</span>
        </NuxtLink>

        <NuxtLink to="/products" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <ShoppingBag :size="18" />
          <span>Produits</span>
        </NuxtLink>
        
        <NuxtLink to="/services" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <Zap :size="18" />
          <span>Services</span>
        </NuxtLink>

        <NuxtLink to="/transactions" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <CreditCard :size="18" />
          <span>Transactions</span>
        </NuxtLink>

        <div class="pt-6 pb-2 px-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Communauté</div>

        <NuxtLink to="/users" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <Users :size="18" />
          <span>Utilisateurs</span>
        </NuxtLink>

        <div class="pt-6 pb-2 px-4 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Système</div>

        <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <Settings :size="18" />
          <span>Paramètres</span>
        </NuxtLink>

        <NuxtLink to="/contents" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm" active-class="bg-primary text-white shadow-lg shadow-primary/20 font-bold">
          <FileText :size="18" />
          <span>Gestion Contenu</span>
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-white/10">
        <button @click="authStore.logout()" class="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-red-500/80 transition-all text-sm font-bold bg-white/5">
          <LogOut :size="18" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 transition-colors sticky top-0 z-10">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{{ route.name }}</h2>
        <div class="flex items-center gap-6">
          <ThemeToggle />
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ authStore.user?.email }}</div>
              <div class="text-xs text-slate-500 capitalize">{{ authStore.user?.role }}</div>
            </div>
            <div class="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">
              {{ authStore.user?.email?.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Area -->
      <div class="flex-1 overflow-auto p-8 relative">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Zap, CreditCard, FileText } from 'lucide-vue-next'
import ThemeToggle from '~/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const route = useRoute()
</script>
