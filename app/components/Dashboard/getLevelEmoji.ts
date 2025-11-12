const getLevelEmoji = (totalWords: number): string => {
    if (totalWords <= 50) return '🥉';
    if (totalWords <= 150) return '🥈';
    if (totalWords <= 300) return '🥇';
    if (totalWords <= 500) return '💎';
    return '👑';
  };

export default getLevelEmoji;