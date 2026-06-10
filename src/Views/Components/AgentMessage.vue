<script setup>
defineProps({
  message: { type: Object, required: true },
  streaming: { type: Boolean, default: false },
})
</script>

<template>
  <article class="mx-auto flex w-full max-w-4xl justify-start">
    <div class="w-full text-[14px] leading-relaxed text-[#e2e2e2] md:text-[15px]">
      <p class="whitespace-pre-wrap">{{ message.content }}<span v-if="streaming" class="ml-2 inline-block text-[#e87e53]">◌</span></p>
    </div>
  </article>
</template>
