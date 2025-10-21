<template>
    <div
        class="animated-title"
        @mouseenter="pauseOnHover && pause()"
        @mouseleave="pauseOnHover && resume()"
        role="heading"
        aria-live="polite"
    >
        <h1 class="title">
            <template v-if="!hasItems">
                <slot>{{ fallback }}</slot>
            </template>
            <template v-else>
                <span class="typed">{{ displayedText }}</span>
            </template>
            <span class="caret" aria-hidden="true">|</span>
        </h1>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps({
    items: {
        type: Array,
        default: () => ["Hello!","你好啊！","Welcome!!","Hi!!!","歡迎！"]
    },
    interval: {
        type: Number,
        default: 3000 // ms to wait after a full typed string before moving to next
    },
    loop: {
        type: Boolean,
        default: true
    },
    // deprecated animation prop kept for compatibility but not used for typewriter
    animation: {
        type: String,
        default: 'fade',
        validator: (v) => ['fade', 'slide', 'scale', 'type'].includes(v)
    },
    startIndex: {
        type: Number,
        default: 0
    },
    pauseOnHover: {
        type: Boolean,
        default: true
    },
    fallback: {
        type: String,
        default: 'Hello'
    },
    typingSpeed: {
        type: Number,
        default: 75 // ms per character
    },
    backtrack: {
        type: Boolean,
        default: true // enable backtracking delete animation before next item
    },
    backtrackSpeed: {
        type: Number,
        default: 40 // ms per character when deleting
    },
    // new: text to show once before any animation begins
    initialText: {
        type: String,
        default: 'Hello!' // if empty, will use fallback when provided
    },
    // new: how long to show initialText before starting animation (ms)
    initialDelay: {
        type: Number,
        default: 100
    }
})

const hasItems = computed(() => Array.isArray(props.items) && props.items.length > 0)
const currentIndex = ref(Math.min(Math.max(0, props.startIndex), Math.max(0, props.items.length - 1)) || 0)

const displayedText = ref('')
const typingTimer = ref(null)
const holdTimer = ref(null)
const initialTimer = ref(null)
const isPaused = ref(false)
const charIndex = ref(0)
const isBacktracking = ref(false)

// cleanup helpers
function clearTypingTimer() {
    if (typingTimer.value) {
        clearInterval(typingTimer.value)
        typingTimer.value = null
    }
}
function clearHoldTimer() {
    if (holdTimer.value) {
        clearTimeout(holdTimer.value)
        holdTimer.value = null
    }
}
function clearInitialTimer() {
    if (initialTimer.value) {
        clearTimeout(initialTimer.value)
        initialTimer.value = null
    }
}
function clearAllTimers() {
    clearTypingTimer()
    clearHoldTimer()
    clearInitialTimer()
}

/* Typing logic */

// start typing from a given char index (used for resume)
function startTypingFrom(start = 0) {
    clearTypingTimer()
    isBacktracking.value = false
    const text = props.items[currentIndex.value] ?? ''
    charIndex.value = start
    // immediate update in case start > 0
    displayedText.value = text.slice(0, charIndex.value)
    if (charIndex.value >= text.length) {
        // already complete
        scheduleNext()
        return
    }
    if (isPaused.value) return
    typingTimer.value = setInterval(() => {
        charIndex.value++
        displayedText.value = text.slice(0, charIndex.value)
        if (charIndex.value >= text.length) {
            clearTypingTimer()
            scheduleNext()
        }
    }, Math.max(1, props.typingSpeed))
}

