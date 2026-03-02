<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  BuildingOffice2Icon,
  PencilSquareIcon,
  CheckCircleIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowsRightLeftIcon,
  PlusCircleIcon,
} from '@heroicons/vue/24/solid'
import {
  getActiveCompanyId,
  getStoredCompanies,
  saveCompanies,
  setActiveCompany,
  type CompanyData,
} from '@/utils/companyStorage'

const isEditing = ref(false)
const isCreating = ref(false)
const successMessage = ref('')
const companies = ref<CompanyData[]>(getStoredCompanies())
const activeCompanyId = ref(getActiveCompanyId())
const selectedCompanyId = ref(getActiveCompanyId() || companies.value[0]?.id || '')

if (!selectedCompanyId.value && companies.value.length > 0) {
  selectedCompanyId.value = companies.value[0]?.id || ''
}

const draftCompany = reactive({
  id: '',
  name: '',
  cnpj: '',
  segment: '',
  phone: '',
  address: '',
})

const selectedCompany = computed(() => {
  return companies.value.find((company) => company.id === selectedCompanyId.value) || null
})

const activeCompany = computed(() => {
  return companies.value.find((company) => company.id === activeCompanyId.value) || null
})

function resetDraftFromCompany(company: CompanyData | null) {
  if (!company) {
    draftCompany.id = ''
    draftCompany.name = ''
    draftCompany.cnpj = ''
    draftCompany.segment = ''
    draftCompany.phone = ''
    draftCompany.address = ''
    return
  }

  draftCompany.id = company.id
  draftCompany.name = company.name
  draftCompany.cnpj = company.cnpj || ''
  draftCompany.segment = company.segment || ''
  draftCompany.phone = company.phone || ''
  draftCompany.address = company.address || ''
}

function applyCompanySelection() {
  successMessage.value = ''

  if (!selectedCompanyId.value) return

  const success = setActiveCompany(selectedCompanyId.value)

  if (!success) {
    successMessage.value = 'Não foi possível trocar a empresa ativa.'
    return
  }

  activeCompanyId.value = selectedCompanyId.value
  successMessage.value = 'Empresa ativa alterada com sucesso.'
}

function startEdit() {
  if (!selectedCompany.value) return
  isCreating.value = false
  resetDraftFromCompany(selectedCompany.value)
  isEditing.value = true
  successMessage.value = ''
}

function startCreate() {
  isCreating.value = true
  resetDraftFromCompany(null)
  draftCompany.id = crypto.randomUUID()
  isEditing.value = true
  successMessage.value = ''
}

function cancelEdit() {
  isEditing.value = false
  isCreating.value = false
}

function saveCompany() {
  const wasCreating = isCreating.value

  const companyToSave: CompanyData = {
    id: draftCompany.id.trim() || crypto.randomUUID(),
    name: draftCompany.name.trim() || 'Minha Empresa',
    cnpj: draftCompany.cnpj.trim(),
    segment: draftCompany.segment.trim(),
    phone: draftCompany.phone.trim(),
    address: draftCompany.address.trim(),
  }

  if (isCreating.value) {
    companies.value = [...companies.value, companyToSave]
  } else {
    companies.value = companies.value.map((company) =>
      company.id === companyToSave.id ? companyToSave : company,
    )
  }

  saveCompanies(companies.value)

  selectedCompanyId.value = companyToSave.id

  if (!activeCompany.value) {
    setActiveCompany(companyToSave.id)
    activeCompanyId.value = companyToSave.id
  }

  isEditing.value = false
  isCreating.value = false
  successMessage.value = wasCreating
    ? 'Empresa adicionada com sucesso.'
    : 'Dados da empresa atualizados com sucesso.'
}
</script>

