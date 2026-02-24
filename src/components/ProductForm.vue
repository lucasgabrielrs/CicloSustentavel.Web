<script setup lang="ts">
import { ref, watch } from 'vue'
import { api } from '@/services/api'

interface ProductFormData {
  id?: number
  name: string
  unitPrice: number
  description?: string
  inventoryQuantity: number
  expirationDate: string
  category: string
  unitOfMeasurement: string
  origin: string
  packagingType: string
}

interface Props {
  product?: ProductFormData | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: []
  close: []
}>()

const form = ref<ProductFormData>({
  name: '',
  unitPrice: 0,
  description: '',
  inventoryQuantity: 0,
  expirationDate: '',
  category: '0',
  unitOfMeasurement: '0',
  origin: 'Local',
  packagingType: '0',
})

const loading = ref(false)
const error = ref('')

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      form.value = { ...newProduct }
    } else {
      form.value = {
        name: '',
        unitPrice: 0,
        inventoryQuantity: 0,
        expirationDate: '',
        category: '0',
        unitOfMeasurement: '0',
        origin: 'Local',
        packagingType: '0',
        description: '',
      }
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (props.product?.id) {
      await api.put(`/Products/${props.product.id}`, form.value)
    } else {
      await api.post('/Products', form.value)
    }
    emit('success')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao salvar produto'
    console.error('Erro ao salvar produto:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div
      v-if="error"
      class="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
    >
      {{ error }}
    </div>

    <div>
      <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        Nome do Produto
      </label>
      <input
        v-model="form.name"
        type="text"
        required
        class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        placeholder="Ex: Pão Francês"
      />
    </div>

    <div>
      <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        Descrição do Produto
      </label>
      <input
        v-model="form.description"
        type="text"
        required
        class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        placeholder="Descrição breve do produto, suas características e diferenciais..."
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Preço Unitário (R$)
        </label>
        <input
          v-model.number="form.unitPrice"
          type="number"
          step="0.01"
          required
          min="0"
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
          placeholder="0,00"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Quantidade em Estoque
        </label>
        <input
          v-model.number="form.inventoryQuantity"
          type="number"
          required
          min="0"
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
          placeholder="0"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        Data de Validade
      </label>
      <input
        v-model="form.expirationDate"
        type="datetime-local"
        required
        class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Categoria
        </label>
        <select
          v-model="form.category"
          required
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        >
          <option value="0">FrutasVerduras</option>
          <option value="1">Laticinios</option>
          <option value="2">Padaria</option>
          <option value="3">Carnes</option>
          <option value="4">Bebidas</option>
          <option value="5">GraosCereais</option>
          <option value="6">Outros</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Unidade de Medida
        </label>
        <select
          v-model="form.unitOfMeasurement"
          required
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        >
          <option value="0">Unidade</option>
          <option value="1">Quilograma</option>
          <option value="2">Grama</option>
          <option value="3">Litro</option>
          <option value="4">Mililitro</option>
          <option value="5">Pacote</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Origem
        </label>
        <select
          v-model="form.origin"
          required
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        >
          <option value="Local">Local</option>
          <option value="Regional">Regional</option>
          <option value="Nacional">Nacional</option>
          <option value="Importado">Importado</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Tipo de Embalagem
        </label>
        <select
          v-model="form.packagingType"
          required
          class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
        >
          <option value="0">Biodegradável</option>
          <option value="1">Sem Embalagem</option>
          <option value="2">Reciclável</option>
          <option value="3">Retornável</option>
          <option value="4">Outro</option>
        </select>
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="emit('close')"
        class="flex-1 px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Salvando...' : product?.id ? 'Atualizar' : 'Cadastrar' }}
      </button>
    </div>
  </form>
</template>
