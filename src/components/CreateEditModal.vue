<script setup lang="ts">
interface Props {
  show: boolean
  title: string
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
      >
        <div
          class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex justify-between items-center"
        >
          <h2 class="text-xl font-bold text-zinc-800 dark:text-white">{{ title }}</h2>
          <button
            @click="emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
