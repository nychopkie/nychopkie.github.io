<template>
    <section class="relative w-full" data-aos="zoom-in-up">
        <div class="w-full px-5 sm:px-8 md:px-12 lg:px-8 max-w-screen-lg lg:max-w-screen-xl mx-auto relative">
            <div class="grid lg:grid-cols-2 gap-10 xl:gap-14 relative pt-24 lg:max-w-none max-w-2xl md:max-w-3xl mx-auto">
                <div class="lg:h-full md:flex">
                    <div class="flex w-full h-140 min-h-[24rem] lg:min-h-[none] lg:w-full items-center relative">
                        <div class="absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0-h[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-primary to-accent blur-2xl"></div>
                        <div class="absolute h-full z-10 p-2 -translate-y-1/2 top-1/2 lg:right-3 md:right-40 sm:right-16 shadow-lg border border-accent">
                            <img src="../assets/me_pic.jpg" alt="Hero Image" width="500" height="auto" loading="lazy"
                            class="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
                <div class="lg:py-6">
                    <div class="text-center lg:text-left">
                        <h1 class="pt-4 text-text font-bold text-6xl md:text-7xl lg:text-8xl">
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent "><AnimatedTitle /></span>
                        </h1>
                        <h1 class="pt-4 text-text font-bold text-2xl md:text-3xl lg:text-4xl">
                            I'm Annie Wong.
                        </h1>
                    </div>
                    <p class="text-gray-600 pt-8 text-center lg:text-left mx-auto max-w-xl">
                        Welcome to my personal webpage! Here you can learn more about me.
                        <br/><br/>
                        I'm currently a MPhil student in Computer Science and Engineering at HKUST and a member of VisLab, working under the supervision of Professor QU Huamin.
                        <br/><br/>
                        My research interests include Human-Computer Interaction, visual-spatial reasoning in computer vision, and enhancing interactions and productivity using digital platforms.
                    </p>
                    <div class="flex items-center gap-3 pt-9 flex-col sm:flex-row sm:w-max sm:mx-auto lg:mx-0">
                        <button class="px-6 md:px-7 py-3 rounded-full relative group w-full sm:w-max flex justify-center">
                            <span class="rounded-full absolute inset-0 w-full h-full bg-accent transition group-hover:bg-primary ease-linear"></span>
                            <span class="relative text-text font-semibold group-hover:-translate-x-0">
                                Contact me
                            </span>
                        </button>
                        <button class="px-6 md:px-7 py-3 rounded-full relative group w-full sm:w-max flex justify-center">
                            <span class="absolute inset-0 w-full h-full border-2 border-accent rounded-full transition group-hover:border-primary ease-linear"></span>
                            <span class="relative text-text font-semibold group-hover:-translate-y-0">
                                Check out my projects
                            </span>
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
</template>

<script setup>
import AOS from 'aos';
import 'aos/dist/aos';
AOS.init(); 
// import Components Asyncronously
import { defineAsyncComponent } from 'vue';
const AnimatedTitle = defineAsyncComponent(() => import('./utils/AnimatedTitle.vue'));
</script>
<style scoped> 
</style>