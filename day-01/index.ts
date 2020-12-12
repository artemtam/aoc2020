import fs from 'fs';

const findPair = (arr: number[], targetTotal: number): number | null => {
  const t: Record<number, number> = {};

  for (let i = 0; i < arr.length; i += 1) {
    t[targetTotal - arr[i]] = arr[i];

    if (t[arr[i]] !== undefined) {
      return arr[i] * t[arr[i]];
    }
  }

  return null;
};

const findTriplet = (arr: number[], targetTotal: number): number | null => {
  const t: Record<number, number> = {};

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      t[targetTotal - arr[i] - arr[j]] = arr[i] * arr[j];

      if (t[arr[i]] !== undefined) {
        return arr[i] * t[arr[i]];
      }
    }
  }

  return null;
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const arrayOfNumbers: number[] = input
    .trim()
    .split('\n')
    .map(Number);

  console.info(`Pair: ${findPair(arrayOfNumbers, 2020)}`);
  console.info(`Triplet: ${findTriplet(arrayOfNumbers, 2020)}`);
} catch (err) {
  console.error(err);
}
