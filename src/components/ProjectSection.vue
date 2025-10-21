<template>
    <section
        class="relative w-full min-h-screen flex items-start sm:items-center justify-center py-12 sm:py-0"
        data-aos="fade-up"
        id="projects"
    >
        <div class="w-full px-5 sm:px-8 md:px-12 lg:px-8 max-w-screen-lg lg:max-w-screen-xl mx-auto relative">
            <div class="max-w-300 px-6 text-center">
                <h1 class="pt-4 text-text font-bold text-3xl md:text-4xl lg:text-5xl">Projects</h1>
                <p class="mt-6">Also known as stuff I have done or is currently doing</p>
            </div>

            <div class="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <article
                    v-for="(p, i) in projects"
                    :key="p.id ?? i"
                    class="bg-white/5 border border-gray-700 rounded-lg p-4 md:p-6 flex flex-col shadow-sm hover:shadow-md transition break-words"
                >
                    <header class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                        <h3 class="text-lg font-semibold text-text">{{ p.title }}</h3>
                        <span class="text-sm text-muted px-2 py-1 rounded bg-muted/10 whitespace-nowrap">{{ p.type }}</span>
                    </header>

                    <p class="mt-3 text-sm text-muted flex-1 break-words">{{ p.description }}</p>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <span
                            v-for="(tag, ti) in p.tags"
                            :key="ti"
                            class="text-xs px-2 py-1 bg-muted/10 rounded"
                        >
                            {{ tag }}
                        </span>
                    </div>

                    <div class="mt-5 flex flex-wrap gap-3">
                        <a
                            v-if="p.links?.live"
                            :href="p.links.live"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 text-sm font-medium rounded bg-primary transition text-white hover:bg-accent ease-linear"
                        >
                            Demo
                        </a>

                        <a
                            v-if="p.links?.overview"
                            :href="p.links.overview"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 text-sm font-medium rounded bg-primary transition text-white hover:bg-accent ease-linear"
                        >
                            Overview
                        </a>

                        <a
                            v-if="p.links?.repo"
                            :href="p.links.repo"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 text-sm font-medium rounded border border-gray-700 text-text transition hover:bg-accent hover:text-white ease-linear"
                        >
                            Code
                        </a>
                        
                        <a
                            v-if="p.links?.paper"
                            :href="p.links.paper"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 text-sm font-medium rounded border border-gray-700 text-text transition hover:bg-accent hover:text-white ease-linear"
                        >
                            Paper
                        </a>

                        <a
                            v-if="p.links?.secondary"
                            :href="p.links.secondary"
                            target="_blank"
                            rel="noopener"
                            class="inline-flex w-full sm:w-auto items-center justify-center px-3 py-2 text-sm font-medium rounded border border-gray-700 text-text transition hover:bg-accent hover:text-white ease-linear"
                        >
                            {{ p.links.secondaryText ?? 'Notes' }}
                        </a>

                        <span v-if="!p.links || Object.keys(p.links).length === 0" class="text-sm text-muted w-full">No links</span>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script setup>
const projects = [
  {
    id: 'qbuddy',
    title: 'Qbuddy',
    type: 'CityU Tech300',
    description: 'Entrepreneurial project: A personlaized question generation website for Hong Kong Primary students. ',
    tags: ['Ed Tech', 'Agents', 'MCP'],
    links: {
      live: 'https://qbuddy.com.hk/',
    //   repo: 'https://github.com/nychopkie/qbuddy',
    //   overview: 'https://nychopkie.github.io/qbuddy-overview'
    }
  },
  {
    id: 'qbuddy_image_gen',
    title: 'Math Diagram Generation',
    type: 'MCP',
    description: 'An image generation system for generating diagrams for mathematics questions based on the question provided. Designed to complement Qbuddy.',
    tags: ['python', 'Agents', 'LLMs'],
    links: {
      live: 'To be added soon',
      repo: 'To be added soon',
      paper: 'To be added soon'
    }
  },
  {
    id: 'cursed-smile-transformer',
    title: 'Smile Transformer',
    type: 'Course Project',
    description: 'Experimentation with cycle GAN and diffusion to generate smiling faces from detected non-smiling faces. A bit cursed but fun!',
    tags: ['PyTorch', 'Computer vision', 'GAN'],
    links: {
      repo: 'https://github.com/nychopkie/Smile'
    }
  },
  {
    id: 'comp4651',
    title: 'Collabroative Coding Monitoring Platform',
    type: 'Course Project',
    description: 'Experimentation with cycle GAN to generate smiling faces from detected non-smiling faces. A bit cursed but fun!',
    tags: ['Server', 'Docker', 'cloud computing'],
    links: {
      repo: 'https://github.com/pseusys/dspdavscp'
    }
  }
]
</script>
