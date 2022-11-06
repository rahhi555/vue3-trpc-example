<script setup lang="ts">
import { TRPCClientError } from '@trpc/client'
import { computed, type Ref } from 'vue';

const props = defineProps<{ e: unknown }>()

const errorMessage = computed(() => {
  if (props.e instanceof TRPCClientError) {
    return props.e.message
  } else {
    return '不明なエラーが発生しました'
  }
})
</script>

<template>
  <p v-show="e" style="color: red; font-size: small;">
    {{ errorMessage }}
  </p>
</template>
