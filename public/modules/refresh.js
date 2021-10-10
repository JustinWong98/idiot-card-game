import {runSwap, mainGame} from '../script.js'

const refreshData = (req, res) => {
  //   const prevRefreshButton = document.querySelector('#refresh-button')
  // prevRefreshButton.remove()
  axios.get('/games/refresh')
  .then((response) => {
    if (response.data === 'ended') {
      document.body.innerHTML = '<h1> The Game is already over!</h1>'
      alert ('The game is over!')
    }
    else if (response.data.gamePhase === 'swap') {
    runSwap(response.data)
    }
    else {
    mainGame(response.data)
    }
  })
};

export default refreshData