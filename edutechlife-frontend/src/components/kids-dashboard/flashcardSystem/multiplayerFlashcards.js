export function updateMultiplayerScore(known, currentPlayer, score1, score2) {
  const s1 = currentPlayer === 1 ? score1 + (known ? 1 : 0) : score1;
  const s2 = currentPlayer === 2 ? score2 + (known ? 1 : 0) : score2;
  const nextPlayer = currentPlayer === 1 ? 2 : 1;
  return { score1: s1, score2: s2, nextPlayer };
}

export function getMultiplayerWinner(score1, score2) {
  if (score1 > score2) return 1;
  if (score2 > score1) return 2;
  return 0;
}
