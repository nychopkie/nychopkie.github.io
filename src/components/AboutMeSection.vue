<template>
    <section class="relative w-full h-screen flex items-center justify-center" data-aos="fade-up">
        <h1 class="">About Me Section</h1>
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
        <div class="w-full max-w-4xl mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl p-8 shadow-lg flex flex-col md:flex-row gap-6 items-center">
            <!-- Avatar / photo -->
            <div class="flex-shrink-0">
                <div class="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 flex items-center justify-center text-2xl font-semibold text-white">
                    A
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1">
                <h2 class="text-2xl font-bold mb-1">Wong Hiu Tung (Annie)</h2>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">MPhil in Computer Science & Engineering @ HKUST · Entrepreneur @ Adapto Technology Limited</p>

                <div class="mb-4">
                    <h3 class="font-medium mb-2">Interests</h3>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                        <li>Artificial Intelligence</li>
                        <li>Human–Computer Interaction</li>
                        <li>Enhancing productivity with digital platforms</li>
                    </ul>
                </div>

                <div class="mb-4">
                    <h3 class="font-medium mb-2">Fun facts</h3>
                    <ul class="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                        <li>I like fun facts.</li>
                        <li>I once ate an entire box of Tic Tacs in 2 minutes.</li>
                        <li>I enjoy very long walks.</li>
                    </ul>
                </div>

                <div class="flex flex-wrap gap-3 mt-2">
                    <a href="#contact" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Contact</a>
                    <a href="/academic" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800">Academic Page</a>
                    <a href="/assets/Annie_CV.pdf" download class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:opacity-90">Download CV</a>
                </div>
            </div>
        </div>
        
         
    </section>
</template>