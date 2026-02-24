<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { api } from '@/services/api'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  cnpj: '',
})

async function handleRegister() {
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await api.post('/User', {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      cnpj: form.cnpj.replace(/\D/g, ''),
    })

    alert('Cadastro realizado com sucesso!')
    router.push('/login')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.message || 'Erro ao realizar cadastro.'
    } else {
      errorMessage.value = 'Erro ao realizar cadastro.'
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
        <p class="text-zinc-600 dark:text-zinc-400">Crie sua conta para começar no SaaS</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Alerta de Erro -->
        <div
          v-if="errorMessage"
          class="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-500 p-3 rounded-lg text-sm text-center"
        >
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >Nome Completo</label
          >
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Ex: João Silva"
            class="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
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
            >CNPJ</label
          >
          <input
            v-model="form.cnpj"
            v-maska
            data-maska="##.###.###/####-##"
            type="text"
            required
            placeholder="00.000.000/0000-00"
            class="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
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
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >Confirmar Senha</label
            >
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >Cargo</label
          >
          <div class="grid grid-cols-2 gap-3">
            <label
              class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-700 dark:text-zinc-200"
            >
              <input
                v-model="form.role"
                type="radio"
                name="role"
                value="USUARIO"
                required
                class="accent-emerald-500"
              />
              <span>Usuário</span>
            </label>

            <label
              class="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2.5 text-zinc-700 dark:text-zinc-200"
            >
              <input
                v-model="form.role"
                type="radio"
                name="role"
                value="FORNECEDOR"
                required
                class="accent-emerald-500"
              />
              <span>Fornecedor</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg mt-4 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {{ loading ? 'Cadastrando...' : 'Criar Conta Grátis' }}
        </button>
      </form>

      <p class="text-center text-zinc-600 dark:text-zinc-500 mt-6 text-sm">
        Já tem uma conta?
        <RouterLink to="/login" class="text-emerald-500 hover:underline font-medium"
          >Faça login</RouterLink
        >
      </p>
    </div>
  </div>
</template>
