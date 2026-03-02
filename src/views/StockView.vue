<!-- src/views/StockView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/services/api'
import AppSidebar from '@/components/AppSidebar.vue'
import CreateEditModal from '@/components/CreateEditModal.vue'
import ProductForm from '@/components/ProductForm.vue'
import ProductDetailsModal from '@/components/ProductDetailsModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import { getActiveCompanyId } from '@/utils/companyStorage'
import { PlusCircleIcon, PlayIcon } from '@heroicons/vue/24/solid'

interface Product {
  id: number
  name: string
  category: string
  description?: string
  inventoryQuantity: number
  unitOfMeasurement: string
  unitPrice: number
  packagingType: string
  expirationDate?: string
  origin?: string
}

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

const products = ref<Product[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('Todas')
const currentPage = ref(1)
const itemsPerPage = 8

const showCreateEditModal = ref(false)
const showViewDetailsModal = ref(false)
const showDeleteConfirmModal = ref(false)
const selectedProduct = ref<Product | null>(null)

async function fetchProducts() {
  loading.value = true
  try {
    const activeCompanyId = getActiveCompanyId()

    const response = await api.get('/Products/listAll', {
      params: activeCompanyId ? { companyId: activeCompanyId } : undefined,
    })

    if (response.status == 204) {
      products.value = []
      return
    }

    products.value = response.data.products
  } catch (error) {
    console.error('Erro ao buscar produtos', error)
  } finally {
    loading.value = false
  }
}

async function deleteProduct(id: number) {
  try {
    await api.delete(`/Products/${id}`)
    await fetchProducts()
  } catch (error) {
    console.error('Erro ao deletar produto', error)
  } finally {
    closeModal()
  }
}

function openDeleteConfirmModal(product: Product) {
  selectedProduct.value = { ...product }
  showDeleteConfirmModal.value = true
}

async function confirmDeleteProduct() {
  if (!selectedProduct.value) return
  await deleteProduct(selectedProduct.value.id)
}

function openCreateModal() {
  selectedProduct.value = null
  showCreateEditModal.value = true
}

function openEditModal(product: Product) {
  selectedProduct.value = { ...product }
  showCreateEditModal.value = true
}

function openViewDetailsModal(product: Product) {
  selectedProduct.value = { ...product }
  showViewDetailsModal.value = true
}

function closeModal() {
  showCreateEditModal.value = false
  showViewDetailsModal.value = false
  showDeleteConfirmModal.value = false
  selectedProduct.value = null
}

async function handleProductSaved() {
  closeModal()
  await fetchProducts()
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory =
      selectedCategory.value === 'Todas' || p.category === selectedCategory.value
    return matchSearch && matchCategory
  })
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const selectedProductForForm = computed<ProductFormData | null>(() => {
  if (!selectedProduct.value) return null

  return {
    id: selectedProduct.value.id,
    name: selectedProduct.value.name,
    unitPrice: selectedProduct.value.unitPrice,
    description: selectedProduct.value.description ?? '',
    inventoryQuantity: selectedProduct.value.inventoryQuantity,
    expirationDate: selectedProduct.value.expirationDate ?? '',
    category: selectedProduct.value.category,
    unitOfMeasurement: selectedProduct.value.unitOfMeasurement,
    origin: selectedProduct.value.origin ?? 'Local',
    packagingType: selectedProduct.value.packagingType,
  }
})

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

onMounted(fetchProducts)
</script>

