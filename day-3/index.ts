import fs from 'fs';

const countTrees = (area: string[][], stepsRight: number, stepsDown: number): number => {
  const H = area.length;
  const W = area[0].length;

  let x = 0; let y = 0;
  let trees = 0;

  do {
    if (x + stepsRight >= W) {
      x -= W;
    }

    x += stepsRight;
    y += stepsDown;

    if (area[y][x] === '#') {
      trees += 1;
    }
  } while (y + stepsDown < H);

  return trees;
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const area = input
    .split('\n')
    .filter((row) => row)
    .map((row) => row.split(''));

  console.info(`Part 1 trees: ${countTrees(area, 3, 1)}`);
  console.info(`Part 2 trees: ${
    countTrees(area, 1, 1)
    * countTrees(area, 3, 1)
    * countTrees(area, 5, 1)
    * countTrees(area, 7, 1)
    * countTrees(area, 1, 2)
  }`);
} catch (err) {
  console.error(err);
}