function startBacktrackingFrom(start = null) {
    clearTypingTimer()
    isBacktracking.value = true
    const text = props.items[currentIndex.value] ?? ''
    // if start not provided, begin from current displayed length
    charIndex.value = start == null ? displayedText.value.length : start
    displayedText.value = text.slice(0, charIndex.value)
    // if already empty, move to next immediately
    if (charIndex.value <= 0) {
        isBacktracking.value = false
        next()
        return
    }
    if (isPaused.value) return
    typingTimer.value = setInterval(() => {
        charIndex.value--
        displayedText.value = text.slice(0, charIndex.value)
        if (charIndex.value <= 0) {
            clearTypingTimer()
            isBacktracking.value = false
            // after backtrack completed, advance to next (if allowed)
            next()
        }
    }, Math.max(1, props.backtrackSpeed))
}

function typeCurrent() {
    clearAllTimers()
    isBacktracking.value = false
    if (!hasItems.value) {
        displayedText.value = props.fallback
        return
    }
    displayedText.value = ''
    startTypingFrom(0)
}

function scheduleNext() {
    clearHoldTimer()
    // if we shouldn't advance, do nothing
    if (!props.loop && currentIndex.value >= props.items.length - 1) return
    if (props.interval <= 0) return
    holdTimer.value = setTimeout(() => {
        if (!isPaused.value) {
            if (props.backtrack) {
                // start deleting before moving to next
                startBacktrackingFrom()
            } else {
                next()
            }
        }
    }, props.interval)
}

function next() {
    if (!hasItems.value) return
    if (currentIndex.value < props.items.length - 1) {
        currentIndex.value++
    } else if (props.loop) {
        currentIndex.value = 0
    } else {
        // no loop and reached end -> do nothing (keep last typed)
        return
    }
    typeCurrent()
}

/* start/stop/pause/resume */

function start() {
    clearAllTimers()
    if (!hasItems.value) {
        displayedText.value = props.fallback
        return
    }
    isPaused.value = false
    typeCurrent()
}

function stop() {
    clearAllTimers()
    isPaused.value = false
    isBacktracking.value = false
}

function pause() {
    // pause typing and hold timers, remember current charIndex and displayedText
    isPaused.value = true
    clearAllTimers()
}

function resume() {
    if (!isPaused.value) return
    isPaused.value = false
    if (!hasItems.value) return
    const fullText = props.items[currentIndex.value] ?? ''
    // if currently backtracking (was deleting), resume deleting
    if (isBacktracking.value) {
        if (displayedText.value.length > 0) {
            startBacktrackingFrom(displayedText.value.length)
        } else {
            // nothing to delete, go to next
            next()
        }
        return
    }
    // if typing was incomplete, resume typing
    if (displayedText.value.length < fullText.length) {
        startTypingFrom(displayedText.value.length)
    } else {
        // finished typing; resume hold/backtrack timer
        scheduleNext()
    }
}

/* lifecycle & watchers */

onMounted(() => {
    // show a default initial text before animation starts
    const initial = props.initialText || props.fallback || ''
    if (initial && props.initialDelay > 0) {
        displayedText.value = initial
        clearInitialTimer()
        initialTimer.value = setTimeout(() => {
            // clear the initial display and begin animation
            displayedText.value = 'Hello!'
            start()
            initialTimer.value = null
        }, props.initialDelay)
    } else {
        // no initial text or zero delay -> start immediately
        start()
    }
})
onUnmounted(stop)

watch(
    () => [props.items, props.interval],
    () => {
        // reset index if out of bounds and restart typing
        if (!hasItems.value) {
            stop()
            currentIndex.value = 0
            displayedText.value = props.fallback
            return
        }
        if (currentIndex.value >= props.items.length) currentIndex.value = 0
        start()
    },
    { deep: true }
)

// ensure typing restarts when index changes programmatically
watch(currentIndex, () => {
    typeCurrent()
})
</script>

<style scoped>
.animated-title {
    display: inline-block;
    line-height: 1;
    cursor: default;
    user-select: none;
}

/* blinking caret */
.caret {
    display: inline-block;
    margin-left: 2px;
    opacity: 1;
    animation: blink 1s steps(2, start) infinite;
    font-weight: 700;
}
@keyframes blink {
    50% { opacity: 0; }
}
</style>