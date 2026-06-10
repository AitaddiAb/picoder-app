<script setup>
import { Code2, ListFilter, MessageCircle, Plus } from "@lucide/vue";

defineProps({
  sessions: { type: Array, required: true },
  activeSessionId: { type: String, default: "" },
  firstName: { type: String, default: "Operator" },
});

const emit = defineEmits(["select-session", "logout"]);

const iconProps = { size: 16, strokeWidth: 1.75 };
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col bg-[#1c1b1b]">
    <div class="mb-6 px-3 pt-3">
      <div class="flex rounded-lg bg-[#202020] p-1">
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#c3c3c3] transition hover:text-[#e2e2e2]"
          type="button"
        >
          <MessageCircle v-bind="iconProps" />
          Chat
        </button>
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#393939] px-3 py-1.5 text-sm text-[#e2e2e2] shadow-sm"
          type="button"
        >
          <Code2 v-bind="iconProps" />
          Code
        </button>
      </div>
    </div>

    <nav class="mb-8 flex flex-col gap-1 px-3">
      <button
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-[#c3c3c3] transition hover:bg-[#202020] hover:text-[#e2e2e2]"
        type="button"
      >
        <Plus :size="16" stroke-width="1.75" />
        New session
      </button>
    </nav>

    <div class="scrollbar-hide flex-1 overflow-y-auto px-3">
      <div class="group mb-1 flex items-center justify-between px-3 py-1">
        <span
          class="text-xs font-medium uppercase tracking-wider text-[#c3c3c3]"
          >Recents</span
        >
        <button
          class="text-[#c3c3c3] opacity-0 transition group-hover:opacity-100 hover:text-[#e2e2e2]"
          type="button"
          title="Filter sessions"
        >
          <ListFilter :size="16" stroke-width="1.75" />
        </button>
      </div>
      <ul class="flex flex-col gap-0.5 pb-4">
        <li v-for="session in sessions" :key="session.id">
          <button
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition"
            :class="
              session.id === activeSessionId
                ? 'bg-[#202020] text-[#e2e2e2]'
                : 'text-[#c3c3c3] hover:bg-[#202020] hover:text-[#e2e2e2]'
            "
            type="button"
            @click="emit('select-session', session.id)"
          >
            <span
              class="h-1.5 w-1.5 shrink-0 rounded-full"
              :class="
                session.status === 'online'
                  ? 'bg-[#e87e53]'
                  : 'border border-[#c3c3c3]'
              "
            ></span>
            <span class="truncate">{{ session.title }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="mt-auto border-t border-[#393939]/30 p-3">
      <button
        class="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-[#202020]"
        type="button"
        @click="emit('logout')"
      >
        <div
          class="flex h-6 w-6 items-center justify-center rounded bg-[#393939] text-xs font-semibold text-[#e2e2e2]"
        >
          {{ firstName.charAt(0) }}
        </div>
        <span class="text-sm font-medium text-[#e2e2e2]">
          {{ firstName }}
          <span class="font-normal text-[#c3c3c3]">· Pro</span>
        </span>
      </button>
    </div>
  </aside>
</template>
