<template>
  <Menu as="div" class="relative inline-block text-left" v-slot="{ open }">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center rounded-md px-2 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 transition-colors"
      >
        <MoreVertical class="h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <TransitionRoot
      :show="!!open"
      as="template"
      enter="transition duration-100 ease-out"
      enter-from="transform scale-95 opacity-0"
      enter-to="transform scale-100 opacity-100"
      leave="transition duration-75 ease-in"
      leave-from="transform scale-100 opacity-100"
      leave-to="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-slate-100 dark:divide-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-xl ring-1 ring-black/5 focus:outline-none transition-colors border border-slate-100 dark:border-slate-700"
      >
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <template v-if="viewUrl || onView">
              <NuxtLink
                v-if="viewUrl"
                :to="viewUrl"
                :class="[
                  active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                <Eye class="mr-2 h-4 w-4 text-slate-400" aria-hidden="true" />
                Voir détails
              </NuxtLink>
              <button
                 v-else
                 @click="onView"
                 :class="[
                  active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300',
                  'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                ]"
              >
                 <Eye class="mr-2 h-4 w-4 text-slate-400" aria-hidden="true" />
                 Voir détails
              </button>
            </template>
          </MenuItem>
        </div>
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="$emit('edit')"
              :class="[
                active ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]"
            >
              <Edit class="mr-2 h-4 w-4 text-blue-500" aria-hidden="true" />
              Modifier
            </button>
          </MenuItem>
        </div>
        <div class="px-1 py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="$emit('delete')"
              :class="[
                active ? 'bg-slate-100 dark:bg-slate-700 text-red-900 dark:text-red-400' : 'text-red-600 dark:text-red-500',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]"
            >
              <Trash2 class="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
              Supprimer
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </TransitionRoot>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem, TransitionRoot } from '@headlessui/vue'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-vue-next'

const props = defineProps({
  viewUrl: {
    type: String,
    default: null
  },
  onView: {
    type: Function as PropType<(e: MouseEvent) => void>,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>
