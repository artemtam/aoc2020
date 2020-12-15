import fs from 'fs';

enum OP {
  SET_MASK,
  SET_MEM
}

interface OpSetMask {
  type: OP.SET_MASK,
  value: string;
}

interface OpSetMem {
  type: OP.SET_MEM,
  address: number;
  value: number;
}

type Operation = OpSetMask | OpSetMem;
type Program = Operation[];
type Memory = Record<number, number>;

interface IParser {
  parse: (input: string) => void;
  getProgram: () => Program;
}

interface IInterpreter {
  loadProgram: (program: Program) => void;
  runProgram: () => void;
  getMemorySnapshot: () => Memory;
}

class Parser implements IParser {
  private program: Program;

  constructor() {
    this.program = [];
  }

  public getProgram(): Program {
    return this.program;
  }

  public parse(input: string): void {
    const lines = input.trim().split('\n');

    this.program = lines.map<Operation>((line, index) => {
      if (line.slice(0, 4) === 'mask') {
        const mask = line.split(' = ')[1];

        return { type: OP.SET_MASK, value: mask };
      }

      if (line.slice(0, 3) === 'mem') {
        const address = Number(line.split(' = ')[0].slice(4, -1));
        const value = Number(line.split(' = ')[1]);

        if (Number.isNaN(address)) {
          throw new Error(`Can not parse mem address at line #${index}: ${line}`);
        }

        if (Number.isNaN(address)) {
          throw new Error(`Can not parse mem value at line #${index}: ${line}`);
        }

        return { type: OP.SET_MEM, address, value };
      }

      throw new Error(`Can not parse line #${index}: ${line}`);
    });
  }
}

class Interpreter1 implements IInterpreter {
  private program: Program;

  private readonly memory: Memory;

  constructor() {
    this.program = [];
    this.memory = {};
  }

  private static maskNumber(number: number, mask: string): number {
    const binary = number.toString(2).padStart(36, '0');

    const maskedBinary = binary.split('')
      .map((char, i) => (mask[i] === 'X' ? char : mask[i]))
      .join('');

    return Number.parseInt(maskedBinary, 2);
  }

  public loadProgram(program: Program): void {
    this.program = program;
  }

  public runProgram(): void {
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    this.program.forEach((operation) => {
      if (operation.type === OP.SET_MASK) {
        mask = operation.value;
      } else if (operation.type === OP.SET_MEM) {
        this.memory[operation.address] = Interpreter1.maskNumber(operation.value, mask);
      }
    });
  }

  public getMemorySnapshot(): Memory {
    return this.memory;
  }
}

class Interpreter2 implements IInterpreter {
  private program: Program;

  private readonly memory: Memory;

  constructor() {
    this.program = [];
    this.memory = {};
  }

  public static maskAddress(address: number, mask: string): number[] {
    const binary = address.toString(2).padStart(36, '0');

    const maskedBinary = binary.split('')
      .map((char, i) => {
        const maskBit = mask[i];
        if (maskBit === '0') return char;
        if (maskBit === '1') return '1';
        if (maskBit === 'X') return 'X';

        throw new Error(`Can not apply mask: ${mask}`);
      }).join('');

    const generatePossibleAddresses = (addr: string): number[] => {
      const parsedAddr = addr.split('');

      for (let i = 0; i < parsedAddr.length; i += 1) {
        if (parsedAddr[i] === 'X') {
          const binary1 = `${addr.slice(0, i)}${0}${addr.slice(i + 1)}`;
          const binary2 = `${addr.slice(0, i)}${1}${addr.slice(i + 1)}`;

          return [...generatePossibleAddresses(binary1), ...generatePossibleAddresses(binary2)];
        }
      }

      return [Number.parseInt(addr, 2)];
    };

    return generatePossibleAddresses(maskedBinary);
  }

  public loadProgram(program: Program): void {
    this.program = program;
  }

  public runProgram(): void {
    let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    this.program.forEach((operation) => {
      if (operation.type === OP.SET_MASK) {
        mask = operation.value;
      } else if (operation.type === OP.SET_MEM) {
        const addresses = Interpreter2.maskAddress(operation.address, mask);

        addresses.forEach((address) => {
          this.memory[address] = operation.value;
        });
      }
    });
  }

  public getMemorySnapshot(): Memory {
    return this.memory;
  }
}

class Emulator {
  private readonly parser: IParser;

  private readonly interpreter: IInterpreter;

  // It is like DI :)
  constructor(parser: IParser, interpreter: IInterpreter) {
    this.parser = parser;
    this.interpreter = interpreter;
  }

  public emulate(input: string): void {
    this.parser.parse(input);
    const program = this.parser.getProgram();

    this.interpreter.loadProgram(program);
    this.interpreter.runProgram();
  }

  public calculateSumOfMemoryValues(): number {
    const snapshot = this.interpreter.getMemorySnapshot();

    return Object.values(snapshot).filter((Number.isFinite))
      .reduce<number>((acc, value) => acc + value, 0);
  }
}

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const emulator1 = new Emulator(new Parser(), new Interpreter1());
  emulator1.emulate(input);

  const emulator2 = new Emulator(new Parser(), new Interpreter2());
  emulator2.emulate(input);

  console.info(`Sum for Part 1: ${emulator1.calculateSumOfMemoryValues()}`);
  console.info(`Sum for Part 2: ${emulator2.calculateSumOfMemoryValues()}`);
} catch (err) {
  console.error(err);
}
