const container = document.querySelector('#carousel')
const slidesContainer = container.querySelector('#slides-container')
const slides = container.querySelectorAll('.slide')
const indicatorsContainer = container.querySelector('#indicators-container')
const indicators = container.querySelectorAll('.indicator')
const pauseBtn = container.querySelector('#pause-btn')
const prevBtn = container.querySelector('#prev-btn')
const nextBtn = container.querySelector('#next-btn')

const SLIDES_COUNT = slides.length
const TIMER_INTERVAL = 2000
const CODE_ARROW_LEFT = 'ArrowLeft'
const CODE_ARROW_RIGHT = 'ArrowRight'
const CODE_SPACE = 'Space'
const FA_PAUSE = '<i class="fas fa-pause"></i>'
const FA_PLAY = '<i class="fas fa-play"></i>'

let currentSlide = 0
let isPlaing = true
let timerId = null
let swipeStartX = null
let swipeEndX = null

function gotoNth(n) {
    slides[currentSlide].classList.toggle('active')
    indicators[currentSlide].classList.toggle('active')
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT
    slides[currentSlide].classList.toggle('active')
    indicators[currentSlide].classList.toggle('active')
}

function gotoPrev() {
    gotoNth(currentSlide - 1)
}

function gotoNext() {
    gotoNth(currentSlide + 1)
}

function tick() {
    timerId = setInterval(gotoNext, TIMER_INTERVAL)
}

function pauseHandler() {
    if (!isPlaing) return
    clearInterval(timerId)
    pauseBtn.innerHTML = FA_PLAY
    isPlaing = false
}

function playHandler() {
    tick()
    pauseBtn.innerHTML = FA_PAUSE
    isPlaing = true
}

function pausePlayHandler() {
    isPlaing ? pauseHandler() : playHandler()
}

function nextHandler () {
    pauseHandler()
    gotoNext()
}

function prevHandler () {
    pauseHandler()
    gotoPrev()
}

function indicatorHandlerHandler(e) {
    const { target } = e
    if (target && target.classList.contains('indicator')) {
        pauseHandler()
        gotoNth(+target.getAttribute('data-slide-to'))
    }
}

function keydownHandler(e) {
    const { code } = e
    if (code === CODE_ARROW_LEFT) prevHandler()
    if (code === CODE_ARROW_RIGHT) nextHandler()
    if (code === CODE_SPACE) {
        e.preventDefault()
        pausePlayHandler()
    }
}

function swipeStartHandler(e) {
    swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
}

function swipeEndHandler(e) {
    swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX
    if (swipeEndX - swipeStartX > 100) prevHandler()
    if (swipeEndX - swipeStartX < -100) nextHandler()
}

function initEventListeners() {
    pauseBtn.addEventListener('click', pausePlayHandler)
    nextBtn.addEventListener('click', nextHandler)
    prevBtn.addEventListener('click', prevHandler)
    indicatorsContainer.addEventListener('click', indicatorHandlerHandler)
    slidesContainer.addEventListener('touchstart', swipeStartHandler)
    slidesContainer.addEventListener('mousedown', swipeStartHandler)
    slidesContainer.addEventListener('touchend', swipeEndHandler)
    slidesContainer.addEventListener('mouseup', swipeEndHandler)
    document.addEventListener('keydown', keydownHandler)
}

function init () {
    initEventListeners()
    tick()
}

init()