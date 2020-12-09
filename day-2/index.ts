import fs from 'fs';

try {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

  const parsedInput = input.trim().split('\n');

  let countValidPart1 = 0;
  let countValidPart2 = 0;

  parsedInput.forEach((policyPassword) => {
    const [policy, password] = policyPassword.split(':').map((value) => value.trim());

    const [policyRange, policyLetter] = policy.split(' ');

    // Count valid passwords for Part 1

    const [policyLetterMin, policyLetterMax] = policyRange.split('-').map(Number);

    const policyLetterRegexp = new RegExp(`${policyLetter}`, 'g');
    const letterOccurrence = password.match(policyLetterRegexp)?.length || 0;

    if (letterOccurrence >= policyLetterMin && letterOccurrence <= policyLetterMax) {
      countValidPart1 += 1;
    }

    // Count valid passwords for Part 2

    const [policyLetterFirst, policyLetterLast] = policyRange.split('-').map(Number);

    const a = password[policyLetterFirst - 1];
    const b = password[policyLetterLast - 1];

    if ((a === policyLetter && b !== policyLetter) || (a !== policyLetter && b === policyLetter)) {
      countValidPart2 += 1;
    }
  });

  console.info(`Part 1 valid passwords: ${countValidPart1}`);
  console.info(`Part 2 valid passwords: ${countValidPart2}`);
} catch (err) {
  console.error(err);
}
