const checkBlankInput = (value) => value === '';
const whoWonText = document.createElement('p');
whoWonText.id = '#whoWon';
// global value that holds info about the current hand.
let currentGame = null;
const gameInfo = document.createElement('p')
const playZoneDiv = document.createElement('div')
playZoneDiv.classList.add('cardDiv')
playZoneDiv.id = 'playZoneDiv'
// const deckDiv = document.createElement('div')
// deckDiv.classList.add('cardDiv')
const firstDiv = document.createElement('div')
// TO DO
// ** REFRESH AUTOMATIC / DO AFTER SWAP AS WELL FOR PLAYER THAT SWAPPED
// ** CREATE FUNCTION TO REFRESH FOR NEXT PLAYER!
// WIREFRAMING
// PLAYER CAN CHOOSE TO FLIP A CARD FROM TOP OF DECK(optional)
// PLAYERS CAN SEE OTHER PILES (SEND BACK ALL VIEWABLEPILE DATA)
const recreateDivs = () => {
  document.body.innerHTML = '';
  const firstDiv = document.createElement('div');
  firstDiv.classList.add('firstDiv');
  const gameContainer = document.createElement('div');
  gameContainer.id = 'game-container';
  gameContainer.classList.add('row')
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-div';
  document.body.appendChild(firstDiv);
  gameContainer.appendChild(gameInfo)
  document.body.appendChild(gameContainer);
  document.body.appendChild(buttonContainer);
};
// DOM manipulation function that displays the player's current hand.

const refreshData = (req, res) => {
  const gameContainer = document.querySelector('#game-container')
 gameContainer.removeChild(document.querySelector('#hand-container'))
 gameContainer.removeChild(document.querySelector('#pile-container'))
  axios.get('/games/refresh')
  .then((response) => {
    // to do for swap?
    mainGame(response.data)
  })
}

