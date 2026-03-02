<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { saveAuthFromLogin } from '@/services/auth'
import {
  clearCompanyStorage,
  normalizeCompaniesFromLogin,
  saveCompanies,
  setActiveCompany,
} from '@/utils/companyStorage'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
})

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/Login', {
      email: form.email,
      password: form.password,
    })

    const userData = response.data

    saveAuthFromLogin(userData)

    clearCompanyStorage()
    const companies = normalizeCompaniesFromLogin(userData)
    saveCompanies(companies)

    if (companies.length > 1) {
      router.push('/select-company')
      return
    }

    if (companies.length === 1) {
      const firstCompany = companies[0]
      if (firstCompany) {
        setActiveCompany(firstCompany.id)
      }
    }

    router.push('/stock')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Erro ao realizar login.'
    } else {
      errorMessage.value = 'Erro ao realizar login.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <ThemeToggle />
  <div
    class="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-2xl"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-emerald-500 mb-2 tracking-tight">Ciclo Sustentável</h1>
        <p class="text-zinc-600 dark:text-zinc-400">Acesse sua conta para utilizar o sistema</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div
          v-if="errorMessage"
          class="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 p-3 rounded-lg text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >E-mail</label
          >
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >Senha</label
          >
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg mt-4 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="text-center text-zinc-600 dark:text-zinc-500 mt-6 text-sm">
        Ainda não tem conta?
        <RouterLink to="/register" class="text-emerald-500 hover:underline font-medium"
          >Crie uma conta</RouterLink
        >
      </p>
    </div>
  </div>
</template>
