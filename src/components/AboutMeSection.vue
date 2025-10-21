<template>
    <section class="relative w-full h-screen flex items-center justify-center" data-aos="fade-up" id="about">
        <!-- About me contents
         1. Name: Wong Hiu Tung (Annie)
         2. Current occupation: MPhil in CSE @ HKUST, under sup, of big boss big man, entrepreneur @ Adapto Technology Limited
         3. Interests: AI, Human computer interactions, enhansing interactions and productivity using digital platforms
         4. Fun facts (bcuz why not): 
            - I like fun facts
            - I can eat an entire box of tictacs in 2 mins (this is horrifying i agree)
            - I sometimes take VERY long walks
         wanna contact me? >> click here!
         >> if later have academic page also can link here
         >> put cv here if need in the future
          -->

        <div class="w-full px-5 sm:px-8 md:px-12 lg:px-8 max-w-screen-lg lg:max-w-screen-xl mx-auto relative">
            <div class="max-w-300 px-6 text-center">
                <h1 class="pt-4 text-text font-bold text-3xl md:text-4xl lg:text-5xl">About me</h1>
            </div>
            <div class="mt-8 md:mt-12 lg:mt-16">
                Wong Hiu Tung (Annie) is currently pursuing an MPhil in Computer Science and Engineering at HKUST, where she is a member of VisLab under the supervision of Professor QU Huamin. She completed her bachelor's degree in Computer Science and Engineering at HKUST in 2025. Currently, she is also in a start up project alongside her friends in educational technology.
                When she is not busy with school and serious business, you might see her taking long walks around the city, or lounging in a corner with a goodbook.
            </div>
            <div class="mt-3 md:mt-6 lg:mt-6">
                Fun facts about Annie:
                <ul class="list-disc list-inside mt-2">
                    <li>She can eat an entire box of Tic Tacs in 2 minutes (this is horrifying, I agree)</li>
                    <li>She likes fun facts</li>
                    <li>She sometimes takes VERY long walks</li>
                </ul>
            </div>
        </div>
         
    </section>
</template>

<script setup>
import AOS from 'aos';
import 'aos/dist/aos';
AOS.init(); 
</script>