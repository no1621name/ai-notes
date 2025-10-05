<script lang="ts" setup>
import { toRefs } from 'vue';
import { useGetNote } from './queries/use-get-note';
const props = defineProps<{ id: string }>();
const pr = toRefs(props);
const { data, isLoading } = useGetNote(pr.id);
</script>

<template>
  <div>{{ isLoading ? 'loading' : data?.id }}</div>
  <!-- <Button @click="addNote">create</Button> -->
</template>
