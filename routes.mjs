import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const usersController = initUsersController(db);
  // main page
  app.get('/', usersController.index)
  app.get('/games', GamesController.index);
  app.get('/checkCookies', usersController.checkCookies);
  app.get('/getGames', GamesController.getGames)
  app.get('/getPlayers', usersController.getPlayers)
  app.get('/joinGame/:gameid', GamesController.joinGame)
  app.get('/renderGame/:gameid', GamesController.renderGame)
  app.get('/startFirstRound', GamesController.startMainGame)
  app.get('/joinCurrentGame', GamesController.joinCurrentGame)
  app.get('/games/skip', GamesController.skipRound)
  app.get('/games/refresh', GamesController.refreshData)
  app.get('/lobby', usersController.getLobby)
  app.post('/login', usersController.login);
  app.post('/register', usersController.register);
  // create a new game
  app.post('/games', GamesController.create);
  app.post('/games/swap', GamesController.swapRound)
  app.post('/games/playRound', GamesController.playRound)
  app.post('/games/takePile', GamesController.takePile)
  // update a game with new cards
  // app.put('/games/:id/deal', GamesController.deal);
}
