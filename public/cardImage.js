export default function pictureCardAllocation(cardInfo) {
  if (cardInfo.rank === 11) {
    if (cardInfo.suit === 'hearts') {
      cardInfo.cardImage = 'PNG/JH.png';
    }
    else if (cardInfo.suit === 'diamonds') {
      cardInfo.cardImage = 'PNG/JD.png';
    }
    else if (cardInfo.suit === 'clubs') {
      cardInfo.cardImage = 'PNG/JC.png';
    }
    else if (cardInfo.suit === 'spades') {
      cardInfo.cardImage = 'PNG/JS.png';
    }
  }
  else if (cardInfo.rank === 12) {
    if (cardInfo.suit === 'hearts') {
      cardInfo.cardImage = 'PNG/QH.png';
    }
    else if (cardInfo.suit === 'diamonds') {
      cardInfo.cardImage = 'PNG/QD.png';
    }
    else if (cardInfo.suit === 'clubs') {
      cardInfo.cardImage = 'PNG/QC.png';
    }
    else if (cardInfo.suit === 'spades') {
      cardInfo.cardImage = 'PNG/QS.png';
    }
  }
  else if (cardInfo.rank === 13) {
    if (cardInfo.suit === 'hearts') {
      cardInfo.cardImage = 'PNG/KH.png';
    }
    else if (cardInfo.suit === 'diamonds') {
      cardInfo.cardImage = 'PNG/KD.png';
    }
    else if (cardInfo.suit === 'clubs') {
      cardInfo.cardImage = 'PNG/KC.png';
    }
    else if (cardInfo.suit === 'spades') {
      cardInfo.cardImage = 'PNG/KS.png';
    }
  }
  else if (cardInfo.rank === 14) {
    if (cardInfo.suit === 'hearts') {
      cardInfo.cardImage = 'PNG/AH.png';
    }
    else if (cardInfo.suit === 'diamonds') {
      cardInfo.cardImage = 'PNG/AD.png';
    }
    else if (cardInfo.suit === 'clubs') {
      cardInfo.cardImage = 'PNG/AC.png';
    }
    else if (cardInfo.suit === 'spades') {
      cardInfo.cardImage = 'PNG/AS.png';
    }
  }
  else if (cardInfo.suit === 'hearts') {
    cardInfo.cardImage = `PNG/${cardInfo.rank + 1}H.png`;
  }
  else if (cardInfo.suit === 'diamonds') {
    cardInfo.cardImage = `PNG/${cardInfo.rank + 1}D.png`;
  }
  else if (cardInfo.suit === 'clubs') {
    cardInfo.cardImage = `PNG/${cardInfo.rank + 1}C.png`;
  }
  else if (cardInfo.suit === 'spades') {
    cardInfo.cardImage = `PNG/${cardInfo.rank + 1}S.png`;
  }
}