const mainGame = ({
  playerHandData, playerViewablePileData, currentPlayer, playZone, cardDeckLength
}) => {
  console.log(playerHandData)
  console.log(playerViewablePileData)
  console.log(currentPlayer)
  const cookieSplit = document.cookie.split("; ")
  const playerIDString = cookieSplit[cookieSplit.length - 1]
  const playerID = playerIDString.split('=')[1]
  const gameContainer = document.querySelector('#game-container');
  gameInfo.innerHTML = `It is now Player ${currentPlayer}'s turn to play. You are Player ${playerID}.`
  firstDiv.appendChild(gameInfo)
  document.body.appendChild(firstDiv)
  const handDiv = document.createElement('div')
  handDiv.id = 'hand-container'
  handDiv.classList.add('col-md-6')
  const pileDiv = document.createElement('div')
  pileDiv.id = 'pile-container'
  pileDiv.classList.add('col-md-6')
  gameContainer.appendChild(handDiv)
  gameContainer.appendChild(pileDiv)
  const refreshButton = document.getElementById('refresh-button')
  refreshButton.style.display = 'block'
  document.querySelector('.joinButton').style.display = 'none'
  document.querySelector('.createButton').style.display = 'none'
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
  gameContainer.appendChild(handDiv)

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
gameContainer.appendChild(pileDiv)

  // render playZone
  const boardContainer = document.createElement('div')
  boardContainer.id = 'board-container'
  playZoneDiv.innerHTML = 'PlayZone:'
    const playZoneCard = document.createElement('img')
  if (playZone.length === 0) {
    playZoneDiv.innerHTML = 'The playzone is empty! Play whichever card you want!'
  }
  else {
  const playZoneCard = document.createElement('img')
  playZoneCard.classList.add('cardImage')
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
  console.log(playZone)
    // // render deck/button to draw from deck
  // // if deckLength is 0, don't display
  if(cardDeckLength > 0) {
  const deckBack = document.createElement('img')
  deckBack.src = `images/green_back.png`
  deckBack.classList.add('cardImage')
  boardContainer.appendChild(deckBack)
}
  boardContainer.appendChild(playZoneDiv)
  document.body.appendChild(boardContainer)


  // // if there are cards in hand
const handCards = Array.from(document.querySelectorAll('.handCard'))
handCards.forEach((card, i) => {
      card.addEventListener('click', () => {
            const cardData = JSON.parse(card.firstChild.innerHTML)
      const cardPosition = i
      const duplicates = checkForDuplicates(card)
      console.log(duplicates)
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
        if (response.data === 'wrongTurn') {
          alert("It isn't your turn!")
        }
        else if (response.data === 'invalid') {
          alert("This card can't be played!")
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

const checkForDuplicates = (card) => {
  const cardDiv = card.parentNode.children
  const playedCardRank = JSON.parse(card.firstChild.innerHTML).rank
  const duplicateArray = []
  for (let i = 0; i < cardDiv.length; i += 1) {
    const currentCard = JSON.parse(cardDiv[i].firstChild.innerHTML)
    if (currentCard.rank === playedCardRank) {
      duplicateArray.push(i)
    }
  }
  return duplicateArray
}

const swapElements = (el1, el2) => {
  el1.classList.toggle('toSwap')
  el2.classList.toggle('toSwap')
    var p2 = el2.parentNode, n2 = el2.nextSibling
    if (n2 === el1) return p2.insertBefore(el1, el2)
    el1.parentNode.insertBefore(el2, el1);
    p2.insertBefore(el1, n2);
}


const runSwap = function ({
  playerHandData, playerViewablePileData, currentPlayer
}) {
  // manipulate DOM
  const gameContainer = document.querySelector('#game-container');
  gameContainer.innerHTML = ``
  gameInfo.innerHTML = `It is now Player ${currentPlayer}'s turn to swap.`
  gameContainer.appendChild(gameInfo)
  document.querySelector('.createButton').remove()

    const handContainer = document.createElement('div')
    handContainer.classList.add('handContainer')
  gameContainer.innerHTML += `<h2>Your hand:</h2>`
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
  gameContainer.appendChild(handContainer)

      const pileContainer = document.createElement('div')
    pileContainer.classList.add('pileContainer')
  gameContainer.innerHTML += `<h2>Your pile:</h2>`
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
gameContainer.appendChild(pileContainer)

const allCards = Array.from(document.querySelectorAll('.cardDiv'))
allCards.forEach((card) => {
      card.addEventListener('click', () => {
      card.classList.toggle('toSwap')
      const cardsToSwap = Array.from(document.querySelectorAll('.toSwap'))
       console.log(cardsToSwap)
       if (cardsToSwap.length === 2) {
         swapElements(cardsToSwap[0], cardsToSwap[1])
       }
      })
    })

const newHandDataArray = Array.from(document.querySelector('.handContainer').childNodes)
const newViewablePileDataArray = Array.from(document.querySelector('.pileContainer').childNodes)

const nextTurnButton = document.createElement('button')
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
console.log(data)
axios.post(`/games/swap`, data)
  .then((response) => {
    if(response.data === 'wrongTurn') {
      alert('It is not your turn!')
    }
    else if (response.data === 'mainPhase') {
      console.log('mainPhase')
      nextTurnButton.remove()
      refreshData()
    }
    else {
    console.log(response.data)
    const nextPlayerID = response.data.playerID
    gameInfo.innerHTML = `It is now Player ${nextPlayerID}'s turn to swap.`
    }
  })
})

};

const runGame = async (req, res) => {
  axios.get('/startFirstRound')
  .then((response) => {
    const currentGame = response.data
    console.log(currentGame);
    mainGame(currentGame)
  })
}

// const displayCards = ()
const createGame = function () {
  // Make a request to create a new game
  axios.post('/games')
    .then((response) => {
      // set the global value to the new game.
      currentGame = response.data;

      console.log(currentGame);

      const buttonContainer = document.querySelector('#button-div');
      // display it out to the user
      runSwap(currentGame);
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const joinGame = async (req, res) => {
  axios.get('/getGames')
  .then((response) => {
    const gamesLobbyDiv = document.createElement('div')

    const gameIDs = response.data
    gameIDs.forEach((id) => {
      const joinButton = document.createElement('button')
      const label = document.createElement('h3')
      label.innerHTML = `game ${id}`
      joinButton.innerHTML = `Join`
      gamesLobbyDiv.appendChild(label)
      gamesLobbyDiv.appendChild(joinButton)
      joinButton.addEventListener('click', () => {
        axios
        .get(`/joinGame/${id}`)
        .then((response) => {
          gamesLobbyDiv.innerHTML = ''
           const currentGame = response.data
           console.log(currentGame)
          // change to have join on seperate page
          if(currentGame.gamePhase === 'ended'){
            alert('game has already ended!')
          }
          else if (currentGame.gamePhase === 'main') {
            axios.get('/joinCurrentGame')
            .then((response) => {
              console.log('hi')
              mainGame(response.data)
            })
          }
          else {
          runSwap(currentGame)
          }
        })
      })
      document.body.appendChild(gamesLobbyDiv)
    })
  })
}

const renderGame = () => {
  recreateDivs();
  const createGameBtn = document.createElement('button');
  createGameBtn.addEventListener('click', createGame);
  createGameBtn.classList.add('createButton')
  createGameBtn.innerText = 'Create Game';
  const buttonContainer = document.querySelector('#button-div');
  buttonContainer.appendChild(createGameBtn);
  const joinGameButton = document.createElement('button')
  joinGameButton.innerText = 'Join Game'
  joinGameButton.classList.add('joinButton')
  joinGameButton.addEventListener('click', joinGame)
  const refreshButton = document.createElement('button')
refreshButton.innerHTML = 'Refresh'
refreshButton.id = 'refresh-button'
refreshButton.style.display = 'none'
  refreshButton.addEventListener('click', refreshData)
  buttonContainer.appendChild(joinGameButton)
  buttonContainer.appendChild(refreshButton)
};
const loadLogin = () => {
  recreateDivs();
  // registration
  const registrationDiv = document.createElement('div');
  const registrationLabel = document.createElement('h1');
  registrationLabel.innerHTML = 'Registration';
  const registrationEmailLabel = document.createElement('h2');
  registrationEmailLabel.innerHTML = 'Email';
  const registrationEmail = document.createElement('input');
  const registrationPassword = document.createElement('input');
  registrationEmail.classList.add('registration');
  registrationPassword.classList.add('registration');
  const registrationPasswordLabel = document.createElement('h2');
  registrationPasswordLabel.innerHTML = 'Password';
  const registrationButton = document.createElement('button');
  registrationButton.innerHTML = 'Submit';
  const registrationUsername = document.createElement('input')
  registrationUsername.classList.add('registration');
  registrationDiv.appendChild(registrationLabel);
  registrationDiv.appendChild(registrationEmailLabel);
  registrationDiv.appendChild(registrationEmail);
  registrationDiv.appendChild(registrationUsername)
  registrationDiv.appendChild(registrationPasswordLabel);
  registrationDiv.appendChild(registrationPassword);
  registrationDiv.appendChild(registrationButton);
  
  document.querySelector('.firstDiv').appendChild(registrationDiv);
  // login
  const loginDiv = document.createElement('div');
  const loginLabel = document.createElement('h1');
  loginLabel.innerHTML = 'Login';
  const loginEmailLabel = document.createElement('h2');
  loginEmailLabel.innerHTML = 'Email';
  const loginEmail = document.createElement('input');
  const loginPassword = document.createElement('input');
  loginEmail.classList.add('login');
  loginPassword.classList.add('login');
  const loginPasswordLabel = document.createElement('h2');
  loginPasswordLabel.innerHTML = 'Password';
  const loginButton = document.createElement('button');
  loginButton.innerHTML = 'Submit';
  loginDiv.appendChild(loginLabel);
  loginDiv.appendChild(loginEmailLabel);
  loginDiv.appendChild(loginEmail);
  loginDiv.appendChild(loginPasswordLabel);
  loginDiv.appendChild(loginPassword);
  loginDiv.appendChild(loginButton);
  document.querySelector('.firstDiv').appendChild(loginDiv);

  registrationButton.addEventListener('click', () => {
    const getData = [...document.querySelectorAll('.registration')];
    const formData = getData.map((x) => x.value);
    if (formData.some(checkBlankInput)) {
      alert('Please fill out all fields!');
      return;
    }
    const data = {
      email: formData[0],
      username: formData[1],
      password: formData[2],
    };
    axios
      .post('/register', data)
      .then((response) => {
        if (response.data === 'emailExists') {
          alert('That email already exists!');
        }
        else if (response.data === 'userCreated') {
          document.querySelector('.firstDiv').remove();
          renderGame();
        }
      });
  });
  loginButton.addEventListener('click', () => {
    const getData = [...document.querySelectorAll('.login')];
    const formData = getData.map((x) => x.value);
    if (formData.some(checkBlankInput)) {
      alert('Please fill out all fields!');
      return;
    }
    const data = {
      email: formData[0],
      password: formData[1],
    };
    axios
      .post('/login', data)
      .then((response) => {
        console.log(response);
        if (response.data === 'invalidLogin') {
          alert('Please check your details!');
        }
        else if (response.data === 'loggedIn') {
          document.querySelector('.firstDiv').remove();
          renderGame();
        }
      });
  });
};

window.onload = () => {
  axios
    .get('/checkCookies')
    .then((response) => {
      if (response.data === 'renderLogin') {
        loadLogin();
      }
      else if (response.data === 'renderGame') {
        renderGame();
      }
    });
};
