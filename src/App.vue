<template>
  <div class="bg-background min-h-screen">
    <NavBar />
  </div>

</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// import Components Asyncronously
const NavBar = defineAsyncComponent(() => import('./components/NavBar.vue'));
const HeroSection = defineAsyncComponent(() => import('./components/HeroSection.vue'));
</script>

