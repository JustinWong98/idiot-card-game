const checkBlankInput = (value) => value === '';
// global value that holds info about the current hand.
const gameInfo = document.createElement('div')
gameInfo.id = 'game-info'
const playZoneDiv = document.createElement('div')
playZoneDiv.classList.add('cardDiv')
playZoneDiv.id = 'playZoneDiv'
const boardContainer = document.createElement('div')
boardContainer.id = 'board-container'
// ** SUNDAY
// ** Webpack
// ** DEPLOY TO HEROKU
// ** REFACTOR
import swapElements from './modules/swap.js'
import checkForDuplicates from './modules/duplicateCheck.js';
import refreshData from './modules/refresh.js'

const mainGame = ({
  playerHandData, playerViewablePileData, currentPlayer, playZone, cardDeckLength, otherPlayerCards
}) => {
  console.log(cardDeckLength)
  boardContainer.innerHTML = ''
  const cookieSplitFirst = document.cookie.split("playerID=")
  const cookieSplitPlayerID = cookieSplitFirst[1].split(";")
  const playerID = cookieSplitPlayerID[0]
  const gameContainer = document.querySelector('#game-container');
  gameInfo.innerHTML = `It is now Player ${currentPlayer}'s turn to play. You are Player ${playerID}.`
  gameContainer.appendChild(gameInfo)
  document.body.appendChild(gameContainer)
  const handDiv = document.createElement('div')
  handDiv.id = 'hand-container'
  const pileDiv = document.createElement('div')
  pileDiv.id = 'pile-container'
  const refreshButton = document.createElement('button')
  refreshButton.classList.add('btn')
  refreshButton.classList.add('btn-outline-success')
  refreshButton.id = 'refresh-button'
  refreshButton.innerText = 'Refresh'
  refreshButton.style.display = 'block'
  refreshButton.addEventListener('click', () => {
  const prevRefreshButton = document.querySelector('#refresh-button')
  prevRefreshButton.remove()
    refreshData()
  })
  // if playerHandData length === 0, they can use from viewable pile
    const handContainer = document.createElement('div')
  handDiv.innerHTML = `<h2>Your hand:</h2>`
  playerHandData.forEach((card, i) => {
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('cardDiv')
    cardDiv.classList.add('handCard')
    const cardInfo = document.createElement('div')
    cardInfo.innerHTML = JSON.stringify(card)
    cardInfo.style.display = 'none'
    cardDiv.appendChild(cardInfo)
    const cardImageDisplay = document.createElement('img');
     cardImageDisplay.src = card.cardImage;
     cardImageDisplay.classList.add('cardImage');
     cardDiv.appendChild(cardImageDisplay)
     handContainer.appendChild(cardDiv)
  })
  handDiv.appendChild(handContainer)
  boardContainer.appendChild(handDiv)

  const pileContainer = document.createElement('div')
  pileDiv.innerHTML = `<h2>Your pile:</h2>`
  playerViewablePileData.forEach((card, i) => {
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('cardDiv')
    cardDiv.classList.add('pileCard')
        const cardInfo = document.createElement('div')
    cardInfo.innerHTML = JSON.stringify(card)
    cardInfo.style.display = 'none'
    cardDiv.appendChild(cardInfo)
    const cardImageDisplay = document.createElement('img');
     cardImageDisplay.src = card.cardImage;
     cardImageDisplay.classList.add('cardImage');
     cardDiv.appendChild(cardImageDisplay)
     pileContainer.appendChild(cardDiv)
})
pileDiv.appendChild(pileContainer)
boardContainer.appendChild(pileDiv)

// render playZone
playZoneDiv.innerHTML = ''
const playZoneCard = document.createElement('img')
if (playZone.length === 0) {
    playZoneDiv.innerHTML = 'The playzone is empty! Play whichever card you want!'
}
else {
  const playZoneCard = document.createElement('img')
  playZoneCard.classList.add('playZoneIMG')
  playZoneCard.src = playZone[playZone.length - 1].cardImage
  playZoneDiv.appendChild(playZoneCard)
}
playZoneDiv.addEventListener('click', () => {

  axios.post('/games/takePile', playerHandData)
  .then((response) => {
      const nextPlayerID = response.data.currentTurn
  refreshData()
  })
})
    // // render deck/button to draw from deck
  // // if deckLength is 0, don't display
  if(cardDeckLength > 0) {
    const deckBackDiv = document.createElement('div')
    deckBackDiv.classList.add('cardDiv')
  const deckBack = document.createElement('img')
  deckBack.src = `images/green_back.png`
  deckBack.classList.add('deckImage')
  deckBackDiv.id = 'deck'
  deckBackDiv.appendChild(deckBack)
  boardContainer.appendChild(deckBackDiv)
}
  boardContainer.appendChild(playZoneDiv)

  const cardBacks = ['images/red_back.png', 'images/purple_back.png', 'images/yellow_back.png']
//show other player cards and pile
console.log(otherPlayerCards)
otherPlayerCards.forEach((player, i) => {
  const otherPlayerPile = document.createElement('div')
  otherPlayerPile.id = `player${i}Pile`
  player.pile.forEach((card) => {
    console.log(card.cardImage)
    const otherPlayerPileCard = document.createElement('img')
    otherPlayerPileCard.src = card.cardImage
    otherPlayerPileCard.classList.add('oppCardImage')
    otherPlayerPile.appendChild(otherPlayerPileCard)
  })
  const otherPlayerHand = document.createElement('div')
  otherPlayerHand.id = `player${i}Hand`
  for (let j = 0; j < player.hand; j+= 1) {
    const otherPlayerHandCard = document.createElement('img')
    otherPlayerHandCard.src = cardBacks[i]
    otherPlayerHandCard.classList.add('oppCardImage')
    otherPlayerHand.appendChild(otherPlayerHandCard)
  }
  boardContainer.appendChild(otherPlayerPile)
  boardContainer.appendChild(otherPlayerHand)
})
  gameContainer.appendChild(refreshButton)
document.body.appendChild(boardContainer)


  // // if there are cards in hand
const handCards = Array.from(document.querySelectorAll('.handCard'))
handCards.forEach((card, i) => {
      card.addEventListener('click', () => {
      const cardData = JSON.parse(card.firstChild.innerHTML)
      const cardPosition = i
      const duplicates = checkForDuplicates(card)
      let playedDuplicates = 0
      if (duplicates.length > 1) {
        const noOfDuplicatesPlayed = window.prompt("How many duplicates do you wish to play?")
        if (isNaN(noOfDuplicatesPlayed) || noOfDuplicatesPlayed > duplicates.length || noOfDuplicatesPlayed < 1) {
          windows.alert('Please input a valid number depending on how many duplicates you have!')
          return
        }
        else {
          playedDuplicates = noOfDuplicatesPlayed
        }
      }
      const data = {playerHand: playerHandData, playerViewablePile: playerViewablePileData, cardData, cardPosition, playedDuplicates}
      axios.post('/games/playRound', data)
      .then ((response) => {
        if (response.data === 'wrongTurn') {
          alert("It isn't your turn!")
        }
        else if (response.data === 'invalid') {
          alert("This card can't be played!")
        }
        else {
     refreshData()
        }
      })
      })
    })
  // if there are no cards in hand
  if (playerHandData.length === 0) {
    const pileCards = Array.from(document.querySelectorAll('.pileCard'))
pileCards.forEach((card, i) => {
      card.addEventListener('click', () => {
      const cardData = JSON.parse(card.firstChild.innerHTML)
      const cardPosition = i
      const duplicates = checkForDuplicates(card)
      let playedDuplicates = 0
      if (duplicates.length > 1) {
        const noOfDuplicatesPlayed = window.prompt("How many duplicates do you wish to play?")
        if (isNaN(noOfDuplicatesPlayed) || noOfDuplicatesPlayed > duplicates.length || noOfDuplicatesPlayed < 1) {
          windows.alert('Please input a valid number depending on how many duplicates you have!')
          return
        }
        else {
          playedDuplicates = noOfDuplicatesPlayed
        }
      }
      const data = {playerHand: playerHandData, playerViewablePile: playerViewablePileData, cardData, cardPosition, playedDuplicates}
      axios.post('/games/playRound', data)
      .then ((response) => {
        console.log(response.data)
        if (response.data === 'wrongTurn') {
          alert("It isn't your turn!")
        }
        else if (response.data === 'invalid') {
          alert("This card can't be played!")
        }
        else if (response.data === 'ended') {
          alert ("The game has ended.")
        }
    else if (response.data === 'skip') {
      alert('Congrats! You are not the idiot!')
    }
        else {
     refreshData()
        }
      })
      })
    })
  }
    if (playerHandData.length === 0 && playerViewablePileData.length === 0) {
      axios.get('/games/skip')
      .then((response) => {
        if (response.data.idiotID !== undefined) {
          gameContainer.innerHTML = `Player ${response.data.idiotID} is the idiot!`
        }
        else if (response.data === 'inProgress') {
          refreshData()
        }
      })
    }
}

