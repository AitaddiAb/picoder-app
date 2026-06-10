<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { APP_HOME_PATH } from "@/app/Config";

const router = useRouter();

onMounted(() => {
  router.replace(APP_HOME_PATH);
});
</script>

<template>
  <section
    class="flex flex-1 items-center justify-center bg-[#131313] px-5 text-sm text-[#c3c3c3]"
  >
    Completing sign in…
  </section>
</template>
