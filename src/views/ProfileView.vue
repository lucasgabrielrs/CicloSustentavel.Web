<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import {
  UserCircleIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  IdentificationIcon,
} from '@heroicons/vue/24/solid'
import { getStoredCompanies } from '@/utils/companyStorage'

const isEditing = ref(false)
const successMessage = ref('')

const profile = reactive({
  name: localStorage.getItem('userName') || 'Usuário',
  email: localStorage.getItem('userEmail') || '',
  role: localStorage.getItem('userRole') || 'Não informado',
})

const draftProfile = reactive({ ...profile })
const companies = computed(() => getStoredCompanies())

const companyCount = computed(() => companies.value.length)
const companyIdsText = computed(() => {
  if (companies.value.length === 0) return 'Nenhuma empresa vinculada'
  return companies.value.map((company) => company.id).join(', ')
})

function startEdit() {
  draftProfile.name = profile.name
  draftProfile.email = profile.email
  isEditing.value = true
  successMessage.value = ''
}

function cancelEdit() {
  isEditing.value = false
}

function saveProfile() {
  profile.name = draftProfile.name.trim() || 'Usuário'
  profile.email = draftProfile.email.trim()

  localStorage.setItem('userName', profile.name)
  if (profile.email) {
    localStorage.setItem('userEmail', profile.email)
  } else {
    localStorage.removeItem('userEmail')
  }

  isEditing.value = false
  successMessage.value = 'Perfil atualizado com sucesso.'
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
          <h1 class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">Meu Perfil</h1>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Visualize e atualize suas informações básicas.
          </p>
        </div>

        <section
          class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 transition-colors duration-300"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <UserCircleIcon class="size-12 text-emerald-600 dark:text-emerald-500" />
              <div>
                <p class="text-lg font-bold text-zinc-800 dark:text-white">{{ profile.name }}</p>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">
                  {{ profile.email || 'Sem e-mail' }}
                </p>
              </div>
            </div>

            <button
              v-if="!isEditing"
              type="button"
              @click="startEdit"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              <PencilSquareIcon class="size-5" />
              Editar Perfil
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
                Nome
              </label>
              <input
                v-if="isEditing"
                v-model="draftProfile.name"
                type="text"
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div
                v-else
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white"
              >
                {{ profile.name }}
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                E-mail
              </label>
              <div class="relative">
                <EnvelopeIcon
                  class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 dark:text-zinc-500"
                />
                <input
                  v-if="isEditing"
                  v-model="draftProfile.email"
                  type="email"
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <div
                  v-else
                  class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-zinc-800 dark:text-white"
                >
                  {{ profile.email || 'Não informado' }}
                </div>
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Cargo
              </label>
              <div
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white"
              >
                {{ profile.role }}
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase"
              >
                Empresas vinculadas
              </label>
              <div
                class="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-800 dark:text-white inline-flex items-center gap-2"
              >
                <BuildingOfficeIcon class="size-5 text-emerald-600 dark:text-emerald-500" />
                {{ companyCount }}
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
                <span class="break-all">{{ companyIdsText }}</span>
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
              @click="saveProfile"
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