const runSwap = function ({
  playerHandData, playerViewablePileData, currentPlayer, playerID
}) {
  // manipulate DOM
  console.log(currentPlayer)
  console.log(playerHandData)
  console.log(playerViewablePileData)
  const gameContainer = document.querySelector('#game-container');
  gameContainer.innerHTML = ''
gameContainer.appendChild(gameInfo)
  gameInfo.innerHTML = `It is now Player ${currentPlayer}'s turn to swap. You are player ${playerID}`
  gameContainer.appendChild(gameInfo)
const refreshSwapButton = document.createElement('button')
refreshSwapButton.id = 'refresh-button'
refreshSwapButton.innerText = `Refresh`
refreshSwapButton.classList.add('btn')
refreshSwapButton.classList.add('btn-outline-success')
refreshSwapButton.addEventListener('click', refreshData)
    const handContainer = document.createElement('div')
    handContainer.style.paddingLeft = '25%'
    handContainer.classList.add('handContainer')
  gameContainer.innerHTML += `<h2>Your hand:</h2>`
  playerHandData.forEach((card, i) => {
    console.log('hi')
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('cardDiv')
    cardDiv.classList.add('handCard')
    cardDiv.style.marginLeft = '1%'
    cardDiv.style.marginRight = '1%'
    const cardInfo = document.createElement('div')
    cardInfo.innerHTML = JSON.stringify(card)
    cardInfo.style.display = 'none'
    cardDiv.appendChild(cardInfo)
    const cardImageDisplay = document.createElement('img');
     cardImageDisplay.src = card.cardImage;
     cardImageDisplay.classList.add('swapImage');
     cardDiv.appendChild(cardImageDisplay)
     handContainer.appendChild(cardDiv)
  })
  gameContainer.appendChild(handContainer)

  const pileContainer = document.createElement('div')
  pileContainer.classList.add('pileContainer')
  pileContainer.style.paddingLeft = '25%'
  gameContainer.innerHTML += `<h2>Your pile:</h2>`
  playerViewablePileData.forEach((card, i) => {
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('cardDiv')
    cardDiv.classList.add('pileCard')
    cardDiv.style.marginLeft = '1%'
    cardDiv.style.marginRight = '1%'
    const cardInfo = document.createElement('div')
    cardInfo.innerHTML = JSON.stringify(card)
    cardInfo.style.display = 'none'
    cardDiv.appendChild(cardInfo)
    const cardImageDisplay = document.createElement('img');
     cardImageDisplay.src = card.cardImage;
     cardImageDisplay.classList.add('swapImage');
     cardDiv.appendChild(cardImageDisplay)
     pileContainer.appendChild(cardDiv)
})
gameContainer.appendChild(pileContainer)
const newHandDataArray = Array.from(document.querySelector('.handContainer').childNodes)
const newViewablePileDataArray = Array.from(document.querySelector('.pileContainer').childNodes)
const allCards = Array.from(document.querySelectorAll('.cardDiv'))
allCards.forEach((card) => {
      card.addEventListener('click', () => {
      card.classList.toggle('toSwap')
      const cardsToSwap = Array.from(document.querySelectorAll('.toSwap'))
       if (cardsToSwap.length === 2) {
         swapElements(cardsToSwap[0], cardsToSwap[1])
       }
      })
    })

gameContainer.appendChild(refreshSwapButton)
const nextTurnButton = document.createElement('button')
nextTurnButton.classList.add('btn')
nextTurnButton.classList.add('btn-primary')
nextTurnButton.classList.add('btn-lg')
nextTurnButton.innerHTML = 'Done Swapping?'
gameContainer.appendChild(nextTurnButton)
nextTurnButton.addEventListener('click',()=> {
const newHandData = []
newHandDataArray.forEach((card) => {
newHandData.push(JSON.parse(card.firstChild.innerHTML))
})

const newViewablePileData = []
newViewablePileDataArray.forEach((card) => {
newViewablePileData.push(JSON.parse(card.firstChild.innerHTML))
})
const data = {newHandData, newViewablePileData, currentPlayer}
axios.post(`/games/swap`, data)
  .then((response) => {
    if(response.data === 'wrongTurn') {
      alert('It is not your turn!')
    }
    else if (response.data === 'mainPhase') {
      const gameContainer = document.querySelector('#game-container')
      gameContainer.innerHTML = ''
      nextTurnButton.remove()
      refreshData()
    }
    else {
    const nextPlayerID = response.data.playerID
    gameInfo.innerHTML = `It is now Player ${nextPlayerID}'s turn to swap.`
    }
  })
})
document.body.appendChild(gameContainer);
};

window.onload = () => {
  axios
    .get('/checkCookies')
    .then((response) => {
      console.log('what')
      if (response.data === 'render') {
        const gameCookieFirst = document.cookie.split("gameID=")
        const gameCookie = gameCookieFirst[1].split(';')[0]
        console.log(gameCookie)
        axios
        .get(`/renderGame/${gameCookie}`)
        .then((response) => {
          // gamesLobbyDiv.innerHTML = ''
           const currentGame = response.data
           console.log(currentGame)
          // change to have join on seperate page
          if(currentGame.gamePhase === 'ended'){
            document.body.innerHTML = ''
            alert('game has already ended!')
          }
          else if (currentGame.gamePhase === 'main') {
            axios.get('/joinCurrentGame')
            .then((response) => {
              mainGame(response.data)
            })
          }
          else {
          console.log(currentGame)
          runSwap(currentGame)
          }
        })
      }
    });
};

export {runSwap, mainGame}