import fs from 'fs';

/**
 * Calculates N-th spoken number
 */
const getNthSpokenNumber = (numbers: number[], N: number): number => {
  // Map where we store when the number was last spoken
  const lastSpoken = numbers.reduce<Record<number, number>>((acc, number, index) => {
    acc[number] = index + 1;
    return acc;
  }, {});

  let prevNumber = numbers[numbers.length - 1];

  for (let i = numbers.length; i < N; i += 1) {
    const prevNumberLastSpoken = lastSpoken[prevNumber];
    const toSpeakNumber = prevNumberLastSpoken !== undefined ? i - prevNumberLastSpoken : 0;

    lastSpoken[prevNumber] = i;
    prevNumber = toSpeakNumber;
  }

  return prevNumber;
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const numbers = input.split(',').map(Number);

  console.info(`Part 1 (2020th): ${getNthSpokenNumber(numbers, 2020)}`);
  console.info(`Part 2 (30000000th): ${getNthSpokenNumber(numbers, 30000000)}`);
} catch (err) {
  console.error(err);
}
