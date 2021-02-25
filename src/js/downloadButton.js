/*
 * @LastEditors: 赵兴
 * @LastEditTime: 2021-02-25 15:43:17
 */
/*---------download buttonXs----------*/
// ammount to add on each buttonXs press
const confettiCount = 20
const sequinCount = 10

// "physics" variables
const gravityConfetti = 0.3
const gravitySequins = 0.55
const dragConfetti = 0.075
const dragSequins = 0.02
const terminalVelocity = 3

// colors, back side is darker for confettiXs flipping
const colors = [{
    front: '#7b5cff',
    back: '#6245e0'
  }, // Purple
  {
    front: '#b3c7ff',
    back: '#8fa5e5'
  }, // Light Blue
  {
    front: '#5c86ff',
    back: '#345dd1'
  } // Darker Blue
]
// init other global elements
var disabledXs = false
const buttonXs = document.getElementById('button-xs')
const canvasXs = document.getElementById('canvas-xs')
const ctxXs = canvasXs.getContext('2d')
canvasXs.width = window.innerWidth
canvasXs.height = window.innerHeight
let cxXs = ctxXs.canvas.width / 2
let cyXs = ctxXs.canvas.height / 2

// add ConfettoXs/SequinXs objects to arrays to draw them
let confettiXs = []
let sequinsXs = []


