const SCENE_ASPECT = 1000 / 600
const POND_ENTRY = { x: 0.328, y: 0.627 }
const LAND_CORNER = { x: 0.49, y: 0.73 }
const SLEEP_SPOT = { x: 0.87, y: 0.15 }
const TURTLE_INSET_X = 0.067
const TURTLE_INSET_Y = 0.102
const FOOD_INSET_X = 0.025
const FOOD_INSET_Y = 0.0275
const EATING_DURATION = 1.2
const EATING_CYCLES = 3
const EATING_DISTANCE = 0.01
const WALK_SPEED = 0.09
const SWIM_SPEED = 0.1
const FOOD_SPEED = 0.15
const WALK_LEGS = 3

// Normalized [y, x] points along the pond in the original backdrop.
const SHORELINE = [
  [0, 0.445],
  [0.083, 0.43],
  [0.167, 0.39],
  [0.217, 0.403],
  [0.25, 0.375],
  [0.325, 0.335],
  [0.375, 0.28],
  [0.5, 0.28],
  [0.583, 0.25],
  [0.625, 0.21],
  [0.65, 0.18],
  [0.675, 0],
]

// Normalized [y, left, right] slices through the purple sleeping mat.
const SLEEP_MAT = [
  [0.02, 0.869, 0.869],
  [0.083, 0.79, 0.956],
  [0.117, 0.748, 1],
  [0.183, 0.676, 1],
  [0.217, 0.676, 1],
  [0.3, 0.734, 0.99],
  [0.333, 0.766, 0.952],
  [0.367, 0.828, 0.918],
  [0.385, 0.895, 0.895],
]

const SPEECH = ['Hello!', 'hehe', 'FEED ME!!!', 'mmmmmmm', 'Swim?', 'Sleep?', 'OvO', '*turtle noise*', 'say something', 'its turtle time *turle all over*', '...', 'I am turtle']

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum)
}

function pondEdge(y) {
  for (let index = 1; index < SHORELINE.length; index++) {
    const [bottom, right] = SHORELINE[index]
    if (y <= bottom) {
      const [top, left] = SHORELINE[index - 1]
      const progress = (y - top) / (bottom - top)
      return left + (right - left) * progress
    }
  }
  return 0
}

function onSleepMat(x, y) {
  for (let index = 1; index < SLEEP_MAT.length; index++) {
    const [top, topLeft, topRight] = SLEEP_MAT[index - 1]
    const [bottom, bottomLeft, bottomRight] = SLEEP_MAT[index]
    if (y >= top && y <= bottom) {
      const progress = (y - top) / (bottom - top)
      const left = topLeft + (bottomLeft - topLeft) * progress
      const right = topRight + (bottomRight - topRight) * progress
      return x >= left && x <= right
    }
  }
  return false
}

export function isFeedSpot(x, y) {
  return Number.isFinite(x) && Number.isFinite(y)
    && x >= FOOD_INSET_X && x <= 1 - FOOD_INSET_X
    && y >= FOOD_INSET_Y && y <= 1 - FOOD_INSET_Y
    && x >= pondEdge(y)
    && !onSleepMat(x, y)
}

function landRoute(from, to) {
  // Between shoreline vertices the edge is straight, so vertices suffice
  // to check whether a trip between two dry points cuts through the pond.
  const crossesPond = SHORELINE.some(([y, x]) => {
    const progress = (y - from.y) / (to.y - from.y)
    return progress > 0 && progress < 1 && from.x + (to.x - from.x) * progress < x
  })
  return crossesPond ? [LAND_CORNER, to] : [to]
}

export function createTurtleGame(random = Math.random) {
  return {
    x: 0.53,
    y: 0.52,
    facing: 'left',
    action: 'resting',
    food: null,
    speech: null,
    speechTimer: 2.7,
    random,
    route: [],
    plan: { action: 'resting', target: null, remaining: 0.7, legsLeft: 0, pauseIn: Infinity, pauseRemaining: 0 },
    interruptedPlan: null,
    animationTime: 0,
    get step() {
      return Math.floor(this.animationTime * 5) % 2
    },
    get inWater() {
      return this.x < pondEdge(this.y)
    },
    get isMoving() {
      return this.action !== 'held' && this.route.length > 0 && this.plan.pauseRemaining === 0
    },
  }
}

