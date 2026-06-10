<script setup>
defineProps({
  message: { type: Object, required: true },
})
</script>

<template>
  <article class="mx-auto flex w-full max-w-4xl justify-end">
    <div class="w-full break-words rounded-2xl rounded-tr-sm border border-[#393939]/20 bg-[#2b2b2b] p-4 text-[14px] leading-relaxed text-[#e2e2e2] shadow-sm md:max-w-[85%] md:p-5 md:text-[15px]">
      {{ message.content }}
    </div>
  </article>
</template>
