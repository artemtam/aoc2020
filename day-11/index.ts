import fs from 'fs';

enum AreaItem {
  FLOOR = '.',
  EMPTY_SEAT = 'L',
  OCCUPIED_SEAT = '#',
}

type RawArea = AreaItem[][];

class Area {
  private readonly area: RawArea;

  public readonly W: number;

  public readonly H: number;

  constructor(sourceRawArea: RawArea) {
    // Deep copy
    this.area = JSON.parse(JSON.stringify(sourceRawArea));

    this.W = this.area[0].length;
    this.H = this.area.length;
  }

  public getItem(x: number, y: number): AreaItem {
    return this.area[y][x];
  }

  public setItem(x: number, y: number, value: AreaItem): void {
    this.area[y][x] = value;
  }

  public clone(): Area {
    return new Area(this.area);
  }

  public isEqual(area: Area): boolean {
    return JSON.stringify(area) === JSON.stringify(this);
  }

  public toString(): string {
    return `${this.area.map((row) => row.join('')).join('\n')}\n`;
  }

  public countOccupiedSeats(): number {
    let occupiedSeats = 0;

    for (let y = 0; y < this.H; y += 1) {
      for (let x = 0; x < this.W; x += 1) {
        if (this.getItem(x, y) === AreaItem.OCCUPIED_SEAT) {
          occupiedSeats += 1;
        }
      }
    }

    return occupiedSeats;
  }

  /**
   * Counts adjacent occupied seats (Part 1)
   */
  public countAdjacentOccupiedSeats(seatX: number, seatY: number): number {
    return this.countVisibleOccupiedSeats(seatX, seatY, 1);
  }

  /**
   * Counts visible occupied seats (Part 2)
   */
  public countVisibleOccupiedSeats(seatX: number, seatY: number, depth: number = Math.max(this.W, this.H)): number {
    return [
      this.hasDirectionOccupiedSeat(seatX, seatY, -1, -1, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, -1, 0, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, -1, 1, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, 0, -1, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, 0, 1, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, 1, -1, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, 1, 0, depth),
      this.hasDirectionOccupiedSeat(seatX, seatY, 1, 1, depth),
    ].reduce((occupied, hasDirection) => (hasDirection ? occupied + 1 : occupied), 0);
  }

  /**
   * Checks if an occupied seat is visible for the specified direction
   */
  private hasDirectionOccupiedSeat(seatX: number, seatY: number, dx: number, dy: number, depth: number = Math.max(this.W, this.H)) {
    for (let i = 1; i <= depth; i += 1) {
      const y = seatY + i * dy;
      const x = seatX + i * dx;

      if (y < 0 || x < 0 || y >= this.H || x >= this.W) {
        return false;
      }

      if (this.getItem(x, y) === AreaItem.EMPTY_SEAT) {
        return false;
      }

      if (this.getItem(x, y) === AreaItem.OCCUPIED_SEAT) {
        return true;
      }
    }

    return false;
  }
}

const calculateAreaPart1Round = (area: Area): Area => {
  const areaAfterRound = area.clone();

  for (let y = 0; y < area.H; y += 1) {
    for (let x = 0; x < area.W; x += 1) {
      const occupiedSeats = area.countAdjacentOccupiedSeats(x, y);

      if (area.getItem(x, y) === AreaItem.EMPTY_SEAT && occupiedSeats === 0) {
        areaAfterRound.setItem(x, y, AreaItem.OCCUPIED_SEAT);
      } else if (area.getItem(x, y) === AreaItem.OCCUPIED_SEAT && occupiedSeats >= 4) {
        areaAfterRound.setItem(x, y, AreaItem.EMPTY_SEAT);
      }
    }
  }

  return areaAfterRound;
};

const calculateAreaPart2Round = (area: Area): Area => {
  const areaAfterRound = area.clone();

  for (let y = 0; y < area.H; y += 1) {
    for (let x = 0; x < area.W; x += 1) {
      const occupiedSeats = area.countVisibleOccupiedSeats(x, y);

      if (area.getItem(x, y) === AreaItem.EMPTY_SEAT && occupiedSeats === 0) {
        areaAfterRound.setItem(x, y, AreaItem.OCCUPIED_SEAT);
      } else if (area.getItem(x, y) === AreaItem.OCCUPIED_SEAT && occupiedSeats >= 5) {
        areaAfterRound.setItem(x, y, AreaItem.EMPTY_SEAT);
      }
    }
  }

  return areaAfterRound;
};

/**
 * Applies calculateRoundMethod until area is stabilized
 * @returns - the stabilized area
 */
const calculateRounds = (area: Area, calculateRoundMethod: (area: Area) => Area): Area => {
  let prevArea = area.clone();

  for (;;) {
    const newArea = calculateRoundMethod(prevArea);

    if (prevArea.isEqual(newArea)) {
      return newArea;
    }

    prevArea = newArea;
  }
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const inputRawArea = input.split('\n').filter((row) => row)
    .map((row) => row.trim().split('')) as AreaItem[][];

  const areaAfterPart1Rounds = calculateRounds(new Area(inputRawArea), calculateAreaPart1Round);
  const areaAfterPart2Rounds = calculateRounds(new Area(inputRawArea), calculateAreaPart2Round);

  console.info(`Occupied seats for Part 1: ${areaAfterPart1Rounds.countOccupiedSeats()}`);
  console.info(`Occupied seats for Part 2: ${areaAfterPart2Rounds.countOccupiedSeats()}`);
} catch (err) {
  console.error(err);
}
