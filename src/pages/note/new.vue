<script lang="ts" setup>
import DrawerLayout from '@/shared/ui/drawer/content-layout.vue';
</script>

<template>
  <DrawerLayout>
    <template #header>
      test
    </template>
    <template #default>
      <p>
        <RouterLink to="/note/1">1</RouterLink>
        <RouterLink to="/note/2">2</RouterLink>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, impedit! Commodi error
        esse reprehenderit minus eum, facilis laborum, ad maxime temporibus ipsam quaerat voluptatum
        et, possimus perspiciatis debitis qui natus?
      </p>
    </template>
  </DrawerLayout>
</template>
