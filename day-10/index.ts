import fs from 'fs';

class ArrangementsCalculator {
  private cache: Record<string, number> = {};

  public calculateArrangements(adapters: number[]): number {
    let arrangements = 0;

    for (let i = 0; i < adapters.length - 3; i += 1) {
      // Possible jolt differences between adapters that could be replaced are 2 and 3
      arrangements += [2, 3].reduce((arrs, diff) => {
        if (adapters[i + diff] - adapters[i] === diff) { // If adapters are replaceable
          const restAdapters = adapters.slice(i + diff); // Calculate only for the rest of chain
          const cacheKey = restAdapters.join('-');

          if (this.cache[cacheKey] === undefined) {
            this.cache[cacheKey] = this.calculateArrangements(restAdapters);
          }

          return arrs + this.cache[cacheKey] + 1;
        }

        return arrs;
      }, 0);
    }

    return arrangements;
  }
}

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const adapters = input.split('\n')
    .map((value) => value.trim())
    .filter((value) => value)
    .map(Number);

  const adaptersSorted = adapters.sort((a, b) => a - b);

  adaptersSorted.unshift(0); // the charging outlet
  adaptersSorted.push(adaptersSorted[adaptersSorted.length - 1] + 3); // the device's built-in adapter

  let joltDifferences1 = 0;
  let joltDifferences3 = 0;

  for (let i = 0; i < adaptersSorted.length - 1; i += 1) {
    if (adaptersSorted[i + 1] - adaptersSorted[i] === 1) {
      joltDifferences1 += 1;
    } else if (adaptersSorted[i + 1] - adaptersSorted[i] === 3) {
      joltDifferences3 += 1;
    }
  }

  const product = joltDifferences1 * joltDifferences3;
  const arrangements = new ArrangementsCalculator().calculateArrangements(adaptersSorted) + 1;

  console.info(`Product for Part 1: ${product}`);
  console.info(`Arrangements for Part 2: ${arrangements}`);
} catch (err) {
  console.error(err);
}
