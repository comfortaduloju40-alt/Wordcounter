/**
 * Main function — analyzes text and returns all stats
 */
function analyzeText(text) {
  const wordList = getWordList(text);

  return {
    words: countWords(text),
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    sentences: countSentences(text),
    longestWord: findLongestWord(wordList),
    avgWordLength: calcAvgWordLength(wordList),
  };
}

// Count total words by splitting on whitespace
function countWords(text) {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
}

// Count sentences by splitting on . ! or ?
function countSentences(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

// Get a clean list of lowercase alphabetic words only
function getWordList(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// Find the longest word in the list
function findLongestWord(wordList) {
  if (wordList.length === 0) return 'N/A';
  return wordList.reduce((longest, word) =>
    word.length > longest.length ? word : longest, '');
}

// Calculate average word length, rounded to 1 decimal
function calcAvgWordLength(wordList) {
  if (wordList.length === 0) return '0';
  const total = wordList.reduce((sum, word) => sum + word.length, 0);
  return (total / wordList.length).toFixed(1);
}

module.exports = { analyzeText };
