<script setup>
import {
  ChevronDown,
  CornerDownLeft,
  Mic,
  Plus,
  SlidersHorizontal,
} from "@lucide/vue";

defineProps({
  modelValue: { type: String, default: "" },
  streaming: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const iconProps = { size: 16, strokeWidth: 1.75 };
</script>

<template>
  <form
    class="relative z-20 mx-auto w-full max-w-4xl shrink-0 p-4 pb-6 md:p-6"
    @submit.prevent="emit('submit')"
  >
    <div
      class="flex flex-col overflow-hidden rounded-xl border border-[#393939]/50 bg-[#202020] transition-all focus-within:border-[#444444] focus-within:ring-1 focus-within:ring-[#444444]"
    >
      <div class="relative flex items-center px-4 py-3">
        <input
          :value="modelValue"
          class="w-full border-none bg-transparent p-0 pr-8 text-[14px] text-[#e2e2e2] outline-none placeholder:text-[#c3c3c3] focus:ring-0 md:text-[15px]"
          placeholder="Type / for commands"
          type="text"
          :disabled="streaming"
          @input="emit('update:modelValue', $event.target.value)"
        />
        <button
          class="absolute right-4 text-[#c3c3c3] transition hover:text-[#e2e2e2] disabled:opacity-40"
          type="submit"
          :disabled="!modelValue.trim() || streaming"
          title="Send"
        >
          <CornerDownLeft v-bind="iconProps" />
        </button>
      </div>
      <div
        class="flex flex-col items-center justify-between gap-3 border-t border-[#393939]/30 bg-[#1c1b1b] px-4 py-3 sm:flex-row sm:gap-0 sm:py-2"
      >
        <div class="flex w-full items-center justify-between gap-3 sm:w-auto">
          <button
            class="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[#e87e53] transition hover:text-[#f0946f]"
            type="button"
          >
            Auto
            <ChevronDown :size="12" stroke-width="2" />
          </button>
          <div class="flex items-center gap-3">
            <button
              class="text-[#c3c3c3] transition hover:text-[#e2e2e2]"
              type="button"
              title="Add attachment"
            >
              <Plus v-bind="iconProps" />
            </button>
            <button
              class="flex items-center gap-1 text-[#c3c3c3] transition hover:text-[#e2e2e2]"
              type="button"
              title="Voice input"
            >
              <Mic v-bind="iconProps" />
              <ChevronDown :size="12" stroke-width="2" />
            </button>
          </div>
        </div>
        <div
          class="flex w-full items-center justify-between gap-4 text-xs text-[#c3c3c3] sm:w-auto"
        >
          <span>Pi Agent</span>
          <span>{{ streaming ? "Streaming" : "Medium" }}</span>
          <button
            class="transition hover:text-[#e2e2e2]"
            type="button"
            title="Model settings"
          >
            <SlidersHorizontal :size="14" stroke-width="1.75" />
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
