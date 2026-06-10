<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import AgentMessage from "@/Views/Components/AgentMessage.vue";
import UserInput from "@/Views/Components/UserInput.vue";
import UserMessage from "@/Views/Components/UserMessage.vue";
import { useSessionsStore } from "@/stores/sessions";

const sessions = useSessionsStore();

const prompt = ref("");
const transcriptEl = ref(null);

const activeSession = computed(() => sessions.activeSession);
const activeMessages = computed(() => activeSession.value?.messages ?? []);

async function scrollToBottom() {
  await nextTick();
  if (transcriptEl.value) {
    transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight;
  }
}

async function submitPrompt() {
  const value = prompt.value;
  prompt.value = "";
  await sessions.sendPrompt(value);
}

watch(activeMessages, scrollToBottom, { deep: true });
watch(() => sessions.activeSessionId, scrollToBottom);

onMounted(scrollToBottom);
</script>

<template>
  <main class="flex min-w-0 flex-1 flex-col bg-[#131313]">
    <div
      ref="transcriptEl"
      class="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:gap-8 md:p-10"
    >
      <template v-for="message in activeMessages" :key="message.id">
        <UserMessage v-if="message.role === 'user'" :message="message" />
        <AgentMessage
          v-else
          :message="message"
          :streaming="
            sessions.streamingSessionId === activeSession?.id &&
            message === activeMessages[activeMessages.length - 1]
          "
        />
      </template>
    </div>

    <UserInput
      v-model="prompt"
      :streaming="sessions.isStreaming"
      @submit="submitPrompt"
    />
  </main>
</template>
