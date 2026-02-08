<template>
  <div class="space-y-4">
    <div v-for="(value, key) in modelValue" :key="key" class="space-y-1">
      
      <!-- Label (formatted key) -->
      <label v-if="!Array.isArray(modelValue)" class="block text-sm font-medium text-slate-700 capitalize">
        {{ formatKey(key) }}
      </label>

      <!-- Recursion for Objects -->
      <div v-if="isObject(value) && !Array.isArray(value)" class="pl-4 border-l-2 border-slate-200 space-y-4 py-2">
        <DynamicContentForm v-model="modelValue[key]" />
      </div>

      <!-- Arrays -->
      <div v-else-if="Array.isArray(value)" class="space-y-3">
        <div v-for="(item, index) in value" :key="index" class="relative group bg-slate-50 p-4 rounded-lg border border-slate-200">
          <button @click="removeItem(key, index)" class="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 :size="16" />
          </button>
          
          <!-- Recursive call for array items if they are objects -->
          <DynamicContentForm v-if="isObject(item)" v-model="value[index]" />
          
          <!-- Direct input for array items if they are primitives (strings, numbers) -->
          <div v-else>
             <input 
              v-if="typeof item === 'string'"
              v-model="value[index]" 
              type="text" 
              class="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button @click="addItem(key)" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          <Plus :size="14" /> Ajouter un élément
        </button>
      </div>

      <!-- Strings (Text or Image) -->
      <div v-else-if="typeof value === 'string'">
        <!-- Image Detection -->
        <ImageUpload 
          v-if="isImageKey(key) || isImageUrl(value)" 
          v-model="modelValue[key]" 
          :label="formatKey(key)" 
        />
        
        <!-- Long Text (Textarea) -->
        <textarea 
          v-else-if="value.length > 50" 
          v-model="modelValue[key]" 
          rows="3" 
          class="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        
        <!-- Short Text (Input) -->
        <input 
          v-else 
          v-model="modelValue[key]" 
          type="text" 
          class="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Numbers -->
      <div v-else-if="typeof value === 'number'">
        <input 
          v-model.number="modelValue[key]" 
          type="number" 
          class="block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Booleans -->
      <div v-else-if="typeof value === 'boolean'" class="flex items-center gap-2">
        <input 
          v-model="modelValue[key]" 
          type="checkbox" 
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span class="text-sm text-slate-600">{{ value ? 'Activé' : 'Désactivé' }}</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2, Plus } from 'lucide-vue-next'
import ImageUpload from '~/components/ui/ImageUpload.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const isObject = (val: any) => val && typeof val === 'object'

const formatKey = (key: string | number) => {
  if (typeof key === 'number') return `Élément ${key + 1}`
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const isImageKey = (key: string | number) => {
  if (typeof key !== 'string') return false
  const lowerKey = key.toLowerCase()
  return lowerKey.includes('image') || lowerKey.includes('img') || lowerKey.includes('src') || lowerKey.includes('url') || lowerKey.includes('photo') || lowerKey.includes('logo')
}

const isImageUrl = (value: string) => {
  if (typeof value !== 'string') return false
  return value.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || value.startsWith('/images/') || value.startsWith('http')
}

const addItem = (key: string) => {
  const arr = props.modelValue[key] // The array we want to add to
  if (!arr || arr.length === 0) {
      // Best guess: empty string for simple array, empty object for object array
      props.modelValue[key].push("") 
      return
  }
  
  // Clone the structure of the last item
  const template = arr[arr.length - 1]
  let newItem
  
  if (typeof template === 'object') {
     // Deep clone to reset values but keep structure
     newItem = JSON.parse(JSON.stringify(template))
     // Reset string values to empty, numbers to 0
     const resetValues = (obj: any) => {
        Object.keys(obj).forEach(k => {
           if (typeof obj[k] === 'string') obj[k] = ''
           else if (typeof obj[k] === 'number') obj[k] = 0
           else if (typeof obj[k] === 'boolean') obj[k] = false
           else if (typeof obj[k] === 'object') resetValues(obj[k])
        })
     }
     resetValues(newItem)
  } else {
     newItem = ""
  }
  
  props.modelValue[key].push(newItem)
}

const removeItem = (key: string, index: number) => {
  props.modelValue[key].splice(index, 1)
}
</script>
