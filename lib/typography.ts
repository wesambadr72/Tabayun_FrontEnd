const arabicWord = /[\u0621-\u064A]{4,}/g;

export function kashidaTitle(value: string) {
  return value.replace(arabicWord, (word) => {
    if (word.includes("ـ")) return word;
    const letters = Array.from(word);
    const stretch = letters.length >= 7 ? "ـــ" : "ــ";
    const insertAt =
      /^ال[إأآ]/.test(word) && letters.length > 5
        ? 4
        : word.startsWith("ال") && letters.length > 4
        ? 3
        : 2;
    return `${letters.slice(0, insertAt).join("")}${stretch}${letters.slice(insertAt).join("")}`;
  });
}