<template>
  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 flex overflow-x-hidden"
  >
    <AppSidebar />

    <main class="flex-1 min-w-0">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">
            Gestão de Estoque
          </h1>
          <button
            @click="openCreateModal"
            class="w-full sm:w-auto justify-center flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
          >
            <PlusCircleIcon class="size-5" />
            Adicionar Produto
          </button>
        </div>

        <!-- Filtros -->
        <div
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row sm:flex-wrap gap-4 transition-colors duration-300"
        >
          <div class="flex-1 min-w-0 sm:min-w-45">
            <label
              class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
              >Buscar</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Nome do produto..."
              class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-800 dark:text-white text-sm placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
            />
          </div>

          <div class="flex-1 min-w-0 sm:min-w-45">
            <label
              class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide"
              >Categoria</label
            >
            <select
              v-model="selectedCategory"
              class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2 text-zinc-800 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-colors"
            >
              <option>Todas</option>
              <option>FrutasVerduras</option>
              <option>Laticinios</option>
              <option>Padaria</option>
              <option>Carnes</option>
              <option>Bebidas</option>
              <option>GraosCereais</option>
              <option>Outros</option>
            </select>
          </div>
        </div>

        <!-- Tabela -->
        <div
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-colors duration-300"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-190">
              <thead class="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Produto
                  </th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Quantidade
                  </th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Preço
                  </th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Validade
                  </th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-5 py-4 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading">
                  <td colspan="6" class="text-center py-12 text-zinc-400">
                    Carregando produtos...
                  </td>
                </tr>

                <tr v-else-if="paginatedProducts.length === 0">
                  <td colspan="6" class="text-center py-12 text-zinc-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>

                <tr
                  v-for="product in paginatedProducts"
                  :key="product.id"
                  class="border-t border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <!-- Produto -->
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-600/20 flex items-center justify-center text-lg shrink-0"
                      >
                        {{ getCategoryIcon(product.category) }}
                      </div>
                      <div>
                        <p class="font-semibold text-zinc-800 dark:text-white text-sm">
                          {{ product.name }}
                        </p>
                        <p class="text-xs text-zinc-400 mt-0.5">{{ product.category }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Quantidade -->
                  <td class="px-5 py-4 text-zinc-600 dark:text-zinc-300 text-sm">
                    {{ product.inventoryQuantity }} {{ product.unitOfMeasurement }}
                  </td>

                  <!-- Preço -->
                  <td class="px-5 py-4 text-zinc-600 dark:text-zinc-300 text-sm">
                    {{ formatPrice(product.unitPrice) }}
                  </td>

                  <!-- Validade -->
                  <td class="px-5 py-4 text-zinc-600 dark:text-zinc-300 text-sm">
                    {{ formatDate(product.expirationDate) }}
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4">
                    <span
                      :class="getStatus(product).class"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ getStatus(product).label }}
                    </span>
                  </td>

                  <!-- Ações -->
                  <td class="px-5 py-4">
                    <div class="flex gap-2">
                      <button
                        @click="openViewDetailsModal(product)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-400/20 hover:bg-cyan-200 dark:hover:bg-cyan-400/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-all"
                      >
                        👁
                      </button>
                      <button
                        @click="openEditModal(product)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-all"
                      >
                        ✏️
                      </button>
                      <button
                        @click="openDeleteConfirmModal(product)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-500 dark:text-red-400 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginação -->
          <div
            class="px-4 sm:px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <span class="text-sm text-zinc-400">
              Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}-{{
                Math.min(currentPage * itemsPerPage, filteredProducts.length)
              }}
              de {{ filteredProducts.length }} produtos
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-all"
              >
                <PlayIcon class="rotate-180 size-3" />
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                :class="
                  currentPage === page
                    ? 'bg-emerald-600 text-white border-transparent'
                    : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-500'
                "
                class="px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all"
              >
                {{ page }}
              </button>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold transition-all"
              >
                <PlayIcon class="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Produto -->
    <CreateEditModal
      :show="showCreateEditModal"
      :title="selectedProduct ? 'Editar Produto' : 'Novo Produto'"
      @close="closeModal"
    >
      <ProductForm
        :product="selectedProductForForm"
        @success="handleProductSaved"
        @close="closeModal"
      />
    </CreateEditModal>

    <!-- Modal de Detalhes do Produto -->
    <ProductDetailsModal
      :show="showViewDetailsModal"
      :product="selectedProduct"
      @close="closeModal"
    />

    <!-- Modal de Confirmação de Exclusão do Produto -->
    <DeleteConfirmModal
      :show="showDeleteConfirmModal"
      :product-name="selectedProduct?.name"
      @confirm="confirmDeleteProduct"
      @close="closeModal"
    />
  </div>
</template>