// helper function to pick a random number within a range
randomRangeXs = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiXs
// this weighted spread helps the confettiXs look more realistic
initConfettoVelocityXs = (xRange, yRange) => {
  const x = randomRangeXs(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeXs(0, range) + randomRangeXs(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoXs goes higher than the max
    y += (Math.random() < .25) ? randomRangeXs(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoXs Class
function ConfettoXs() {
  this.randomModifier = randomRangeXs(0, 99)
  this.color = colors[Math.floor(randomRangeXs(0, colors.length))]
  this.dimensions = {
    x: randomRangeXs(5, 9),
    y: randomRangeXs(8, 15),
  }
  this.position = {
    x: randomRangeXs(canvasXs.width / 2 - buttonXs.offsetWidth / 4, canvasXs.width / 2 + buttonXs.offsetWidth / 4),
    y: randomRangeXs(canvasXs.height / 2 + buttonXs.offsetHeight / 2 + 8, canvasXs.height / 2 + (1.5 * buttonXs.offsetHeight) - 8),
  }
  this.rotation = randomRangeXs(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityXs([-9, 9], [6, 11])
}
ConfettoXs.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoXs by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinXs Class
function SequinXs() {
  this.color = colors[Math.floor(randomRangeXs(0, colors.length))].back,
    this.radius = randomRangeXs(1, 2),
    this.position = {
      x: randomRangeXs(canvasXs.width / 2 - buttonXs.offsetWidth / 3, canvasXs.width / 2 + buttonXs.offsetWidth / 3),
      y: randomRangeXs(canvasXs.height / 2 + buttonXs.offsetHeight / 2 + 8, canvasXs.height / 2 + (1.5 * buttonXs.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeXs(-6, 6),
      y: randomRangeXs(-8, -12)
    }
}
SequinXs.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstXs = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiXs.push(new ConfettoXs())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsXs.push(new SequinXs())
  }
}

// draws the elements on the canvas
renderXs = () => {
  ctxXs.clearRect(0, 0, canvasXs.width, canvasXs.height)

  confettiXs.forEach((ConfettoXs, index) => {
    let width = (ConfettoXs.dimensions.x * ConfettoXs.scale.x)
    let height = (ConfettoXs.dimensions.y * ConfettoXs.scale.y)

    // move canvas to position and rotate
    ctxXs.translate(ConfettoXs.position.x, ConfettoXs.position.y)
    ctxXs.rotate(ConfettoXs.rotation)

    // update ConfettoXs "physics" values
    ConfettoXs.update()

    // get front or back fill color
    ctxXs.fillStyle = ConfettoXs.scale.y > 0 ? ConfettoXs.color.front : ConfettoXs.color.back

    // draw ConfettoXs
    ctxXs.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxXs.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonXs cuts off
    if (ConfettoXs.velocity.y < 0) {
      ctxXs.clearRect(canvasXs.width / 2 - buttonXs.offsetWidth / 2, canvasXs.height / 2 + buttonXs.offsetHeight / 2, buttonXs.offsetWidth, buttonXs.offsetHeight)
    }
  })

  sequinsXs.forEach((SequinXs, index) => {
    // move canvas to position
    ctxXs.translate(SequinXs.position.x, SequinXs.position.y)

    // update SequinXs "physics" values
    SequinXs.update()

    // set the color
    ctxXs.fillStyle = SequinXs.color

    // draw SequinXs
    ctxXs.beginPath()
    ctxXs.arc(0, 0, SequinXs.radius, 0, 2 * Math.PI)
    ctxXs.fill()

    // reset transform matrix
    ctxXs.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonXs cuts off
    if (SequinXs.velocity.y < 0) {
      ctxXs.clearRect(canvasXs.width / 2 - buttonXs.offsetWidth / 2, canvasXs.height / 2 + buttonXs.offsetHeight / 2, buttonXs.offsetWidth, buttonXs.offsetHeight)
    }
  })

  // remove confettiXs and sequinsXs that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiXs.forEach((ConfettoXs, index) => {
    if (ConfettoXs.position.y >= canvasXs.height) confettiXs.splice(index, 1)
  })
  sequinsXs.forEach((SequinXs, index) => {
    if (SequinXs.position.y >= canvasXs.height) sequinsXs.splice(index, 1)
  })

  window.requestAnimationFrame(renderXs)
}

// cycle through buttonXs states when clicked
clickButtonXs = () => {
  if (!disabledXs) {
    disabledXs = true
    // Loading stage
    buttonXs.classList.add('loading')
    buttonXs.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonXs.classList.add('complete')
      buttonXs.classList.remove('loading')
      setTimeout(() => {
        window.initBurstXs()
        setTimeout(() => {
          // Reset buttonXs so user can select it again
          disabledXs = false
          buttonXs.classList.add('ready')
          buttonXs.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasXs = () => {
  canvasXs.width = window.innerWidth
  canvasXs.height = window.innerHeight
  cxXs = ctxXs.canvas.width / 2
  cyXs = ctxXs.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasXs()
})

// click buttonXs on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonXs()
  }
}
// Set up buttonXs text transition timings on page load
textElements = buttonXs.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderXs loop
window.initBurstXs()
renderXs()

/*----------- 采购按钮 ------------*/
// init other global elements
var disabledCg = false
const buttonCg = document.getElementById('button-cg')
const canvasCg = document.getElementById('canvas-cg')
const ctxCg = canvasCg.getContext('2d')
canvasCg.width = window.innerWidth
canvasCg.height = window.innerHeight
let cxCg = ctxCg.canvas.width / 2
let cyCg = ctxCg.canvas.height / 2

// add ConfettoCg/SequinCg objects to arrays to draw them
let confettiCg = []
let sequinsCg = []


// helper function to pick a random number within a range
randomRangeCg = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiCg
// this weighted spread helps the confettiCg look more realistic
initConfettoVelocityCg = (xRange, yRange) => {
  const x = randomRangeCg(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeCg(0, range) + randomRangeCg(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoCg goes higher than the max
    y += (Math.random() < .25) ? randomRangeCg(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoCg Class
function ConfettoCg() {
  this.randomModifier = randomRangeCg(0, 99)
  this.color = colors[Math.floor(randomRangeCg(0, colors.length))]
  this.dimensions = {
    x: randomRangeCg(5, 9),
    y: randomRangeCg(8, 15),
  }
  this.position = {
    x: randomRangeCg(canvasCg.width / 2 - buttonCg.offsetWidth / 4, canvasCg.width / 2 + buttonCg.offsetWidth / 4),
    y: randomRangeCg(canvasCg.height / 2 + buttonCg.offsetHeight / 2 + 8, canvasCg.height / 2 + (1.5 * buttonCg.offsetHeight) - 8),
  }
  this.rotation = randomRangeCg(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityCg([-9, 9], [6, 11])
}
ConfettoCg.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoCg by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinCg Class
function SequinCg() {
  this.color = colors[Math.floor(randomRangeCg(0, colors.length))].back,
    this.radius = randomRangeCg(1, 2),
    this.position = {
      x: randomRangeCg(canvasCg.width / 2 - buttonCg.offsetWidth / 3, canvasCg.width / 2 + buttonCg.offsetWidth / 3),
      y: randomRangeCg(canvasCg.height / 2 + buttonCg.offsetHeight / 2 + 8, canvasCg.height / 2 + (1.5 * buttonCg.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeCg(-6, 6),
      y: randomRangeCg(-8, -12)
    }
}
SequinCg.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstCg = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiCg.push(new ConfettoCg())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsCg.push(new SequinCg())
  }
}

// draws the elements on the canvas
renderCg = () => {
  ctxCg.clearRect(0, 0, canvasCg.width, canvasCg.height)

  confettiCg.forEach((ConfettoCg, index) => {
    let width = (ConfettoCg.dimensions.x * ConfettoCg.scale.x)
    let height = (ConfettoCg.dimensions.y * ConfettoCg.scale.y)

    // move canvas to position and rotate
    ctxCg.translate(ConfettoCg.position.x, ConfettoCg.position.y)
    ctxCg.rotate(ConfettoCg.rotation)

    // update ConfettoCg "physics" values
    ConfettoCg.update()

    // get front or back fill color
    ctxCg.fillStyle = ConfettoCg.scale.y > 0 ? ConfettoCg.color.front : ConfettoCg.color.back

    // draw ConfettoCg
    ctxCg.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxCg.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCg cuts off
    if (ConfettoCg.velocity.y < 0) {
      ctxCg.clearRect(canvasCg.width / 2 - buttonCg.offsetWidth / 2, canvasCg.height / 2 + buttonCg.offsetHeight / 2, buttonCg.offsetWidth, buttonCg.offsetHeight)
    }
  })

  sequinsCg.forEach((SequinCg, index) => {
    // move canvas to position
    ctxCg.translate(SequinCg.position.x, SequinCg.position.y)

    // update SequinCg "physics" values
    SequinCg.update()

    // set the color
    ctxCg.fillStyle = SequinCg.color

    // draw SequinCg
    ctxCg.beginPath()
    ctxCg.arc(0, 0, SequinCg.radius, 0, 2 * Math.PI)
    ctxCg.fill()

    // reset transform matrix
    ctxCg.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCg cuts off
    if (SequinCg.velocity.y < 0) {
      ctxCg.clearRect(canvasCg.width / 2 - buttonCg.offsetWidth / 2, canvasCg.height / 2 + buttonCg.offsetHeight / 2, buttonCg.offsetWidth, buttonCg.offsetHeight)
    }
  })

  // remove confettiCg and sequinsCg that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiCg.forEach((ConfettoCg, index) => {
    if (ConfettoCg.position.y >= canvasCg.height) confettiCg.splice(index, 1)
  })
  sequinsCg.forEach((SequinCg, index) => {
    if (SequinCg.position.y >= canvasCg.height) sequinsCg.splice(index, 1)
  })

  window.requestAnimationFrame(renderCg)
}

// cycle through buttonCg states when clicked
clickButtonCg = () => {
  if (!disabledCg) {
    disabledCg = true
    // Loading stage
    buttonCg.classList.add('loading')
    buttonCg.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonCg.classList.add('complete')
      buttonCg.classList.remove('loading')
      setTimeout(() => {
        window.initBurstCg()
        setTimeout(() => {
          // Reset buttonCg so user can select it again
          disabledCg = false
          buttonCg.classList.add('ready')
          buttonCg.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasCg = () => {
  canvasCg.width = window.innerWidth
  canvasCg.height = window.innerHeight
  cxCg = ctxCg.canvas.width / 2
  cyCg = ctxCg.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasCg()
})

// click buttonCg on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonCg()
  }
}
// Set up buttonCg text transition timings on page load
textElements = buttonCg.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderCg loop
window.initBurstCg()
renderCg()

/*----------- 派车按钮 ------------*/
// init other global elements
var disabledPc = false
const buttonPc = document.getElementById('button-pc')
const canvasPc = document.getElementById('canvas-pc')
const ctxPc = canvasPc.getContext('2d')
canvasPc.width = window.innerWidth
canvasPc.height = window.innerHeight
let cxPc = ctxPc.canvas.width / 2
let cyPc = ctxPc.canvas.height / 2

// add ConfettoPc/SequinPc objects to arrays to draw them
let confettiPc = []
let sequinsPc = []


// helper function to pick a random number within a range
randomRangePc = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiPc
// this weighted spread helps the confettiPc look more realistic
initConfettoVelocityPc = (xRange, yRange) => {
  const x = randomRangePc(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangePc(0, range) + randomRangePc(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoPc goes higher than the max
    y += (Math.random() < .25) ? randomRangePc(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoPc Class
function ConfettoPc() {
  this.randomModifier = randomRangePc(0, 99)
  this.color = colors[Math.floor(randomRangePc(0, colors.length))]
  this.dimensions = {
    x: randomRangePc(5, 9),
    y: randomRangePc(8, 15),
  }
  this.position = {
    x: randomRangePc(canvasPc.width / 2 - buttonPc.offsetWidth / 4, canvasPc.width / 2 + buttonPc.offsetWidth / 4),
    y: randomRangePc(canvasPc.height / 2 + buttonPc.offsetHeight / 2 + 8, canvasPc.height / 2 + (1.5 * buttonPc.offsetHeight) - 8),
  }
  this.rotation = randomRangePc(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityPc([-9, 9], [6, 11])
}
ConfettoPc.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoPc by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinPc Class
function SequinPc() {
  this.color = colors[Math.floor(randomRangePc(0, colors.length))].back,
    this.radius = randomRangePc(1, 2),
    this.position = {
      x: randomRangePc(canvasPc.width / 2 - buttonPc.offsetWidth / 3, canvasPc.width / 2 + buttonPc.offsetWidth / 3),
      y: randomRangePc(canvasPc.height / 2 + buttonPc.offsetHeight / 2 + 8, canvasPc.height / 2 + (1.5 * buttonPc.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangePc(-6, 6),
      y: randomRangePc(-8, -12)
    }
}
SequinPc.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstPc = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiPc.push(new ConfettoPc())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsPc.push(new SequinPc())
  }
}

// draws the elements on the canvas
renderPc = () => {
  ctxPc.clearRect(0, 0, canvasPc.width, canvasPc.height)

  confettiPc.forEach((ConfettoPc, index) => {
    let width = (ConfettoPc.dimensions.x * ConfettoPc.scale.x)
    let height = (ConfettoPc.dimensions.y * ConfettoPc.scale.y)

    // move canvas to position and rotate
    ctxPc.translate(ConfettoPc.position.x, ConfettoPc.position.y)
    ctxPc.rotate(ConfettoPc.rotation)

    // update ConfettoPc "physics" values
    ConfettoPc.update()

    // get front or back fill color
    ctxPc.fillStyle = ConfettoPc.scale.y > 0 ? ConfettoPc.color.front : ConfettoPc.color.back

    // draw ConfettoPc
    ctxPc.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxPc.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonPc cuts off
    if (ConfettoPc.velocity.y < 0) {
      ctxPc.clearRect(canvasPc.width / 2 - buttonPc.offsetWidth / 2, canvasPc.height / 2 + buttonPc.offsetHeight / 2, buttonPc.offsetWidth, buttonPc.offsetHeight)
    }
  })

  sequinsPc.forEach((SequinPc, index) => {
    // move canvas to position
    ctxPc.translate(SequinPc.position.x, SequinPc.position.y)

    // update SequinPc "physics" values
    SequinPc.update()

    // set the color
    ctxPc.fillStyle = SequinPc.color

    // draw SequinPc
    ctxPc.beginPath()
    ctxPc.arc(0, 0, SequinPc.radius, 0, 2 * Math.PI)
    ctxPc.fill()

    // reset transform matrix
    ctxPc.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonPc cuts off
    if (SequinPc.velocity.y < 0) {
      ctxPc.clearRect(canvasPc.width / 2 - buttonPc.offsetWidth / 2, canvasPc.height / 2 + buttonPc.offsetHeight / 2, buttonPc.offsetWidth, buttonPc.offsetHeight)
    }
  })

  // remove confettiPc and sequinsPc that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiPc.forEach((ConfettoPc, index) => {
    if (ConfettoPc.position.y >= canvasPc.height) confettiPc.splice(index, 1)
  })
  sequinsPc.forEach((SequinPc, index) => {
    if (SequinPc.position.y >= canvasPc.height) sequinsPc.splice(index, 1)
  })

  window.requestAnimationFrame(renderPc)
}

// cycle through buttonPc states when clicked
clickButtonPc = () => {
  if (!disabledPc) {
    disabledPc = true
    // Loading stage
    buttonPc.classList.add('loading')
    buttonPc.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonPc.classList.add('complete')
      buttonPc.classList.remove('loading')
      setTimeout(() => {
        window.initBurstPc()
        setTimeout(() => {
          // Reset buttonPc so user can select it again
          disabledPc = false
          buttonPc.classList.add('ready')
          buttonPc.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasPc = () => {
  canvasPc.width = window.innerWidth
  canvasPc.height = window.innerHeight
  cxPc = ctxPc.canvas.width / 2
  cyPc = ctxPc.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasPc()
})

// click buttonPc on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonPc()
  }
}
// Set up buttonPc text transition timings on page load
textElements = buttonPc.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderPc loop
window.initBurstPc()
renderPc()

/*----------- 发货按钮 ------------*/
// init other global elements
var disabledFh = false
const buttonFh = document.getElementById('button-fh')
const canvasFh = document.getElementById('canvas-fh')
const ctxFh = canvasFh.getContext('2d')
canvasFh.width = window.innerWidth
canvasFh.height = window.innerHeight
let cxFh = ctxFh.canvas.width / 2
let cyFh = ctxFh.canvas.height / 2

// add ConfettoFh/SequinFh objects to arrays to draw them
let confettiFh = []
let sequinsFh = []


// helper function to pick a random number within a range
randomRangeFh = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiFh
// this weighted spread helps the confettiFh look more realistic
initConfettoVelocityFh = (xRange, yRange) => {
  const x = randomRangeFh(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeFh(0, range) + randomRangeFh(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoFh goes higher than the max
    y += (Math.random() < .25) ? randomRangeFh(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoFh Class
function ConfettoFh() {
  this.randomModifier = randomRangeFh(0, 99)
  this.color = colors[Math.floor(randomRangeFh(0, colors.length))]
  this.dimensions = {
    x: randomRangeFh(5, 9),
    y: randomRangeFh(8, 15),
  }
  this.position = {
    x: randomRangeFh(canvasFh.width / 2 - buttonFh.offsetWidth / 4, canvasFh.width / 2 + buttonFh.offsetWidth / 4),
    y: randomRangeFh(canvasFh.height / 2 + buttonFh.offsetHeight / 2 + 8, canvasFh.height / 2 + (1.5 * buttonFh.offsetHeight) - 8),
  }
  this.rotation = randomRangeFh(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityFh([-9, 9], [6, 11])
}
ConfettoFh.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoFh by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinFh Class
function SequinFh() {
  this.color = colors[Math.floor(randomRangeFh(0, colors.length))].back,
    this.radius = randomRangeFh(1, 2),
    this.position = {
      x: randomRangeFh(canvasFh.width / 2 - buttonFh.offsetWidth / 3, canvasFh.width / 2 + buttonFh.offsetWidth / 3),
      y: randomRangeFh(canvasFh.height / 2 + buttonFh.offsetHeight / 2 + 8, canvasFh.height / 2 + (1.5 * buttonFh.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeFh(-6, 6),
      y: randomRangeFh(-8, -12)
    }
}
SequinFh.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstFh = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiFh.push(new ConfettoFh())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsFh.push(new SequinFh())
  }
}

// draws the elements on the canvas
renderFh = () => {
  ctxFh.clearRect(0, 0, canvasFh.width, canvasFh.height)

  confettiFh.forEach((ConfettoFh, index) => {
    let width = (ConfettoFh.dimensions.x * ConfettoFh.scale.x)
    let height = (ConfettoFh.dimensions.y * ConfettoFh.scale.y)

    // move canvas to position and rotate
    ctxFh.translate(ConfettoFh.position.x, ConfettoFh.position.y)
    ctxFh.rotate(ConfettoFh.rotation)

    // update ConfettoFh "physics" values
    ConfettoFh.update()

    // get front or back fill color
    ctxFh.fillStyle = ConfettoFh.scale.y > 0 ? ConfettoFh.color.front : ConfettoFh.color.back

    // draw ConfettoFh
    ctxFh.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxFh.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonFh cuts off
    if (ConfettoFh.velocity.y < 0) {
      ctxFh.clearRect(canvasFh.width / 2 - buttonFh.offsetWidth / 2, canvasFh.height / 2 + buttonFh.offsetHeight / 2, buttonFh.offsetWidth, buttonFh.offsetHeight)
    }
  })

  sequinsFh.forEach((SequinFh, index) => {
    // move canvas to position
    ctxFh.translate(SequinFh.position.x, SequinFh.position.y)

    // update SequinFh "physics" values
    SequinFh.update()

    // set the color
    ctxFh.fillStyle = SequinFh.color

    // draw SequinFh
    ctxFh.beginPath()
    ctxFh.arc(0, 0, SequinFh.radius, 0, 2 * Math.PI)
    ctxFh.fill()

    // reset transform matrix
    ctxFh.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonFh cuts off
    if (SequinFh.velocity.y < 0) {
      ctxFh.clearRect(canvasFh.width / 2 - buttonFh.offsetWidth / 2, canvasFh.height / 2 + buttonFh.offsetHeight / 2, buttonFh.offsetWidth, buttonFh.offsetHeight)
    }
  })

  // remove confettiFh and sequinsFh that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiFh.forEach((ConfettoFh, index) => {
    if (ConfettoFh.position.y >= canvasFh.height) confettiFh.splice(index, 1)
  })
  sequinsFh.forEach((SequinFh, index) => {
    if (SequinFh.position.y >= canvasFh.height) sequinsFh.splice(index, 1)
  })

  window.requestAnimationFrame(renderFh)
}

// cycle through buttonFh states when clicked
clickButtonFh = () => {
  if (!disabledFh) {
    disabledFh = true
    // Loading stage
    buttonFh.classList.add('loading')
    buttonFh.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonFh.classList.add('complete')
      buttonFh.classList.remove('loading')
      setTimeout(() => {
        window.initBurstFh()
        setTimeout(() => {
          // Reset buttonFh so user can select it again
          disabledFh = false
          buttonFh.classList.add('ready')
          buttonFh.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasFh = () => {
  canvasFh.width = window.innerWidth
  canvasFh.height = window.innerHeight
  cxFh = ctxFh.canvas.width / 2
  cyFh = ctxFh.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasFh()
})

// click buttonFh on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonFh()
  }
}
// Set up buttonFh text transition timings on page load
textElements = buttonFh.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderFh loop
window.initBurstFh()
renderFh()

/*----------- 仓库按钮 ------------*/
// init other global elements
var disabledCk = false
const buttonCk = document.getElementById('button-ck')
const canvasCk = document.getElementById('canvas-ck')
const ctxCk = canvasCk.getContext('2d')
canvasCk.width = window.innerWidth
canvasCk.height = window.innerHeight
let cxCk = ctxCk.canvas.width / 2
let cyCk = ctxCk.canvas.height / 2

// add ConfettoCk/SequinCk objects to arrays to draw them
let confettiCk = []
let sequinsCk = []


// helper function to pick a random number within a range
randomRangeCk = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiCk
// this weighted spread helps the confettiCk look more realistic
initConfettoVelocityCk = (xRange, yRange) => {
  const x = randomRangeCk(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeCk(0, range) + randomRangeCk(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoCk goes higher than the max
    y += (Math.random() < .25) ? randomRangeCk(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoCk Class
function ConfettoCk() {
  this.randomModifier = randomRangeCk(0, 99)
  this.color = colors[Math.floor(randomRangeCk(0, colors.length))]
  this.dimensions = {
    x: randomRangeCk(5, 9),
    y: randomRangeCk(8, 15),
  }
  this.position = {
    x: randomRangeCk(canvasCk.width / 2 - buttonCk.offsetWidth / 4, canvasCk.width / 2 + buttonCk.offsetWidth / 4),
    y: randomRangeCk(canvasCk.height / 2 + buttonCk.offsetHeight / 2 + 8, canvasCk.height / 2 + (1.5 * buttonCk.offsetHeight) - 8),
  }
  this.rotation = randomRangeCk(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityCk([-9, 9], [6, 11])
}
ConfettoCk.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoCk by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinCk Class
function SequinCk() {
  this.color = colors[Math.floor(randomRangeCk(0, colors.length))].back,
    this.radius = randomRangeCk(1, 2),
    this.position = {
      x: randomRangeCk(canvasCk.width / 2 - buttonCk.offsetWidth / 3, canvasCk.width / 2 + buttonCk.offsetWidth / 3),
      y: randomRangeCk(canvasCk.height / 2 + buttonCk.offsetHeight / 2 + 8, canvasCk.height / 2 + (1.5 * buttonCk.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeCk(-6, 6),
      y: randomRangeCk(-8, -12)
    }
}
SequinCk.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstCk = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiCk.push(new ConfettoCk())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsCk.push(new SequinCk())
  }
}

// draws the elements on the canvas
renderCk = () => {
  ctxCk.clearRect(0, 0, canvasCk.width, canvasCk.height)

  confettiCk.forEach((ConfettoCk, index) => {
    let width = (ConfettoCk.dimensions.x * ConfettoCk.scale.x)
    let height = (ConfettoCk.dimensions.y * ConfettoCk.scale.y)

    // move canvas to position and rotate
    ctxCk.translate(ConfettoCk.position.x, ConfettoCk.position.y)
    ctxCk.rotate(ConfettoCk.rotation)

    // update ConfettoCk "physics" values
    ConfettoCk.update()

    // get front or back fill color
    ctxCk.fillStyle = ConfettoCk.scale.y > 0 ? ConfettoCk.color.front : ConfettoCk.color.back

    // draw ConfettoCk
    ctxCk.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxCk.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCk cuts off
    if (ConfettoCk.velocity.y < 0) {
      ctxCk.clearRect(canvasCk.width / 2 - buttonCk.offsetWidth / 2, canvasCk.height / 2 + buttonCk.offsetHeight / 2, buttonCk.offsetWidth, buttonCk.offsetHeight)
    }
  })

  sequinsCk.forEach((SequinCk, index) => {
    // move canvas to position
    ctxCk.translate(SequinCk.position.x, SequinCk.position.y)

    // update SequinCk "physics" values
    SequinCk.update()

    // set the color
    ctxCk.fillStyle = SequinCk.color

    // draw SequinCk
    ctxCk.beginPath()
    ctxCk.arc(0, 0, SequinCk.radius, 0, 2 * Math.PI)
    ctxCk.fill()

    // reset transform matrix
    ctxCk.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCk cuts off
    if (SequinCk.velocity.y < 0) {
      ctxCk.clearRect(canvasCk.width / 2 - buttonCk.offsetWidth / 2, canvasCk.height / 2 + buttonCk.offsetHeight / 2, buttonCk.offsetWidth, buttonCk.offsetHeight)
    }
  })

  // remove confettiCk and sequinsCk that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiCk.forEach((ConfettoCk, index) => {
    if (ConfettoCk.position.y >= canvasCk.height) confettiCk.splice(index, 1)
  })
  sequinsCk.forEach((SequinCk, index) => {
    if (SequinCk.position.y >= canvasCk.height) sequinsCk.splice(index, 1)
  })

  window.requestAnimationFrame(renderCk)
}

// cycle through buttonCk states when clicked
clickButtonCk = () => {
  if (!disabledCk) {
    disabledCk = true
    // Loading stage
    buttonCk.classList.add('loading')
    buttonCk.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonCk.classList.add('complete')
      buttonCk.classList.remove('loading')
      setTimeout(() => {
        window.initBurstCk()
        setTimeout(() => {
          // Reset buttonCk so user can select it again
          disabledCk = false
          buttonCk.classList.add('ready')
          buttonCk.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasCk = () => {
  canvasCk.width = window.innerWidth
  canvasCk.height = window.innerHeight
  cxCk = ctxCk.canvas.width / 2
  cyCk = ctxCk.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasCk()
})

// click buttonCk on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonCk()
  }
}
// Set up buttonCk text transition timings on page load
textElements = buttonCk.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderCk loop
window.initBurstCk()
renderCk()

/*-------------财务按钮--------------*/
/*----------- 管理按钮 ------------*/
// init other global elements
var disabledCw = false
const buttonCw = document.getElementById('button-cw')
const canvasCw = document.getElementById('canvas-cw')
const ctxCw = canvasCw.getContext('2d')
canvasCw.width = window.innerWidth
canvasCw.height = window.innerHeight
let cxCw = ctxCw.canvas.width / 2
let cyCw = ctxCw.canvas.height / 2

// add ConfettoCw/SequinCw objects to arrays to draw them
let confettiCw = []
let sequinsCw = []


// helper function to pick a random number within a range
randomRangeCw = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiCw
// this weighted spread helps the confettiCw look more realistic
initConfettoVelocityCw = (xRange, yRange) => {
  const x = randomRangeCw(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeCw(0, range) + randomRangeCw(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoCw goes higher than the max
    y += (Math.random() < .25) ? randomRangeCw(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoCw Class
function ConfettoCw() {
  this.randomModifier = randomRangeCw(0, 99)
  this.color = colors[Math.floor(randomRangeCw(0, colors.length))]
  this.dimensions = {
    x: randomRangeCw(5, 9),
    y: randomRangeCw(8, 15),
  }
  this.position = {
    x: randomRangeCw(canvasCw.width / 2 - buttonCw.offsetWidth / 4, canvasCw.width / 2 + buttonCw.offsetWidth / 4),
    y: randomRangeCw(canvasCw.height / 2 + buttonCw.offsetHeight / 2 + 8, canvasCw.height / 2 + (1.5 * buttonCw.offsetHeight) - 8),
  }
  this.rotation = randomRangeCw(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityCw([-9, 9], [6, 11])
}
ConfettoCw.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoCw by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinCw Class
function SequinCw() {
  this.color = colors[Math.floor(randomRangeCw(0, colors.length))].back,
    this.radius = randomRangeCw(1, 2),
    this.position = {
      x: randomRangeCw(canvasCw.width / 2 - buttonCw.offsetWidth / 3, canvasCw.width / 2 + buttonCw.offsetWidth / 3),
      y: randomRangeCw(canvasCw.height / 2 + buttonCw.offsetHeight / 2 + 8, canvasCw.height / 2 + (1.5 * buttonCw.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeCw(-6, 6),
      y: randomRangeCw(-8, -12)
    }
}
SequinCw.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstCw = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiCw.push(new ConfettoCw())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsCw.push(new SequinCw())
  }
}

// draws the elements on the canvas
renderCw = () => {
  ctxCw.clearRect(0, 0, canvasCw.width, canvasCw.height)

  confettiCw.forEach((ConfettoCw, index) => {
    let width = (ConfettoCw.dimensions.x * ConfettoCw.scale.x)
    let height = (ConfettoCw.dimensions.y * ConfettoCw.scale.y)

    // move canvas to position and rotate
    ctxCw.translate(ConfettoCw.position.x, ConfettoCw.position.y)
    ctxCw.rotate(ConfettoCw.rotation)

    // update ConfettoCw "physics" values
    ConfettoCw.update()

    // get front or back fill color
    ctxCw.fillStyle = ConfettoCw.scale.y > 0 ? ConfettoCw.color.front : ConfettoCw.color.back

    // draw ConfettoCw
    ctxCw.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxCw.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCw cuts off
    if (ConfettoCw.velocity.y < 0) {
      ctxCw.clearRect(canvasCw.width / 2 - buttonCw.offsetWidth / 2, canvasCw.height / 2 + buttonCw.offsetHeight / 2, buttonCw.offsetWidth, buttonCw.offsetHeight)
    }
  })

  sequinsCw.forEach((SequinCw, index) => {
    // move canvas to position
    ctxCw.translate(SequinCw.position.x, SequinCw.position.y)

    // update SequinCw "physics" values
    SequinCw.update()

    // set the color
    ctxCw.fillStyle = SequinCw.color

    // draw SequinCw
    ctxCw.beginPath()
    ctxCw.arc(0, 0, SequinCw.radius, 0, 2 * Math.PI)
    ctxCw.fill()

    // reset transform matrix
    ctxCw.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonCw cuts off
    if (SequinCw.velocity.y < 0) {
      ctxCw.clearRect(canvasCw.width / 2 - buttonCw.offsetWidth / 2, canvasCw.height / 2 + buttonCw.offsetHeight / 2, buttonCw.offsetWidth, buttonCw.offsetHeight)
    }
  })

  // remove confettiCw and sequinsCw that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiCw.forEach((ConfettoCw, index) => {
    if (ConfettoCw.position.y >= canvasCw.height) confettiCw.splice(index, 1)
  })
  sequinsCw.forEach((SequinCw, index) => {
    if (SequinCw.position.y >= canvasCw.height) sequinsCw.splice(index, 1)
  })

  window.requestAnimationFrame(renderCw)
}

// cycle through buttonCw states when clicked
clickButtonCw = () => {
  if (!disabledCw) {
    disabledCw = true
    // Loading stage
    buttonCw.classList.add('loading')
    buttonCw.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonCw.classList.add('complete')
      buttonCw.classList.remove('loading')
      setTimeout(() => {
        window.initBurstCw()
        setTimeout(() => {
          // Reset buttonCw so user can select it again
          disabledCw = false
          buttonCw.classList.add('ready')
          buttonCw.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasCw = () => {
  canvasCw.width = window.innerWidth
  canvasCw.height = window.innerHeight
  cxCw = ctxCw.canvas.width / 2
  cyCw = ctxCw.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasCw()
})

// click buttonCw on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonCw()
  }
}
// Set up buttonCw text transition timings on page load
textElements = buttonCw.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderCw loop
window.initBurstCw()
renderCw()
/*----------- 管理按钮 ------------*/
// init other global elements
var disabledGl = false
const buttonGl = document.getElementById('button-gl')
const canvasGl = document.getElementById('canvas-gl')
const ctxGl = canvasGl.getContext('2d')
canvasGl.width = window.innerWidth
canvasGl.height = window.innerHeight
let cxGl = ctxGl.canvas.width / 2
let cyGl = ctxGl.canvas.height / 2

// add ConfettoGl/SequinGl objects to arrays to draw them
let confettiGl = []
let sequinsGl = []


// helper function to pick a random number within a range
randomRangeGl = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confettiGl
// this weighted spread helps the confettiGl look more realistic
initConfettoVelocityGl = (xRange, yRange) => {
  const x = randomRangeGl(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRangeGl(0, range) + randomRangeGl(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional ConfettoGl goes higher than the max
    y += (Math.random() < .25) ? randomRangeGl(1, 3) : 0
  }
  return {
    x: x,
    y: -y
  }
}

// ConfettoGl Class
function ConfettoGl() {
  this.randomModifier = randomRangeGl(0, 99)
  this.color = colors[Math.floor(randomRangeGl(0, colors.length))]
  this.dimensions = {
    x: randomRangeGl(5, 9),
    y: randomRangeGl(8, 15),
  }
  this.position = {
    x: randomRangeGl(canvasGl.width / 2 - buttonGl.offsetWidth / 4, canvasGl.width / 2 + buttonGl.offsetWidth / 4),
    y: randomRangeGl(canvasGl.height / 2 + buttonGl.offsetHeight / 2 + 8, canvasGl.height / 2 + (1.5 * buttonGl.offsetHeight) - 8),
  }
  this.rotation = randomRangeGl(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocityGl([-9, 9], [6, 11])
}
ConfettoGl.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin ConfettoGl by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// SequinGl Class
function SequinGl() {
  this.color = colors[Math.floor(randomRangeGl(0, colors.length))].back,
    this.radius = randomRangeGl(1, 2),
    this.position = {
      x: randomRangeGl(canvasGl.width / 2 - buttonGl.offsetWidth / 3, canvasGl.width / 2 + buttonGl.offsetWidth / 3),
      y: randomRangeGl(canvasGl.height / 2 + buttonGl.offsetHeight / 2 + 8, canvasGl.height / 2 + (1.5 * buttonGl.offsetHeight) - 8),
    },
    this.velocity = {
      x: randomRangeGl(-6, 6),
      y: randomRangeGl(-8, -12)
    }
}
SequinGl.prototype.update = function () {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins

  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y
}

// add elements to arrays to be drawn
initBurstGl = () => {
  for (let i = 0; i < confettiCount; i++) {
    confettiGl.push(new ConfettoGl())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequinsGl.push(new SequinGl())
  }
}

// draws the elements on the canvas
renderGl = () => {
  ctxGl.clearRect(0, 0, canvasGl.width, canvasGl.height)

  confettiGl.forEach((ConfettoGl, index) => {
    let width = (ConfettoGl.dimensions.x * ConfettoGl.scale.x)
    let height = (ConfettoGl.dimensions.y * ConfettoGl.scale.y)

    // move canvas to position and rotate
    ctxGl.translate(ConfettoGl.position.x, ConfettoGl.position.y)
    ctxGl.rotate(ConfettoGl.rotation)

    // update ConfettoGl "physics" values
    ConfettoGl.update()

    // get front or back fill color
    ctxGl.fillStyle = ConfettoGl.scale.y > 0 ? ConfettoGl.color.front : ConfettoGl.color.back

    // draw ConfettoGl
    ctxGl.fillRect(-width / 2, -height / 2, width, height)

    // reset transform matrix
    ctxGl.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonGl cuts off
    if (ConfettoGl.velocity.y < 0) {
      ctxGl.clearRect(canvasGl.width / 2 - buttonGl.offsetWidth / 2, canvasGl.height / 2 + buttonGl.offsetHeight / 2, buttonGl.offsetWidth, buttonGl.offsetHeight)
    }
  })

  sequinsGl.forEach((SequinGl, index) => {
    // move canvas to position
    ctxGl.translate(SequinGl.position.x, SequinGl.position.y)

    // update SequinGl "physics" values
    SequinGl.update()

    // set the color
    ctxGl.fillStyle = SequinGl.color

    // draw SequinGl
    ctxGl.beginPath()
    ctxGl.arc(0, 0, SequinGl.radius, 0, 2 * Math.PI)
    ctxGl.fill()

    // reset transform matrix
    ctxGl.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where buttonGl cuts off
    if (SequinGl.velocity.y < 0) {
      ctxGl.clearRect(canvasGl.width / 2 - buttonGl.offsetWidth / 2, canvasGl.height / 2 + buttonGl.offsetHeight / 2, buttonGl.offsetWidth, buttonGl.offsetHeight)
    }
  })

  // remove confettiGl and sequinsGl that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confettiGl.forEach((ConfettoGl, index) => {
    if (ConfettoGl.position.y >= canvasGl.height) confettiGl.splice(index, 1)
  })
  sequinsGl.forEach((SequinGl, index) => {
    if (SequinGl.position.y >= canvasGl.height) sequinsGl.splice(index, 1)
  })

  window.requestAnimationFrame(renderGl)
}

// cycle through buttonGl states when clicked
clickButtonGl = () => {
  if (!disabledGl) {
    disabledGl = true
    // Loading stage
    buttonGl.classList.add('loading')
    buttonGl.classList.remove('ready')
    setTimeout(() => {
      // Completed stage
      buttonGl.classList.add('complete')
      buttonGl.classList.remove('loading')
      setTimeout(() => {
        window.initBurstGl()
        setTimeout(() => {
          // Reset buttonGl so user can select it again
          disabledGl = false
          buttonGl.classList.add('ready')
          buttonGl.classList.remove('complete')
        }, 4000)
      }, 320)
    }, 1800)
  }
}

// re-init canvas if the window size changes
resizeCanvasGl = () => {
  canvasGl.width = window.innerWidth
  canvasGl.height = window.innerHeight
  cxGl = ctxGl.canvas.width / 2
  cyGl = ctxGl.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvasGl()
})

// click buttonGl on spacebar or return keypress
document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButtonGl()
  }
}
// Set up buttonGl text transition timings on page load
textElements = buttonGl.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the renderGl loop
window.initBurstGl()
renderGl()