import fs from 'fs';

enum Action {
  MOVE_NORTH = 'N',
  MOVE_SOUTH = 'S',
  MOVE_EAST = 'E',
  MOVE_WEST = 'W',
  TURN_LEFT = 'L',
  TURN_RIGHT = 'R',
  MOVE_FORWARD = 'F'
}

abstract class Navigator {
  protected x: number;

  protected y: number;

  protected angle: number;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0; // east == 0 deg
  }

  protected abstract doNavigateAction(action: Action, value: number): void;

  public navigate(route: [Action, number][]): void {
    route.forEach(([action, value]) => {
      this.doNavigateAction(action, value);
    });
  }

  public getDistanceFromZero(): number {
    return Math.round(Math.abs(this.x) + Math.abs(this.y));
  }
}

// Navigator for Part 1

class BasicNavigator extends Navigator {
  private move(distance: number, angle: number): void {
    this.x = distance * Math.cos(angle) + this.x;
    this.y = distance * Math.sin(angle) + this.y;
  }

  private turn(angle: number): void {
    this.angle += angle;
  }

  protected doNavigateAction(action: Action, value: number): void {
    switch (action) {
      case Action.MOVE_NORTH:
        this.move(value, Math.PI / 2);
        break;

      case Action.MOVE_SOUTH:
        this.move(value, -Math.PI / 2);
        break;

      case Action.MOVE_EAST:
        this.move(value, 0);
        break;

      case Action.MOVE_WEST:
        this.move(value, Math.PI);
        break;

      case Action.TURN_LEFT:
        this.turn((value * Math.PI) / 180);
        break;

      case Action.TURN_RIGHT:
        this.turn(-(value * Math.PI) / 180);
        break;

      case Action.MOVE_FORWARD:
        this.move(value, this.angle);
        break;

      default:
        break;
    }
  }
}

// Navigator for Part 2

class WaypointNavigator extends Navigator {
  private wpX: number;

  private wpY: number;

  constructor(wpX: number, wpY: number) {
    super();

    this.wpX = wpX;
    this.wpY = wpY;
  }

  private moveWP(distance: number, angle: number): void {
    this.wpX = distance * Math.cos(angle) + this.wpX;
    this.wpY = distance * Math.sin(angle) + this.wpY;
  }

  private rotateWP(angle: number): void {
    const dx = this.wpX - this.x;
    const dy = this.wpY - this.y;

    const x = Math.cos(angle) * dx - Math.sin(angle) * dy;
    const y = Math.sin(angle) * dx + Math.cos(angle) * dy;

    this.wpX = x + this.x;
    this.wpY = y + this.y;
  }

  private moveToWP(times: number): void {
    const dx = this.wpX - this.x;
    const dy = this.wpY - this.y;

    this.x += dx * times;
    this.y += dy * times;

    this.wpX += dx * times;
    this.wpY += dy * times;
  }

  protected doNavigateAction(action: Action, value: number): void {
    switch (action) {
      case Action.MOVE_NORTH:
        this.moveWP(value, Math.PI / 2);
        break;

      case Action.MOVE_SOUTH:
        this.moveWP(value, -Math.PI / 2);
        break;

      case Action.MOVE_EAST:
        this.moveWP(value, 0);
        break;

      case Action.MOVE_WEST:
        this.moveWP(value, Math.PI);
        break;

      case Action.TURN_LEFT:
        this.rotateWP((value * Math.PI) / 180);
        break;

      case Action.TURN_RIGHT:
        this.rotateWP(-(value * Math.PI) / 180);
        break;

      case Action.MOVE_FORWARD:
        this.moveToWP(value);
        break;

      default:
        break;
    }
  }
}

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const route = input.trim().split('\n')
    .map((value): [Action, number] => [
      value.slice(0, 1) as Action,
      Number(value.slice(1)),
    ]);

  const navigator = new BasicNavigator();
  navigator.navigate(route);
  console.info(`Distance for Part 1: ${navigator.getDistanceFromZero()}`);

  const wpNavigator = new WaypointNavigator(10, 1);
  wpNavigator.navigate(route);
  console.info(`Distance for Part 2: ${wpNavigator.getDistanceFromZero()}`);
} catch (err) {
  console.error(err);
}