function chooseBetween(game, minimum, maximum) {
  return minimum + game.random() * (maximum - minimum)
}

function setMotionAction(game) {
  if (game.plan.action === 'eating') {
    game.action = 'seeking-food'
  } else {
    game.action = game.inWater ? 'swimming' : 'walking'
  }
}

function isMovementPlan(action) {
  return action === 'walking' || action === 'swimming'
}

function followPlan(game) {
  const { action, target } = game.plan

  if (!target) {
    game.route = []
    if (isMovementPlan(action)) setMotionAction(game)
    else game.action = action
    return
  }

  const targetIsInWater = target.x < pondEdge(target.y)
  if (targetIsInWater) {
    game.route = game.inWater ? [target] : [...landRoute(game, POND_ENTRY), target]
  } else {
    game.route = game.inWater ? [POND_ENTRY, ...landRoute(POND_ENTRY, target)] : landRoute(game, target)
  }
  setMotionAction(game)
}

function setPlan(game, action, target, remaining, legsLeft = 0) {
  let pauseIn = Infinity
  if (isMovementPlan(action)) {
    pauseIn = isMovementPlan(game.plan.action) ? game.plan.pauseIn : chooseBetween(game, 2.5, 6.5)
  }
  game.plan = { action, target, remaining, legsLeft, pauseIn, pauseRemaining: 0 }
  if (action !== 'walking') game.speech = null
  followPlan(game)
}

function walkTarget(game) {
  const y = chooseBetween(game, 0.35, 0.82)
  const x = chooseBetween(game, Math.max(0.18, pondEdge(y - 0.075) + 0.07), 0.83)
  if (Math.hypot(x - game.x, (y - game.y) / SCENE_ASPECT) < 0.14) {
    return { x: game.x < 0.52 ? 0.81 : 0.21, y: 0.77 }
  }
  return { x, y }
}

function swimTarget(game) {
  // Alternate between the upper and lower pond. The strip between them stays underwater.
  const y = game.y < 0.34 ? chooseBetween(game, 0.43, 0.54) : chooseBetween(game, 0.16, 0.27)
  return { x: chooseBetween(game, 0.1, 0.21), y }
}

function startWalking(game) {
  setPlan(game, 'walking', walkTarget(game), 0, WALK_LEGS)
}

function chooseActivity(game) {
  const choice = game.random()
  if (choice < 0.3) {
    setPlan(game, 'swimming', swimTarget(game), 0, 4 + Math.floor(game.random() * 3))
  } else if (choice < 0.47) {
    setPlan(game, 'sleeping', SLEEP_SPOT, chooseBetween(game, 5, 7))
  } else {
    startWalking(game)
  }
}

function continueActivity(game) {
  const swimming = game.plan.action === 'swimming'
  game.plan.legsLeft -= 1
  if (game.plan.legsLeft > 0) {
    game.plan.target = swimming ? swimTarget(game) : walkTarget(game)
    game.plan.remaining = 0
    followPlan(game)
  } else if (swimming) {
    startWalking(game)
  } else {
    chooseActivity(game)
  }
}

function advanceSpeech(game, seconds) {
  if (game.plan.action !== 'walking' || game.inWater || onSleepMat(game.x, game.y)) {
    game.speech = null
    return
  }

  if (!game.speech && (!game.isMoving || seconds <= 0)) return

  game.speechTimer -= seconds
  if (game.speechTimer > 0) return

  if (game.speech) {
    game.speech = null
    game.speechTimer = chooseBetween(game, 2.5, 5)
  } else {
    game.speech = SPEECH[Math.floor(game.random() * SPEECH.length)]
    game.speechTimer = 1.6
  }
}

function moveTo(game, x, y) {
  if (Math.abs(x - game.x) > 0.0001) {
    game.facing = x > game.x ? 'right' : 'left'
  }
  game.x = x
  game.y = y
}

function moveAlongRoute(game, seconds) {
  while (game.route.length && seconds > 0) {
    const target = game.route[0]
    const dx = target.x - game.x
    const dy = target.y - game.y
    const distance = Math.hypot(dx, dy / SCENE_ASPECT)
    const speed = game.plan.action === 'eating' ? FOOD_SPEED : game.inWater ? SWIM_SPEED : WALK_SPEED
    const travelTime = distance / speed

    if (travelTime > seconds) {
      const progress = seconds / travelTime
      moveTo(game, game.x + dx * progress, game.y + dy * progress)
      setMotionAction(game)
      return 0
    }

    moveTo(game, target.x, target.y)
    game.route.shift()
    seconds -= travelTime
  }

  if (game.route.length) return 0

  game.plan.target = null
  followPlan(game)
  return seconds
}

