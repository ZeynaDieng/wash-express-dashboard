<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-slate-700">{{ label }}</label>
    
    <div v-if="previewUrl" class="relative group w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
      <img :src="previewUrl" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
        <button @click.prevent="removeImage" class="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <div v-else @click="triggerFileInput" class="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer bg-slate-50">
      <UploadCloud :size="24" class="mb-2" />
      <span class="text-sm font-medium">Cliquer pour uploader</span>
      <span class="text-xs text-slate-400 mt-1">PNG, JPG jusqu'à 5MB</span>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
    <div v-if="uploading" class="text-xs text-blue-600 animate-pulse">Upload en cours...</div>
  </div>
</template>

<script setup lang="ts">
import { UploadCloud, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: 'Image'
  }
})

const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  if (props.modelValue.startsWith('http') || props.modelValue.startsWith('blob:')) return props.modelValue
  return `${config.public.apiBase}${props.modelValue}`
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image trop volumineuse (> 5MB)')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  uploading.value = true
  try {
    const response: any = await $fetch(`${config.public.apiBase}/upload`, {
      method: 'POST',
      body: formData
    })
    
    emit('update:modelValue', response.url)
    toast.success('Image uploadée')
  } catch (error) {
    toast.error('Erreur lors de l\'upload')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const removeImage = () => {
  emit('update:modelValue', '')
}
</script>
