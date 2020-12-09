import fs from 'fs';

// Copied from the Day 1
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

const findContiguousSet = (arr: number[], targetTotal: number): number[] | null => {
  let leftIndex = 0;
  let rightIndex = 1;

  let sum = arr[leftIndex] + arr[rightIndex];

  while (rightIndex < arr.length) {
    if (sum === targetTotal) {
      return arr.slice(leftIndex, rightIndex + 1);
    }

    if (sum > targetTotal) {
      sum -= arr[leftIndex];
      leftIndex += 1;
    }

    if (sum < targetTotal) {
      rightIndex += 1;
      sum += arr[rightIndex];
    }
  }

  return null;
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
  const preambleLength = 25;

  const arr = input.split('\n')
    .filter((value) => value)
    .map(Number);

  // Part 1

  let number = null;

  for (let i = 0; i < arr.length - preambleLength; i += 1) {
    const preamble = arr.slice(i, i + preambleLength);

    if (findPair(preamble, arr[i + preambleLength]) === null) {
      number = arr[i + preambleLength];
      break;
    }
  }

  if (number === null) {
    console.error('Number not found');
    process.exit(1);
  }

  console.info(`Number: ${number}`);

  // Part 2

  const contiguousSet = findContiguousSet(arr, number);

  if (contiguousSet === null) {
    console.error('Contiguous set not found');
    process.exit(1);
  }

  const sortedContiguousSet = contiguousSet.sort((a, b) => a - b);
  const sum = sortedContiguousSet[0] + sortedContiguousSet[sortedContiguousSet.length - 1];

  console.info(`Sum: ${sum}`);
} catch (err) {
  console.error(err);
}