function turtlePosition(x, y) {
  return {
    x: clamp(x, TURTLE_INSET_X, 1 - TURTLE_INSET_X),
    y: clamp(y, TURTLE_INSET_Y, 1 - TURTLE_INSET_Y),
  }
}

function foodApproach(food) {
  let position = turtlePosition(food.x, food.y - 0.055)
  if (position.x < pondEdge(position.y)) position = turtlePosition(food.x + 0.033, food.y)
  if (position.x < pondEdge(position.y)) position = turtlePosition(food.x, food.y + 0.055)

  // Leave room to move in both directions without stepping into the pond or off the board.
  const left = Math.max(TURTLE_INSET_X, pondEdge(position.y)) + EATING_DISTANCE
  const right = 1 - TURTLE_INSET_X - EATING_DISTANCE
  return { x: clamp(position.x, left, right), y: position.y }
}

function eatingPosition(food, remaining) {
  const center = foodApproach(food)
  if (remaining <= 0) return center
  const cycles = (1 - remaining / EATING_DURATION) * EATING_CYCLES
  return { x: center.x + Math.sin(cycles * 2 * Math.PI) * EATING_DISTANCE, y: center.y }
}

function seekFood(game) {
  game.interruptedPlan = game.plan
  setPlan(game, 'eating', foodApproach(game.food), EATING_DURATION)
}

export function advanceTurtle(game, elapsedSeconds) {
  if (game.action === 'held' || elapsedSeconds <= 0) return

  const plan = game.plan
  const pauseElapsed = Math.min(plan.pauseRemaining, elapsedSeconds)
  plan.pauseRemaining -= pauseElapsed
  const actionSeconds = Math.min(elapsedSeconds - pauseElapsed, plan.pauseIn)
  const remaining = game.route.length ? moveAlongRoute(game, actionSeconds) : actionSeconds
  const movementSeconds = actionSeconds - remaining
  const animationSeconds = game.action === 'eating' ? actionSeconds : movementSeconds
  game.animationTime = (game.animationTime + animationSeconds) % 2

  plan.pauseIn -= movementSeconds
  if (plan.pauseIn <= 0) {
    plan.pauseIn = chooseBetween(game, 2.5, 6.5)
    plan.pauseRemaining = plan.action === 'walking'
      ? chooseBetween(game, 0.65, 1.25)
      : chooseBetween(game, 0.5, 1)
  }

  advanceSpeech(game, game.speech ? elapsedSeconds : movementSeconds)
  plan.remaining -= remaining
  if (plan.target) return
  if (plan.action === 'eating') {
    const { x, y } = eatingPosition(game.food, plan.remaining)
    moveTo(game, x, y)
  }
  if (plan.remaining > 0) return

  if (plan.action === 'eating') {
    game.food = null
    game.plan = game.interruptedPlan
    game.interruptedPlan = null
    followPlan(game)
  } else if (isMovementPlan(plan.action)) {
    continueActivity(game)
  } else {
    startWalking(game)
    if (game.food) seekFood(game)
  }
}

export function feedTurtle(game, x, y) {
  if (game.food || !isFeedSpot(x, y)) return false
  game.food = { x, y }

  if (game.action !== 'sleeping' && game.action !== 'held') seekFood(game)
  return true
}

export function pickUpTurtle(game) {
  game.action = 'held'
  game.speech = null
}

export function moveTurtle(game, x, y) {
  if (game.action !== 'held') return
  const position = turtlePosition(x, y)
  moveTo(game, position.x, position.y)
}

export function releaseTurtle(game) {
  if (game.action !== 'held') return

  const stillSleeping = game.plan.action === 'sleeping' && !game.plan.target
  if (game.food && !stillSleeping) {
    if (game.plan.action !== 'eating') {
      seekFood(game)
      return
    }
    game.plan.target = eatingPosition(game.food, game.plan.remaining)
  }
  followPlan(game)
}
