const grid = document.querySelector('.grid')
let currentShooterIndex = 202
let width = 15
let direction = 1
let speed = 200
let invadersId = null
let goingRight = true
let aliensRemoved = []
let levelStatus = 1
let playStatus = true
let laserBeam = new Audio("./media/laser.mp3")
let boomSound = new Audio("./media/boom.wav")



const resultsDisplay = document.querySelector('.results')
const scoreDisplay = document.querySelector('.score')
const levelDisplay = document.querySelector('.level')
const restartButton = document.querySelector('.restart')
const gameover = null// complete this message to display score and game over 

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))


const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}



function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}


squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft' :
            if (currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case 'ArrowRight' : 
            if (currentShooterIndex % width < width -1) currentShooterIndex +=1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')    
}

document.addEventListener('keydown', moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
    remove()

    if (rightEdge && goingRight ) {
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width +1
            direction = -1
            goingRight = false
        }
    }
    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true 
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction 
    }

  draw()
    //set variable speed for levels 
    //win round function 
    
    if (squares[currentShooterIndex].classList.contains('invader','shooter')) {
        resultsDisplay.style.color = "red"
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
        // confirm if this is necessary 
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length){
            resultsDisplay.style.color = "red"
            resultsDisplay.innerHTML = 'GAME OVER'
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.style.color = "green"
        resultsDisplay.innerHTML = 'WINNER!!'
        clearInterval(invadersId)
        speed = speed +=20
        levelStatus.innerHTML = levelStatus +=1
    }
}

invadersId = setInterval(moveInvaders, speed)

function playRestart(){
    if (playStatus === true){
        playStatus = false 
    } else {
        playStatus = true
    }
}

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')
        

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')
            //add sound to these events 
            boomSound.play()
          
            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'),300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            //display array of removed aliens as a score card 
            aliensRemoved.push(alienRemoved)
            scoreDisplay.innerHTML = aliensRemoved.length
        }
    }
    switch(e.key) {
        //using space bar here
        case ' ': 
        laserId = setInterval(moveLaser, 75)
        laserBeam.play()
    }
}

document.addEventListener('keydown',shoot)

