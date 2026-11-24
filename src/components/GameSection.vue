<template>
  <section id="game" class="turtle-section min-h-screen" aria-labelledby="turtle-title">
    <div class="game-wrap">
      <header class="mb-6 text-center">
        <h2 id="turtle-title" class="text-3xl font-bold md:text-4xl lg:text-5xl">Feed the Turtle</h2>
        <p class="mt-3">Drag the turtle around or select Feed to drop a snack on the grass.</p>
        <p class="mt-3">This was a small game I made in a day as an example for teaching secondary python programming. I got a bit too attached to this turtle so here is it for everyone to enjoy as well.</p>
      </header>

      <div class="pond-card">
        <div
          ref="pond"
          class="pond"
          :class="{ 'placing-food': foodPosition }"
          role="group"
          tabindex="-1"
          aria-label="Turtle habitat"
          aria-describedby="food-keys"
          @pointermove="aimFood"
          @click="placeFoodAtPointer"
          @keydown="moveFoodWithKeys"
        >
          <img class="pond-art" :src="pondArt" alt="" width="1000" height="600" loading="lazy" draggable="false" />
          <img v-if="game.food" class="pellet" :src="pellet" :style="place(game.food)" alt="" draggable="false" />
          <img
            v-if="foodPosition"
            class="food-can"
            :class="{ 'invalid-spot': !canPlaceFood }"
            :src="foodJar"
            :style="place(foodPosition)"
            alt=""
            draggable="false"
          />
          <div
            v-if="game.speech"
            class="speech-bubble"
            :class="{ 'speech-below': game.y < 0.48 }"
            :style="{ '--speech-x': `${game.x * 100}%`, top: `${game.y * 100}%` }"
            aria-hidden="true"
          >
            <img :src="speechBubble" alt="" draggable="false" />
            <span>{{ game.speech }}</span>
          </div>
          <button
            type="button"
            class="turtle-handle"
            :style="place(game)"
            aria-label="Pick up turtle"
            aria-describedby="turtle-keys"
            :aria-pressed="game.action === 'held'"
            :disabled="Boolean(foodPosition)"
            @pointerdown="startDrag"
            @pointermove="drag"
            @pointerup="endDrag"
            @pointercancel="endDrag"
            @lostpointercapture="endDrag"
            @click="toggleKeyboardPickup"
            @keydown="moveWithKeys"
            @blur="releaseKeyboardPickup"
          >
            <img
              :src="sprite.url"
              :style="{ width: `${sprite.width / 128 * 100}%` }"
              alt=""
              draggable="false"
            />
          </button>
          <button
            ref="feedButton"
            type="button"
            class="feed-button"
            aria-label="Feed turtle"
            :aria-pressed="Boolean(foodPosition)"
            :aria-disabled="Boolean(game.food)"
            @click.stop="toggleFoodPlacement"
          >
            <img :src="feedLogo" width="134" height="135" alt="" draggable="false" />
          </button>
        </div>
      </div>
      <p id="turtle-keys" class="sr-only">Press Space or Enter to pick up and put down the turtle. Use the arrow keys to move it while it is held.</p>
      <p id="food-keys" class="sr-only">Use the arrow keys to move the food can. Press Space or Enter to place food, or Escape to cancel.</p>
      <p class="sr-only" aria-live="polite">{{ feedAnnouncement }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import pondArt from '../assets/turtle/turtbg.gif';
import idleLeft from '../assets/turtle/turlteL.gif';
import idleRight from '../assets/turtle/turlteR.gif';
import walkLeftOne from '../assets/turtle/TL1.gif';
import walkLeftTwo from '../assets/turtle/TL2.gif';
import walkRightOne from '../assets/turtle/TR1.gif';
import walkRightTwo from '../assets/turtle/TR2.gif';
import heldLeft from '../assets/turtle/turtPickuppngL.gif';
import heldRight from '../assets/turtle/turtPickuppngR.gif';
import swimLeft from '../assets/turtle/turtSwimL.gif';
import swimRight from '../assets/turtle/turtSwimR.gif';
import sleeping from '../assets/turtle/turtSleep.gif';
import feedLogo from '../assets/turtle/foodIcon.gif';
import foodJar from '../assets/turtle/turtleFoodJar.gif';
import pellet from '../assets/turtle/turtleFood.gif';
import speechBubble from '../assets/turtle/speech.gif';
import {
  advanceTurtle,
  createTurtleGame,
  feedTurtle,
  isFeedSpot,
  moveTurtle,
  pickUpTurtle,
  releaseTurtle,
} from './utils/turtleGame.js';

const sprites = {
  left: {
    idle: { url: idleLeft, width: 128 },
    walking: [{ url: walkLeftOne, width: 125 }, { url: walkLeftTwo, width: 124 }],
    held: { url: heldLeft, width: 102 },
    swimming: { url: swimLeft, width: 128 },
  },
  right: {
    idle: { url: idleRight, width: 128 },
    walking: [{ url: walkRightOne, width: 125 }, { url: walkRightTwo, width: 124 }],
    held: { url: heldRight, width: 102 },
    swimming: { url: swimRight, width: 128 },
  },
};
const keyMoves = {
  ArrowLeft: [-0.025, 0],
  ArrowRight: [0.025, 0],
  ArrowUp: [0, -0.04],
  ArrowDown: [0, 0.04],
};

const pond = ref(null);
const feedButton = ref(null);
const game = reactive(createTurtleGame());
const foodPosition = ref(null);
const feedAnnouncement = ref('');
let dragPointer = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let visible = false;
let frameId = 0;
let previousFrame = null;
let observer;

const sprite = computed(() => {
  const facing = sprites[game.facing];
  if (game.action === 'held') return facing.held;
  if (game.action === 'sleeping') return { url: sleeping, width: 126 };
  if (game.inWater) return facing.swimming;
  if (game.isMoving || game.action === 'eating') {
    return facing.walking[game.step];
  }
  return facing.idle;
});

const canPlaceFood = computed(() => {
  const spot = foodPosition.value;
  return spot && isFeedSpot(spot.x, spot.y);
});

function place({ x, y }) {
  return { left: `${x * 100}%`, top: `${y * 100}%` };
}

function pointerPosition(event) {
  const bounds = pond.value.getBoundingClientRect();
  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

function stopFoodPlacement() {
  foodPosition.value = null;
  if (document.activeElement === pond.value) feedButton.value.focus({ preventScroll: true });
}

function cancelFoodPlacement() {
  stopFoodPlacement();
  feedAnnouncement.value = 'Food placement canceled.';
}

function toggleFoodPlacement(event) {
  if (game.food || dragPointer !== null) return;
  if (foodPosition.value) {
    cancelFoodPlacement();
    return;
  }

  foodPosition.value = { x: 0.78, y: 0.78 };
  feedAnnouncement.value = 'Choose a spot on the grass.';
  if (event.detail === 0) pond.value.focus({ preventScroll: true });
}

function aimFood(event) {
  if (foodPosition.value && event.target !== feedButton.value) {
    foodPosition.value = pointerPosition(event);
  }
}

function dropFood(spot) {
  foodPosition.value = spot;
  if (!feedTurtle(game, spot.x, spot.y)) {
    feedAnnouncement.value = 'Food can only go on the grass.';
    return;
  }
  stopFoodPlacement();
  feedAnnouncement.value = game.action === 'sleeping'
    ? 'Food placed. The turtle will eat when it wakes up.'
    : 'Food placed.';
}

function placeFoodAtPointer(event) {
  if (foodPosition.value && event.detail > 0) dropFood(pointerPosition(event));
}

function moveFoodWithKeys(event) {
  if (!foodPosition.value) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    cancelFoodPlacement();
    return;
  }
  if (event.target !== pond.value) return;

  const movement = keyMoves[event.key];
  if (movement) {
    event.preventDefault();
    foodPosition.value = {
      x: Math.min(0.975, Math.max(0.025, foodPosition.value.x + movement[0])),
      y: Math.min(0.96, Math.max(0.04, foodPosition.value.y + movement[1])),
    };
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    dropFood(foodPosition.value);
  }
}

watch(() => game.food, (food, previousFood) => {
  if (previousFood && !food) feedAnnouncement.value = 'The turtle finished its snack.';
});

function startDrag(event) {
  if (event.button !== 0 || dragPointer !== null) return;
  const { x, y } = pointerPosition(event);
  dragOffsetX = x - game.x;
  dragOffsetY = y - game.y;
  dragPointer = event.pointerId;
  event.currentTarget.setPointerCapture(event.pointerId);
  pickUpTurtle(game);
}

function drag(event) {
  if (event.pointerId !== dragPointer) return;
  const { x, y } = pointerPosition(event);
  moveTurtle(game, x - dragOffsetX, y - dragOffsetY);
}

function endDrag(event) {
  if (event.pointerId !== dragPointer) return;
  dragPointer = null;
  releaseTurtle(game);
}

function toggleKeyboardPickup(event) {
  if (event.detail !== 0 || dragPointer !== null) return;
  if (game.action === 'held') releaseTurtle(game);
  else pickUpTurtle(game);
}

function releaseKeyboardPickup() {
  if (dragPointer === null && game.action === 'held') releaseTurtle(game);
}

function moveWithKeys(event) {
  if (dragPointer !== null || game.action !== 'held') return;
  if (event.key === 'Escape') {
    event.preventDefault();
    releaseTurtle(game);
  }
  const movement = keyMoves[event.key];
  if (movement) {
    event.preventDefault();
    moveTurtle(game, game.x + movement[0], game.y + movement[1]);
  }
}

function animate(time) {
  if (previousFrame !== null) {
    advanceTurtle(game, Math.min((time - previousFrame) / 1000, 0.1));
  }
  previousFrame = time;
  frameId = requestAnimationFrame(animate);
}

function setVisible(isVisible) {
  if (visible === isVisible) return;
  visible = isVisible;
  previousFrame = null;
  if (visible) frameId = requestAnimationFrame(animate);
  else cancelAnimationFrame(frameId);
}

onMounted(() => {
  for (const url of [
    idleLeft, idleRight, walkLeftOne, walkLeftTwo, walkRightOne, walkRightTwo,
    heldLeft, heldRight, swimLeft, swimRight, sleeping, foodJar, pellet, speechBubble,
  ]) {
    const image = new Image();
    image.src = url;
  }

  observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
  observer.observe(pond.value);
});

onUnmounted(() => {
  observer?.disconnect();
  setVisible(false);
});
</script>

<style scoped>
.turtle-section {
  display: grid;
  align-items: center;
  padding: 3rem clamp(1rem, 5vw, 2rem);
  color: var(--color-text);
}

.game-wrap {
  width: min(100%, 52rem);
  margin-inline: auto;
}

.pond-card {
  overflow: hidden;
  border: 1px solid #d4ded8;
  border-radius: 1.125rem;
  background: #f8faf8;
  box-shadow: 0 10px 28px rgb(42 74 58 / 10%);
}

.pond {
  position: relative;
  isolation: isolate;
  aspect-ratio: 5 / 3;
  overflow: hidden;
  background: #9ed675;
  user-select: none;
}

.pond-art {
  display: block;
  width: 100%;
  height: 100%;
}

.pond.placing-food {
  cursor: crosshair;
}

.pond:focus-visible {
  outline: 3px solid #244c3f;
  outline-offset: -3px;
}

.turtle-handle,
.pellet,
.food-can,
.speech-bubble {
  position: absolute;
  transform: translate(-50%, -50%);
}

.turtle-handle {
  display: grid;
  z-index: 1;
  width: 12.8%;
  aspect-ratio: 128 / 115;
  place-items: center;
  cursor: grab;
  touch-action: none;
  border-radius: 35%;
}

.turtle-handle::before {
  position: absolute;
  inset: 50% auto auto 50%;
  width: max(100%, 44px);
  height: max(100%, 44px);
  transform: translate(-50%, -50%);
  content: '';
}

.turtle-handle[aria-pressed='true'] {
  cursor: grabbing;
}

.turtle-handle:focus-visible,
.feed-button:focus-visible {
  outline: 3px solid #244c3f;
  outline-offset: 1px;
}

.placing-food .turtle-handle,
.turtle-handle img,
.pellet,
.food-can,
.feed-button img,
.speech-bubble {
  pointer-events: none;
}

.pellet {
  width: 5%;
}

.food-can {
  z-index: 3;
  width: max(7.4%, 28px);
  filter: drop-shadow(0 2px 3px rgb(28 54 31 / 35%));
}

.food-can.invalid-spot {
  opacity: 0.65;
  filter: grayscale(1);
}

.speech-bubble {
  --bubble-half-width: clamp(45px, 11.65%, 90px);
  left: clamp(
    calc(var(--bubble-half-width) + 4px),
    var(--speech-x),
    calc(100% - var(--bubble-half-width) - 4px)
  );
  z-index: 2;
  display: grid;
  width: clamp(90px, 23.3%, 180px);
  transform: translate(-50%, -124%);
  place-items: center;
  color: #273b35;
  font-size: clamp(0.875rem, 2.3vw, 1rem);
  font-weight: 700;
}

.speech-bubble img {
  width: 100%;
}

.speech-bubble span {
  position: absolute;
  inset: 26% 10% 22% 10%;
  display: grid;
  place-items: center;
  text-align: center;
}

.speech-below {
  transform: translate(-50%, 26%);
}

.speech-below img {
  transform: scaleY(-1);
}

.speech-below span {
  inset-block: 22% 26%;
}

.feed-button {
  position: absolute;
  right: max(0.6%, 5px);
  bottom: max(0.8%, 5px);
  z-index: 4;
  width: max(13.4%, 44px);
  border-radius: 50%;
  cursor: pointer;
}

.feed-button img {
  display: block;
  width: 100%;
  height: auto;
}

.feed-button[aria-pressed='true'],
.feed-button:hover:not([aria-disabled='true']) {
  filter: brightness(1.14);
}

.feed-button[aria-disabled='true'] {
  opacity: 0.55;
  cursor: default;
}
</style>
