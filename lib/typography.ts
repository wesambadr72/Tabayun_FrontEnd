const arabicWord = /[\u0600-\u06FF]{4,}/g;
const nonJoining = /[ادذرزوؤأإآة]/;

export function kashidaTitle(value: string) {
  if (!value) return value;
  
  return value.replace(arabicWord, (word) => {
    if (word.includes("ـ")) return word;
    const letters = Array.from(word);
    const stretch = letters.length >= 7 ? "ـــ" : "ــ";
    
    // Determine insertion point (avoiding start of word and non-joining letters)
    let insertAt = 2;
    if (/^ال/.test(word)) {
      insertAt = word.length > 5 ? 3 : 2;
    }

    // Ensure we don't insert after a non-joining letter
    while (insertAt < letters.length - 1 && nonJoining.test(letters[insertAt - 1])) {
      insertAt++;
    }

    // If we're at the end, don't stretch
    if (insertAt >= letters.length - 1) return word;

    return `${letters.slice(0, insertAt).join("")}${stretch}${letters.slice(insertAt).join("")}`;
  });
}
