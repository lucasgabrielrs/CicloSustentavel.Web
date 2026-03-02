<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { BuildingOffice2Icon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { getStoredCompanies, setActiveCompany, type CompanyData } from '@/utils/companyStorage'

const router = useRouter()
const companies = ref<CompanyData[]>([])
const selectedCompanyId = ref('')
const errorMessage = ref('')

onMounted(() => {
  companies.value = getStoredCompanies()

  if (companies.value.length === 0) {
    return
  }

  if (companies.value.length === 1) {
    const firstCompany = companies.value[0]
    if (firstCompany) {
      setActiveCompany(firstCompany.id)
    }
    router.replace('/stock')
    return
  }

  const firstCompany = companies.value[0]
  if (firstCompany) {
    selectedCompanyId.value = firstCompany.id
  }
})

function handleSelectCompany() {
  errorMessage.value = ''

  if (!selectedCompanyId.value) {
    errorMessage.value = 'Selecione uma empresa para continuar.'
    return
  }

  const success = setActiveCompany(selectedCompanyId.value)

  if (!success) {
    errorMessage.value = 'Empresa selecionada é inválida. Tente novamente.'
    return
  }

  router.push('/stock')
}
</script>

<template>
  <ThemeToggle />

  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors"
  >
    <div
      class="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl"
    >
      <div class="text-center mb-7">
        <h1 class="text-2xl sm:text-3xl font-bold text-emerald-500 mb-2 tracking-tight">
          Escolha a Empresa
        </h1>
        <p class="text-zinc-600 dark:text-zinc-400">
          Você está vinculado a mais de uma empresa. Selecione qual deseja acessar.
        </p>
      </div>

      <div
        v-if="companies.length === 0"
        class="bg-yellow-500/10 border border-yellow-500/40 text-yellow-700 dark:text-yellow-400 p-4 rounded-lg text-sm"
      >
        Nenhuma empresa vinculada foi encontrada para seu usuário.
      </div>

      <div v-else class="space-y-3">
        <label
          v-for="company in companies"
          :key="company.id"
          class="w-full flex items-start gap-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 cursor-pointer"
          :class="
            selectedCompanyId === company.id
              ? 'ring-2 ring-emerald-500 border-emerald-500/60'
              : 'hover:border-zinc-400 dark:hover:border-zinc-500'
          "
        >
          <input
            v-model="selectedCompanyId"
            type="radio"
            :value="company.id"
            class="mt-1 accent-emerald-500"
          />

          <BuildingOffice2Icon class="size-6 text-emerald-600 dark:text-emerald-500 shrink-0" />

          <div class="min-w-0">
            <p class="font-semibold text-zinc-800 dark:text-white">{{ company.name }}</p>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">ID: {{ company.id }}</p>
            <p v-if="company.cnpj" class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              CNPJ: {{ company.cnpj }}
            </p>
          </div>
        </label>
      </div>

      <p
        v-if="errorMessage"
        class="mt-4 bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 rounded-lg px-3 py-2 text-sm"
      >
        {{ errorMessage }}
      </p>

      <button
        type="button"
        :disabled="companies.length === 0"
        @click="handleSelectCompany"
        class="mt-6 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        <CheckCircleIcon class="size-5" />
        Entrar na Empresa Selecionada
      </button>
    </div>
  </div>
</template>
