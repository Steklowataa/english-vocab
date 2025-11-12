const getLevelName = (totalWords: number): string => {
    if (totalWords <= 50) return 'Beginner';
    if (totalWords <= 150) return 'Intermediate';
    if (totalWords <= 300) return 'Advanced';
    if (totalWords <= 500) return 'Expert';
    return 'Master';
}

export default getLevelName;