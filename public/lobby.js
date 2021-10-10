// ADD INVITE HANDLING
window.onload = () => {
  axios
    .get('/checkCookies')
    .then((response) => {
      if (response.data === 'render') {
const firstDiv = document.createElement('div')
firstDiv.id = 'firstDiv'
const getInviteButton = document.createElement('button')
getInviteButton.id = 'inviteButton'
getInviteButton.classList.add('btn')
getInviteButton.classList.add('btn-primary')
getInviteButton.classList.add('btn-lg')
getInviteButton.innerHTML = 'Get Invites'
getInviteButton.addEventListener('click', getGames)
const createButton = document.createElement('button')
createButton.classList.add('btn')
createButton.classList.add('btn-outline-primary')
createButton.classList.add('btn-LG')
createButton.innerHTML = 'Create Game'
createButton.addEventListener('click', () => {
  const numberOfPlayersInput = document.createElement('input')
  numberOfPlayersInput.id = 'noOfPlayers'
  numberOfPlayersInput.type = 'number'
  numberOfPlayersInput.min = 2
  numberOfPlayersInput.max = 4
  const noOfPlayersLabel = document.createElement('h2')
  noOfPlayersLabel.innerHTML = `How many players for this game (including you)? Max is 4 players.`
  const invitePlayerButton = document.createElement('button')
  invitePlayerButton.innerHTML = 'Select Who to Invite'
  invitePlayerButton.classList.add('btn')
invitePlayerButton.classList.add('btn-secondary')
  invitePlayerButton.addEventListener('click', axios.get('/getPlayers')
  .then((response) => {
    invitePlayerButton.addEventListener('click', () => {
    invitePlayerButton.style.display = 'none'
    numberOfPlayersInput.style.display = 'none'
     noOfPlayersLabel.innerHTML = `Please select the usernames of the players you wish to invite`
    for (let i = 0; i < Number(document.querySelector('#noOfPlayers').value) - 1; i += 1) {
    const invitePlayerSelect = document.createElement('select')
    invitePlayerSelect.classList.add('invitedPlayers')
    for (let i = 0; i< response.data.length; i += 1) {
      const invitePlayerOption = document.createElement('option')
      invitePlayerOption.value = response.data[i].id
      invitePlayerOption.innerText = response.data[i].username
      invitePlayerSelect.appendChild(invitePlayerOption)
    }
    firstDiv.appendChild(invitePlayerSelect)
    }
  const createGameSubmit = document.createElement('button')
  createGameSubmit.classList.add('btn')
  createGameSubmit.classList.add('btn-outline-success')
  createGameSubmit.innerHTML = 'Submit'
  createGameSubmit.addEventListener('click', createGame)
  firstDiv.appendChild(createGameSubmit)
  })
  }))
  createButton.style.display = 'none'
  firstDiv.appendChild(noOfPlayersLabel)
  firstDiv.appendChild(numberOfPlayersInput)
  firstDiv.appendChild(invitePlayerButton)
  })
  firstDiv.appendChild(getInviteButton)
firstDiv.appendChild(createButton)
document.body.appendChild(firstDiv)
}
    });
};

const createGame = async (req, res) => {
  // Make a request to create a new game
  const invitedPlayersArray = Array.from(document.querySelectorAll('.invitedPlayers'))
  const invitedPlayersIDs = []
  invitedPlayersArray.forEach((player) => {
    invitedPlayersIDs.push(Number(player.value))
  })
  const data = {
    noOfPlayers: Number(document.querySelector('#noOfPlayers').value),
    invitedPlayersIDs
    }
  axios.post('/games', data)
    .then((response) => {
      console.log(response.data)
      if (response.data.gameID){
      const gameLabel = document.createElement('h1')
      gameLabel.innerHTML = `Your created game ID is ${response.data.gameID}`
      const firstDiv = document.querySelector('#firstDiv')
      firstDiv.appendChild(gameLabel)
      getGames()
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
};

const getGames = async (req, res) => {
  axios.get('/getGames')
  .then((response) => {
    const gamesLobbyDiv = document.createElement('div')
    gamesLobbyDiv.id = "lobbyDiv"
    gamesLobbyDiv.classList.add('row')
    const gameIDs = response.data
    console.log(response.data)
    gameIDs.forEach((id) => {
      const gameDiv = document.createElement('div')
      gameDiv.classList.add('gameDiv')
      gameDiv.classList.add('col-6')
      const joinButton = document.createElement('button')
      joinButton.classList.add('btn')
      joinButton.classList.add('btn-success')
      joinButton.classList.add('btn-lg')
      const label = document.createElement('h3')
      label.innerHTML = `Game ID: ${id}`
      const joinLink = document.createElement('a')
      joinLink.href = `/joinGame/${id}`
      joinButton.innerText = `Join`
      joinLink.appendChild(joinButton)
      gameDiv.appendChild(label)
      gameDiv.appendChild(joinLink)
      gamesLobbyDiv.appendChild(gameDiv)
    })
    const getInviteButton = document.querySelector('#inviteButton')
    getInviteButton.style.display = 'none'
    document.body.appendChild(gamesLobbyDiv)
  })
}