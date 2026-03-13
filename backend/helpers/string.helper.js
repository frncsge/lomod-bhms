export const capitalizeWords = (string) => {
  return string
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
