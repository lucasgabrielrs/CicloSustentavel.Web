<script setup lang="ts">
import CreateEditModal from './CreateEditModal.vue'

interface Product {
  id: number
  name: string
  category: string
  inventoryQuantity: number
  unitOfMeasurement: string
  unitPrice: number
  packagingType: string
  expirationDate?: string
  origin?: string
}

interface Props {
  show: boolean
  product: Product | null
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

function getStatus(product: Product) {
  if (!product.expirationDate)
    return {
      label: 'Estoque OK',
      class: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
    }

  const today = new Date()
  const expDate = new Date(product.expirationDate)
  const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 0)
    return {
      label: 'Vencido',
      class: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    }
  if (diffDays <= 3)
    return {
      label: 'Vence Hoje',
      class: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    }
  if (diffDays <= 7)
    return {
      label: 'Próximo Venc.',
      class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400',
    }
  if (product.inventoryQuantity <= 10)
    return {
      label: 'Estoque Baixo',
      class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
    }
  return {
    label: 'Estoque OK',
    class: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'FrutasVerduras':
      return '🍎'
    case 'Laticinios':
      return '🧀'
    case 'Padaria':
      return '🥖'
    case 'Carnes':
      return '🍖'
    case 'Bebidas':
      return '🥤'
    case 'GraosCereais':
      return '🌾'
    default:
      return '📦'
  }
}
</script>

<template>
  <CreateEditModal :show="show" title="Detalhes do Produto" @close="emit('close')">
    <div v-if="product" class="space-y-6">
      <div class="flex items-center gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div
          class="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-600/20 flex items-center justify-center text-3xl flex-shrink-0"
        >
          {{ getCategoryIcon(product.category) }}
        </div>
        <div>
          <h3 class="text-2xl font-bold text-zinc-800 dark:text-white">{{ product.name }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{{ product.category }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 sm:col-span-1">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Quantidade em Estoque
          </label>
          <p class="text-lg font-semibold text-zinc-800 dark:text-white">
            {{ product.inventoryQuantity }} {{ product.unitOfMeasurement }}
          </p>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Preço Unitário
          </label>
          <p class="text-lg font-semibold text-zinc-800 dark:text-white">
            {{ formatPrice(product.unitPrice) }}
          </p>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Tipo de Embalagem
          </label>
          <p class="text-lg font-semibold text-zinc-800 dark:text-white">
            {{ product.packagingType }}
          </p>
        </div>

        <div class="col-span-2 sm:col-span-1">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Data de Validade
          </label>
          <p class="text-lg font-semibold text-zinc-800 dark:text-white">
            {{ formatDate(product.expirationDate) }}
          </p>
        </div>

        <div class="col-span-2" v-if="product.origin">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Origem
          </label>
          <p class="text-lg font-semibold text-zinc-800 dark:text-white">
            {{ product.origin }}
          </p>
        </div>

        <div class="col-span-2">
          <label
            class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
          >
            Status
          </label>
          <span
            :class="getStatus(product).class"
            class="inline-block px-4 py-2 rounded-full text-sm font-semibold"
          >
            {{ getStatus(product).label }}
          </span>
        </div>
      </div>
    </div>
  </CreateEditModal>
</template>
