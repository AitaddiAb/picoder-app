<script setup>
import { ref } from 'vue'
import AgentMessage from '../../Components/AgentMessage.vue'
import UserInput from '../../Components/UserInput.vue'
import UserMessage from '../../Components/UserMessage.vue'

defineProps({
  activeSession: { type: Object, default: null },
  messages: { type: Array, default: () => [] },
  streamingSessionId: { type: String, default: null },
  isStreaming: { type: Boolean, default: false },
  prompt: { type: String, default: '' },
})

const emit = defineEmits(['update:prompt', 'submit-prompt'])
const transcriptEl = ref(null)

function scrollToBottom() {
  if (transcriptEl.value) {
    transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight
  }
}

defineExpose({ scrollToBottom })
</script>

<template>
  <main class="flex min-w-0 flex-1 flex-col bg-[#131313] pt-9">
    <div ref="transcriptEl" class="flex flex-1 flex-col gap-6 overflow-y-auto p-4 md:gap-8 md:p-10">
      <template v-for="message in messages" :key="message.id">
        <UserMessage v-if="message.role === 'user'" :message="message" />
        <AgentMessage
          v-else
          :message="message"
          :streaming="streamingSessionId === activeSession?.id && message === messages[messages.length - 1]"
        />
      </template>
    </div>

    <UserInput
      :model-value="prompt"
      :streaming="isStreaming"
      @update:model-value="emit('update:prompt', $event)"
      @submit="emit('submit-prompt')"
    />
  </main>
</template>
