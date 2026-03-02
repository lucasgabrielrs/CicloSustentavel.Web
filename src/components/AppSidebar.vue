<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { clearAuthSession } from '@/services/auth'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftStartOnRectangleIcon,
  BuildingOffice2Icon,
  UserIcon,
  ChartPieIcon,
  CubeIcon,
} from '@heroicons/vue/24/solid'

const isExpanded = ref(false)
const route = useRoute()
const router = useRouter()

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
}

function handleLogout() {
  clearAuthSession()
  router.push('/login')
}
</script>

<template>
  <aside
    :class="isExpanded ? 'w-64' : 'w-16 sm:w-20'"
    class="relative bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-300 dark:border-zinc-800 shadow-xl shadow-zinc-200/60 dark:shadow-none px-3 py-6 flex flex-col transition-all duration-300"
  >
    <button
      type="button"
      @click="toggleSidebar"
      class="absolute -right-3 top-8 w-7 h-7 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-xs shadow-lg shadow-emerald-900/20 transition-colors"
      :aria-label="isExpanded ? 'Recolher menu lateral' : 'Expandir menu lateral'"
    >
      <ChevronLeftIcon v-if="isExpanded" class="size-4" />
      <ChevronRightIcon v-else class="size-4" />
    </button>

    <div
      class="h-12 mb-8 flex items-center"
      :class="isExpanded ? 'justify-start px-2' : 'justify-center'"
    >
      <span v-if="isExpanded" class="text-xl font-bold text-emerald-600 dark:text-emerald-500">
        🌱 Ciclo Sustentável
      </span>
      <span v-else class="text-2xl">🌱</span>
    </div>

    <nav class="space-y-2">
      <RouterLink
        to="/dashboard"
        :class="[
          route.path === '/dashboard'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20'
            : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-zinc-800',
          isExpanded ? 'justify-start px-4' : 'justify-center px-2',
        ]"
        class="w-full h-11 flex items-center gap-2 rounded-lg font-semibold transition-colors"
      >
        <ChartPieIcon class="size-5 text-current" />
        <span v-if="isExpanded">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/stock"
        :class="[
          route.path === '/stock'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20'
            : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-zinc-800',
          isExpanded ? 'justify-start px-4' : 'justify-center px-2',
        ]"
        class="w-full h-11 flex items-center gap-2 rounded-lg font-semibold transition-colors"
      >
        <CubeIcon class="size-5 text-current" />
        <span v-if="isExpanded">Estoque</span>
      </RouterLink>

      <RouterLink
        to="/minhaEmpresa"
        :class="[
          route.path === '/minhaEmpresa'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20'
            : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-zinc-800',
          isExpanded ? 'justify-start px-4' : 'justify-center px-2',
        ]"
        class="w-full h-11 flex items-center gap-2 rounded-lg font-semibold transition-colors"
      >
        <BuildingOffice2Icon class="size-5 text-current" />
        <span v-if="isExpanded">Minha Empresa</span>
      </RouterLink>

      <RouterLink
        to="/profile"
        :class="[
          route.path === '/profile'
            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20'
            : 'text-zinc-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white dark:hover:bg-zinc-800',
          isExpanded ? 'justify-start px-4' : 'justify-center px-2',
        ]"
        class="w-full h-11 flex items-center gap-2 rounded-lg font-semibold transition-colors"
      >
        <UserIcon class="size-5 text-current" />
        <span v-if="isExpanded">Perfil</span>
      </RouterLink>
    </nav>

    <div class="mt-auto space-y-3">
      <button
        type="button"
        @click="handleLogout"
        :class="isExpanded ? 'justify-start px-4' : 'justify-center px-2'"
        class="w-full h-11 flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors"
      >
        <ArrowLeftStartOnRectangleIcon class="size-6 text-current" />
        <span v-if="isExpanded">Sair</span>
      </button>

      <div class="flex" :class="isExpanded ? 'justify-start px-4' : 'justify-center'">
        <ThemeToggle />
      </div>
    </div>
  </aside>
</template>
