import fs from 'fs';

enum FieldName {
  BYR = 'byr',
  IYR = 'iyr',
  EYR = 'eyr',
  HGT = 'hgt',
  HCL = 'hcl',
  ECL = 'ecl',
  PID = 'pid',
  CID = 'cid',
}

// Validator for Part 2

type Validator = {
  [K in FieldName]: (value: string) => boolean;
}

const validator: Validator = {
  [FieldName.BYR]: (value) => value.length === 4
    && !Number.isNaN(Number(value))
    && Number(value) >= 1920
    && Number(value) <= 2002,

  [FieldName.IYR]: (value) => value.length === 4
    && !Number.isNaN(Number(value))
    && Number(value) >= 2010
    && Number(value) <= 2020,

  [FieldName.EYR]: (value) => value.length === 4
    && !Number.isNaN(Number(value))
    && Number(value) >= 2020
    && Number(value) <= 2030,

  [FieldName.HGT]: (value) => {
    const metric = value.slice(-2);
    const number = Number(value.slice(0, -2));

    if (metric === 'cm') {
      return !Number.isNaN(number) && number >= 150 && number <= 193;
    }

    if (metric === 'in') {
      return !Number.isNaN(number) && number >= 59 && number <= 76;
    }

    return false;
  },

  [FieldName.HCL]: (value) => /^#[a-f0-9]{6}$/.test(value),

  [FieldName.ECL]: (value) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),

  [FieldName.PID]: (value) => value.length === 9 && !Number.isNaN(Number(value)),

  [FieldName.CID]: () => true,
};

// Validates passport fields for Part 1

const validateFieldNames = (fields: Record<string, string>): fields is Record<FieldName, string> => {
  const requiredFieldNames = [
    FieldName.BYR,
    FieldName.IYR,
    FieldName.EYR,
    FieldName.HGT,
    FieldName.HCL,
    FieldName.ECL,
    FieldName.PID,
  ];

  const fieldNames = Object.keys(fields);

  return requiredFieldNames.every((name) => fieldNames.includes(name));
};

// Validates passport fields for Part 2

const validateFieldValues = (fields: Record<FieldName, string>): boolean => {
  const fieldNames = Object.keys(fields) as FieldName[];

  return fieldNames.every((name) => validator[name](fields[name]));
};

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const passports = input.replace(/\n\n/g, '|')
    .replace(/\n/g, ' ')
    .trim()
    .split('|');

  const results = passports.reduce(({ validForPart1, validForPart2 }, passport) => {
    // Parse fields
    const passportFields: Record<string, string> = {};

    passport.split(' ').forEach((field) => {
      const [fieldName, fieldValue] = field.split(':');
      passportFields[fieldName] = fieldValue;
    });

    // Validate fields
    if (validateFieldNames(passportFields)) {
      if (validateFieldValues(passportFields)) {
        return { validForPart1: validForPart1 + 1, validForPart2: validForPart2 + 1 };
      }

      return { validForPart1: validForPart1 + 1, validForPart2 };
    }
    return { validForPart1, validForPart2 };
  }, { validForPart1: 0, validForPart2: 0 });

  console.info(`Valid for Part 1: ${results.validForPart1}`);
  console.info(`Valid for Part 2: ${results.validForPart2}`);
} catch (err) {
  console.error(err);
}