<template>
  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 flex overflow-x-hidden"
  >
    <AppSidebar />

    <main class="flex-1 min-w-0">
      <div class="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div class="mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">Minha Empresa</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Gerencie mais de uma empresa e escolha qual está ativa no sistema.
          </p>
        </div>

        <section
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 mb-5 transition-colors duration-300"
        >
          <div class="flex flex-col lg:flex-row lg:items-end gap-3">
            <div class="flex-1 min-w-0">
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Empresa selecionada
              </label>
              <select
                v-model="selectedCompanyId"
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option v-if="companies.length === 0" value="">Nenhuma empresa cadastrada</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }} ({{ company.id }})
                </option>
              </select>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                :disabled="!selectedCompanyId"
                @click="applyCompanySelection"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <ArrowsRightLeftIcon class="size-5" />
                Trocar ativa
              </button>

              <button
                type="button"
                @click="startCreate"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
              >
                <PlusCircleIcon class="size-5" />
                Adicionar empresa
              </button>
            </div>
          </div>

          <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Empresa ativa atual:
            <span class="font-semibold text-zinc-700 dark:text-zinc-200">{{
              activeCompany?.name || 'Nenhuma'
            }}</span>
          </p>
        </section>

        <section
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 transition-colors duration-300"
        >
          <div
            v-if="!isEditing && !selectedCompany"
            class="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Cadastre sua primeira empresa para começar.
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <BuildingOffice2Icon class="size-12 text-emerald-600 dark:text-emerald-500" />
              <div>
                <p class="text-lg font-bold text-zinc-800 dark:text-white">
                  {{
                    isEditing
                      ? draftCompany.name || 'Nova Empresa'
                      : selectedCompany?.name || 'Minha Empresa'
                  }}
                </p>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                  {{
                    isEditing
                      ? draftCompany.cnpj || 'CNPJ não informado'
                      : selectedCompany?.cnpj || 'CNPJ não informado'
                  }}
                </p>
              </div>
            </div>

            <button
              v-if="!isEditing && selectedCompany"
              type="button"
              @click="startEdit"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              <PencilSquareIcon class="size-5" />
              Editar Empresa
            </button>
          </div>

          <div v-if="successMessage" class="mb-5">
            <p
              class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-lg px-3 py-2 text-sm"
            >
              <CheckCircleIcon class="size-5" />
              {{ successMessage }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Nome da Empresa
              </label>
              <input
                v-if="isEditing"
                v-model="draftCompany.name"
                type="text"
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div
                v-else
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white"
              >
                {{ selectedCompany?.name || 'Não informado' }}
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                CNPJ
              </label>
              <input
                v-if="isEditing"
                v-model="draftCompany.cnpj"
                v-maska
                data-maska="##.###.###/####-##"
                type="text"
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div
                v-else
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white"
              >
                {{ selectedCompany?.cnpj || 'Não informado' }}
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Segmento
              </label>
              <input
                v-if="isEditing"
                v-model="draftCompany.segment"
                type="text"
                placeholder="Ex: Hortifruti"
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div
                v-else
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white"
              >
                {{ selectedCompany?.segment || 'Não informado' }}
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Telefone
              </label>
              <div class="relative">
                <PhoneIcon
                  class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  v-if="isEditing"
                  v-model="draftCompany.phone"
                  type="text"
                  placeholder="(00) 00000-0000"
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div
                  v-else
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white"
                >
                  {{ selectedCompany?.phone || 'Não informado' }}
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Endereço
              </label>
              <div class="relative">
                <MapPinIcon
                  class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  v-if="isEditing"
                  v-model="draftCompany.address"
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div
                  v-else
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white"
                >
                  {{ selectedCompany?.address || 'Não informado' }}
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                IDs das empresas
              </label>
              <div
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white inline-flex items-center gap-2"
              >
                <IdentificationIcon class="size-5 text-zinc-500 dark:text-zinc-400" />
                <span class="break-all">{{
                  selectedCompany?.id || 'Nenhuma empresa selecionada'
                }}</span>
              </div>
            </div>
          </div>

          <div v-if="isEditing" class="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              @click="cancelEdit"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="saveCompany"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-lg shadow-emerald-900/20"
            >
              Salvar alterações
            </button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
