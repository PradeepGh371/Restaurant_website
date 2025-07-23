// Convert English numbers to Nepali numerals
export function toNepaliNumber(num) {
  return String(num).replace(/[0-9]/g, d =>
    '०१२३४५६७८९'[d]
  );
}

export function formatNepaliCurrency(num) {
  return `NPR ${num}`;
} 