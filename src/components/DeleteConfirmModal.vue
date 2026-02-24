<script setup lang="ts">
import CreateEditModal from './CreateEditModal.vue'

interface Props {
  show: boolean
  productName?: string
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
</script>

<template>
  <CreateEditModal :show="show" title="Confirmar exclusão" @close="emit('close')">
    <div class="space-y-5">
      <div class="flex items-start gap-3">
        <div
          class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 flex-shrink-0"
        >
          ⚠️
        </div>
        <div>
          <p class="text-zinc-800 dark:text-zinc-200 font-semibold">Deseja excluir este produto?</p>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Esta ação não poderá ser desfeita.
          </p>
          <p v-if="productName" class="text-sm text-zinc-600 dark:text-zinc-300 mt-3">
            Produto: <span class="font-semibold">{{ productName }}</span>
          </p>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="button"
          @click="emit('close')"
          class="flex-1 px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="emit('confirm')"
          class="flex-1 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all"
        >
          Excluir
        </button>
      </div>
    </div>
  </CreateEditModal>
</template>
