<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

onMounted(async () => {
  if (auth.token && !auth.user) {
    await auth.fetchUser();
  }
});
</script>

<template>
  <main
    class="min-h-screen bg-black font-sans text-[#e2e2e2] selection:bg-[#e87e53]/30"
  >
    <div
      class="flex h-[100dvh] w-full overflow-hidden bg-[#202020] md:rounded-xl md:border md:border-[#393939]/30"
    >
      <router-view />
    </div>
  </main>
</template>
