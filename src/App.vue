<template>
  <div class="bg-background min-h-screen">
    <NavBar />
    <HeroSection />
    <AboutMeSection id="about"/>
    <ProjectSection id="projects"/>
    <ContactSection id="contact"/>
    <GameSection id="game"/>
  </div>

</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// import Components Asyncronously
const NavBar = defineAsyncComponent(() => import('./components/NavBar.vue'));
const HeroSection = defineAsyncComponent(() => import('./components/HeroSection.vue'));
const AboutMeSection = defineAsyncComponent(() => import('./components/AboutMeSection.vue'));
const ProjectSection = defineAsyncComponent(() => import('./components/ProjectSection.vue'));
const ContactSection = defineAsyncComponent(() => import('./components/ContactSection.vue'));
const GameSection = defineAsyncComponent(() => import('./components/GameSection.vue'));
</script>

