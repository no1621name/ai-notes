<script lang="ts" setup>
import { useGetNote } from './queries/use-get-note';
const props = defineProps<{ id: string }>();
const { data, isLoading } = useGetNote(props.id);
</script>

<template>
  <div>{{ isLoading ? 'loading' : JSON.stringify(data) }}</div>
</template>
