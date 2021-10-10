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

export default checkForDuplicates