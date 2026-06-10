<script setup>
import AppHeader from "@/Views/Components/App/AppHeader.vue";
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col">
    <AppHeader :can-use-console="false" />
    <router-view />
  </div>
</template>
