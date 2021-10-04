/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

import e, { response } from "express";

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        cardImage: `images/${rankCounter}_${currentSuit}.png`,
      };
      if (card.name === 'ace') {
        card.rank = 14
        card.cardImage = `images/${card.rank}_${currentSuit}.png`
      }

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

export default function initGamesController(db) {
  const { Op } = db.Sequelize;
  // render the main page
  const index = (request, response) => {
    response.render('games/index');
  };

  const invite = (req, res) => {
    const player1ID = req.cookies.id
    const playerCount = req.body.playerCount
    let noPlayerValue = ''
    if (req.body.addBots === true) {
      noPlayerValue = 'bot'
    }
    else {
      noPlayerValue = 'none'
    }
    const playerIDs = []
    playerIDs.push(player1ID)
    if (req.body.playerIDs.length > 0) {
    playerIDs.push([...req.body.playerIDs])
    const isGameReady = false
  }
  else {
    const isGameReady = true
  }
    const newGame = {
      gameState: {
        playerCount,
        botSetting: noPlayerValue,
        isGameReady,
      },
      player1ID,
      player2ID: playerIDs[1] || noPlayerValue,
      player3ID: playerIDs[2] || noPlayerValue,
      player4ID: playerIDs[3] || noPlayerValue,
    };
     try {
      // run the DB INSERT query
      // const game = await db.Game.create(newGame)
      console.log(game);
      // need to send invites to players
      res.send(game)
     } catch (error) {
       res.status(500).send(error);
     }
  }

  // const sendInvite = async(req,res) => {
  //   const invites = await
  // }

  const getGames = async(req,res) => {
    // const game = await db.Game.findByPk(req.params.id);
    const playerID = req.cookies.id
    const game = await db.Game.findAll({
      where: {
        [Op.or]: [
          { userId: playerID},
          { player2_id: playerID },
          // { player3_id: playerID },
          // { player4_id: playerID },
        ]
      }
    })
    const gameIDs = []
    game.forEach((game) => {
      gameIDs.push(game.id)
    })
    //player clicks on invite
    // if (req.body.invite === 'rejected') {
    //   game
    // }
    //player refuses an invite
    //replaced by bot or null depending on game.gameState.botSetting
    res.send(gameIDs)
  }

  const joinGame = async(req,res) => {
    const gameID = req.params.gameid
    const game = await db.Game.findOne({
      where: {
        id: gameID
      }
    })
          res.cookie('gameID', game.id)
          let playerID = 0
    if (Number(req.cookies.id) === game.userId) {
      playerID = 1
    }
    else if (Number(req.cookies.id) === game.player2Id){
      playerID = 2
    }
    if (playerID !== 0) {
 res.cookie('playerID', playerID)
      res.send({
        playerHandData: game.gameState.players[playerID-1].playerHand,
        playerViewablePileData: game.gameState.players[playerID-1].playerViewablePile,
        currentPlayer: game.gameState.currentTurn,
        gamePhase: game.gamePhase
      })
    }
  }

  // create a new game. Insert a new row in the DB.
  const create = async (req, res) => {
    try{
    // deal out a new shuffled deck for this game.
    let cardDeck = shuffleCards(makeDeck());
    // to allow 4 max, to be taken from game settings
    const playerCount = 2;
    // more than 2 players means 2x decks
    if(playerCount > 2) {
      cardDeck = [shuffleCards(makeDeck()), cardDeck]
    }
    const player1 = await db.User.findOne({
      where: {
        id: req.cookies.id,
      },
    });

    // need to implement invite sending functionality
    const players = await db.User.findAll();

    let randomID = 0;
    //refactor this, allow for bots plus human players
    let diffPlayer = false;
    while (!diffPlayer) {
      randomID = Math.floor(Math.random() * players.length) + 1;
      if (randomID !== req.cookies.id) {
        diffPlayer = true;
      }
    }
    const player2 = await db.User.findOne({
      where: {
        id: randomID,
      },
    });

      const playerPile = [];
      const playerViewablePile = [];
      const player2Pile = [];
      const player2ViewablePile = [];
      const playerHand = [];
      const player2Hand = [];

      //to create helper function for each player/bot
      for (let i = 0; i < 3; i+= 1) {
        playerPile.push(cardDeck.pop())
        player2Pile.push(cardDeck.pop())
        playerViewablePile.push(cardDeck.pop())
        player2ViewablePile.push(cardDeck.pop())
        playerHand.push(cardDeck.pop())
        player2Hand.push(cardDeck.pop())
      }

      const newGame = {
        noOfPlayers: playerCount,
        gameState: {
          cardDeck,
          players: [
          {
            playerHand,
            playerPile,
          playerViewablePile,
          },
          {
          playerHand: player2Hand,
          playerPile: player2Pile,
          playerViewablePile: player2ViewablePile,
          },
          ],
          currentTurn: 1,
          playZone: []
        },
        gamePhase: 'swap',
        userId: player1.id,
        player2Id: player2.id,
      }
      const game = await db.Game.create(newGame);
      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      // players can only view their own hand
      const playerID = req.cookies.id
      const playerDetails = game.gameState.players[0]
      // don't send information about their whole pile
      const playerViewablePileData = playerDetails.playerViewablePile
      const playerHandData = playerDetails.playerHand
      console.log(playerViewablePileData)
      // to send playerDetails instead of all cards
      res.cookie('gameID', game.id)
      res.cookie('playerID', 1)
      res.send({
        currentPlayer: 1,
        id: game.id,
        playerViewablePileData,
        playerHandData,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  const swapRound = async(req,res) => {
    try {
    //players take turns to swap cards from their hand to viewable pile
    const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
    
    let currentTurn = game.gameState.currentTurn
    let cardDeck = game.gameState.cardDeck
// const playerIDs = [
//       game.player1ID,
//       game.player2ID,
//       game.player3ID,
//       game.player4ID,
//     ];
    //remember to set cookies of each player differently when they accept invite
    let playerNumber = Number(req.cookies.playerID)
    if (playerNumber !== currentTurn){
      res.send('wrongTurn')
    }
else{
    // if player is bot, bot will not swap
    //set default values? or always have 4 players?
    // remember to add player3Prev and player4Prev
    const newViewablePile = req.body.newViewablePileData;
    const newHand = req.body.newHandData;
    game.gameState.players[playerNumber-1].playerHand = newHand
    game.gameState.players[playerNumber-1].playerViewablePile = newViewablePile
    const [player1Updated = null, player2Updated = null, player3Updated = null, player4Updated = null] = game.gameState.players
        await game.update({
      gameState: {
        cardDeck,
          players: [
          player1Updated,
          player2Updated,
          player3Updated,
          player4Updated,
          ],
        isReversed: false,
        currentTurn,
        playZone: []
      }
    })
    console.log(game)
    // to change to 4 or no of players
    if (game.gameState.currentTurn === game.noOfPlayers) {
            await game.update({
      gameState: {
        cardDeck,
          players: [
          player1Updated,
          player2Updated,
          player3Updated,
          player4Updated,
          ],
        isReversed: false,
        currentTurn: 1,
        playZone: []
      }
    })
    // need to remove swap functionality after this in script
    // first card from top of deck is played into playZone
    // first user can play card
    await game.update({
      gamePhase: 'main'
    })
      res.send('mainPhase')
    }
    else{
        currentTurn += 1
            await game.update({
      gameState: {
        cardDeck,
          players: [
          player1Updated,
          player2Updated,
          player3Updated,
          player4Updated,
          ],
        // playerIDs,
        isReversed: false,
        currentTurn,
        playZone: []
      }
    })
     const playerID = playerNumber += 1
      res.send({
        id: game.id,
        playerID,
        playerHandData: game.gameState.players[currentTurn - 1].playerHand,
        playerViewablePileData: game.gameState.players[currentTurn - 1].playerViewablePile,
        playZone: game.gameState.playZone,
        cardDeckLength: game.gameState.cardDeck.length
      })
    }
  }
    }
    // get the game by the ID passed in the request
    // update gameState with the new values
    // take turns to do this
  catch (error) {
      response.status(500).send(error);
    }
  }

  const startMainGame = async (req, res) => {
    try{
      const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
    console.log('game')
    const deck = game.gameState.cardDeck
    const playerID = req.cookies.playerID
    const newPlayZone = []
    newPlayZone.push(deck.pop())
    await game.update({
      gameState: {
         cardDeck: deck,
          players: game.gameState.players,
          currentTurn: 1,
          playZone: newPlayZone
      }
    })
          res.send({
        id: game.id,
        playerID,
        playerHandData: game.gameState.players[playerID-1].playerHand,
        playerViewablePileData: game.gameState.players[playerID-1].playerViewablePile,
        playZone: newPlayZone,
        currentPlayer: 1,
      })
    }
    catch (error) {
      response.status(500).send(error);
    }
  }

  const joinCurrentGame = async (req, res) => {
    try{
      const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
    let playerID = Number(req.cookies.id)
    console.log(playerID)
    if (playerID === game.userId) {
      playerID = 1
    }
    else if (playerID === game.player2Id){
      playerID = 2
    }
    console.log(playerID)
    // else if (playerID === game.player3Id){
    // playerID = 3
    // }
    // else if (playerID === game.player4Id){
    // playerID = 4
    // }
    res.send({
        id: game.id,
        playerID,
        playerHandData: game.gameState.players[playerID-1].playerHand,
        playerViewablePileData: game.gameState.players[playerID-1].playerViewablePile,
        playZone: game.gameState.playZone,
        currentPlayer: game.gameState.currentTurn,
      })
    }
    catch (error) {
      response.status(500).send(error);
    }
  }

  const takePile = async (req, res) => {
    const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
    let currentTurn = game.gameState.currentTurn
    const playerIDOfCurrent = Number(req.cookies.playerID)
      if (currentTurn !== playerIDOfCurrent) {
        res.send('wrongTurn')
        return
      }
      else {
        const playerHand = [...req.body, ...game.gameState.playZone]
        game.gameState.players[playerIDOfCurrent - 1] = {
          playerHand,
          playerViewablePile: game.gameState.players[playerIDOfCurrent - 1].playerViewablePile,
          playerPile: game.gameState.players[playerIDOfCurrent - 1].playerPile
        }
      }
      if (playerIDOfCurrent === Number(game.noOfPlayers)) {
        currentTurn = 1
      }
      else {
        currentTurn += 1
      }
      // turn is valid
      // update the game with the new info
        await game.update({
      gameState: {
        cardDeck: game.gameState.cardDeck,
        players: game.gameState.players,
        isReversed: false,
        currentTurn,
        playZone: []
      }
        });
        res.send({
        id: game.id,
        currentTurn,
        playerHandData: game.gameState.players[playerIDOfCurrent-1].playerHand,
        playerViewablePileData: game.gameState.players[playerIDOfCurrent-1].playerViewablePile,
        playZone: [],
        cardDeckLength: game.gameState.cardDeck.length
      });
  }

  //take card that was just put down
  // compare against rules,
  // if violates, return something to trigger an alert
  // on first turn(maybe send the req after the end of the swap round), place 1 card face up on the playZone from deck
  const playRound = async (req, res) => {

    // try {
      // get the game by the ID passed in the request
          const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
      let currentTurn = game.gameState.currentTurn
      if (currentTurn !== Number(req.cookies.playerID)) {
        res.send('wrongTurn')
        return
      }
      const prevPlayerCards = game.gameState.players

      const playerIDOfCurrent = req.cookies.playerID

      const playerPrevHand = prevPlayerCards[playerIDOfCurrent-1].playerHand
      let playerHand = req.body.playerHand
      let playerViewablePile = req.body.playerViewablePile
      const playerPrevPile = prevPlayerCards[playerIDOfCurrent-1].playerPile
      let playerPile = game.gameState.players[playerIDOfCurrent-1].playerPile

      const playZonePrev = game.gameState.playZone

      const cardPlayed = req.body.cardData
      let playZoneCurrent = playZonePrev

      const wasReversed = game.gameState.isReversed

      //special functionality if it is bot
      //bot will just play the next highest card, will skip 2, 5 and 10 and try to save it unless it cannot play anymore cards

      // in a new round, reversed is false by default
      let isReversed = false

      // 5 is reverse
      if (cardPlayed.rank === 5) {
         isReversed = true
      }
      // skip validation if zone was empty
      if (playZonePrev.length !== 0) {
       const prevLastCard = playZonePrev[playZonePrev.length - 1]
      // invalid card
      if (cardPlayed.rank !== 2 && prevLastCard.rank>cardPlayed.rank && !wasReversed && cardPlayed.rank !== 10 && cardPlayed.rank !== 5|| cardPlayed.rank !== 2 && prevLastCard.rank < cardPlayed.rank && wasReversed && cardPlayed.rank !== 10 && cardPlayed.rank !== 5) {
        res.send('invalid')
        return
      }
    }
    if (req.body.playedDuplicates > 0) {
      let playingGroup = []
      if(playerHand.length === 0) {
        playingGroup = playerViewablePile
      }
      else {
        playingGroup = playerHand
      }
          const positionsToSplice = []
            playingGroup.forEach((card, i) => {
              console.log(card)
              if (card.rank === cardPlayed.rank) {
                playZoneCurrent.push(card)
                positionsToSplice.push(i)
              }
            })
          let noOfTimesSpliced = 0
          positionsToSplice.forEach((position) => {
            playingGroup.splice((position-noOfTimesSpliced), 1)
            noOfTimesSpliced += 1
          })
      if(playerHand.length === 0) {
        playerViewablePile = playingGroup
      }
      else {
        playerHand = playingGroup
      }
        }
        else {
      if(playerHand.length === 0) {
        playerViewablePile.splice(req.body.cardPosition, 1)
      }
      else{
    playerHand.splice(req.body.cardPosition, 1)
      }
       playZoneCurrent.push(cardPlayed)
        }
      // burn the playZone if 10 is played
      if (cardPlayed.rank === 10) {
        playZoneCurrent = []
      }
      // card is valid
      // may need to add how many cards need to be spliced
      // may need to change cardPosition into array
      if(playerHand.length < 3 && game.gameState.cardDeck.length > 0) {
         // if there are still cards in the deck and player has less than 3 cards, he needs to draw. players will still have full pile
        while (playerHand.length < 3) {
          playerHand.push(game.gameState.cardDeck.pop())
        }
      }
        // if length of hand is 0, they can access their pile
     else if (playerHand.length === 0) {
        if (playerPile.length === 0 && playerViewablePile.length === 0) {
          game.gameState.players[playerIDOfCurrent-1].playerViewablePile = []
          if (game.gameState.currentTurn === game.noOfPlayers){
            currentTurn = 1
          }
          else {
            currentTurn += 1
          }
          await game.update({
            gameState: {
              cardDeck: [],
              players: game.gameState.players,
              currentTurn,
              playZone: game.gameState.playZone
            }
          })
          
          res.send('skip')
          return
        }
        // if there is at least 1 card in the pile, the player can use it
        else if (playerViewablePile.length === 0) {
          playerPile = []
          playerViewablePile = game.gameState.players[playerIDOfCurrent-1].playerPile
        }
        // player has at least one pile with 2 cards in it
        // won't draw but has to use the pile
      }
    prevPlayerCards[playerIDOfCurrent-1] = {
      playerHand,
      playerViewablePile,
      playerPile,
    }
      // change turn
            if (Number(playerIDOfCurrent) === Number(game.noOfPlayers)) {
        currentTurn = 1
      }
      else {
        currentTurn += 1
      }
            // turn is valid
      // update the game with the new info
        await game.update({
      gameState: {
        cardDeck: game.gameState.cardDeck,
          players: prevPlayerCards,
        // playerIDs,
        isReversed,
        currentTurn,
        playZone: playZoneCurrent
      }
        });
      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      res.send({
        id: game.id,
        currentPlayer: currentTurn,
        playerHand: game.gameState.players[playerIDOfCurrent-1].playerHand,
        playerViewablePile: game.gameState.players[playerIDOfCurrent-1].playerViewablePile,
        playZone: playZoneCurrent,
        cardDeckLength: game.gameState.cardDeck.length,
      });
    }
    // } catch (error) {
    //   res.status(500).send(error);
    // }
    const skipRound = async(req,res) => {
              const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
      let currentTurn = game.gameState.currentTurn
      if (currentTurn !== Number(req.cookies.playerID)) {
        res.send('wrongTurn')
        return
      }
      const playerData = game.gameState.players
      let counter = 0
      let idiotID = 0
      for (let i = 0; i < playerData.length; i+=1) {
        if (playerData[i].playerHand.length === 0 && playerData[i].playerVisiblePile.length === 0 && playerData[i].playerPile.length === 0) {
          counter +=1
        }
        else {
          idiotID = i + 1
        }
      }
      // idiot found!
      if (counter === (playerData.length - 1)) {
        res.send(idiotID)
      }
      else {
        // no idiot
        await game.update({
          gameState: {
          cardDeck: game.gameState.cardDeck,
          players: game.gameState.players,
          currentTurn: currentTurn += 1,
          playZone: game.gameState.playZone
          }
        })
        currentTurn +
        res.send(currentTurn)
      }
  };

  const refreshData = async (req,res) => {
                  const game = await db.Game.findOne({
      where: {
        id: req.cookies.gameID,
      }
    })
    const playerData = game.gameState.players[req.cookies.playerID - 1]
    res.send ({
      playerHandData: playerData.playerHand,
      playerViewablePileData: playerData.playerViewablePile,
      currentPlayer: game.gameState.currentTurn,
      playZone: game.gameState.playZone,
      cardDeckLength: game.gameState.cardDeck.length
    })
  }

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    playRound,
    create,
    getGames,
    joinGame,
    joinCurrentGame,
    takePile,
    swapRound,
    startMainGame,
    skipRound,
    refreshData,
    index,
  };
  }