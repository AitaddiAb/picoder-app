<script setup>
defineProps({
  error: { type: String, default: '' },
  isDesktop: { type: Boolean, default: false },
})

const emit = defineEmits(['continue-google'])
</script>

<template>
  <section class="relative flex min-h-0 flex-1 items-center justify-center bg-[#131313] px-5" :class="isDesktop ? 'pt-9' : ''">
    <div class="w-full max-w-md rounded-3xl border border-[#393939]/50 bg-[#202020] p-6 shadow-2xl shadow-black/40">
      <div class="mb-8 flex items-center gap-3">
        <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#393939] text-sm font-semibold text-[#e2e2e2]">π</div>
        <div>
          <h1 class="text-lg font-semibold text-[#e2e2e2]">Picoder</h1>
          <p class="text-sm text-[#c3c3c3]">Remote coding console</p>
        </div>
      </div>
      <h2 class="mb-3 text-2xl font-semibold tracking-tight text-[#e2e2e2]">Sign in to continue</h2>
      <p class="mb-6 text-sm leading-6 text-[#c3c3c3]">Use Google to open your mobile and desktop Pi agent sessions.</p>
      <div v-if="error" class="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{{ error }}</div>
      <button class="flex w-full items-center justify-center gap-3 rounded-xl bg-[#e87e53] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f0946f]" type="button" @click="emit('continue-google')">
        <span class="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold">G</span>
        Continue with Google
      </button>
    </div>
  </section>
</template>
