<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

import { useGetNote } from '@/entities/note/queries/use-get-note';

import DrawerLayout from '@/shared/ui/drawer/content-layout.vue';
import Button from '@/shared/ui/button.vue';

const route = useRoute();

const noteId = computed<string>(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id[0];
  }

  return route.params.id;
});

const { data, refetch } = useGetNote(noteId);
watch(noteId, () => refetch());
</script>

<template>
  <DrawerLayout>
    <template #header>
      {{data?.id}}
    </template>
    <template #default>
      <p>
        <Button>
          <RouterLink to="/note/1">1</RouterLink>
        </Button>

        <Button>
          <RouterLink to="/note/2">2</RouterLink>
        </Button>

        <Button>
          <RouterLink to="/note/new">new</RouterLink>
        </Button>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, impedit! Commodi error
        esse reprehenderit minus eum, facilis laborum, ad maxime temporibus ipsam quaerat voluptatum
        et, possimus perspiciatis debitis qui natus?
      </p>
    </template>
  </DrawerLayout>
</template>
