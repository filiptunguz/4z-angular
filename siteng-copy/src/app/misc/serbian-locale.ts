export enum PluralCase {
  ONE = 'one',
  FEW = 'few',
  MANY = 'many'
}
/**
 * Hardcode the plural case detecting logic for Serbian
 * so it can be used as a static method
 * (Angular I18NPlural has a dependency on I18N)
 *
 * @param number Has to be integer
 */
export function numberToPluralCase(number: number): PluralCase {
  const numberAsString = number + '';
  const lastDigit = numberAsString.substr(-1);
  const last2Digits = numberAsString.substr(-2);

  if (lastDigit === '1'
    && last2Digits !== '11') {
    return PluralCase.ONE;
  }
  if (['2', '3', '4'].includes(lastDigit)
    && !['12', '13', '14'].includes(last2Digits)) {
    return PluralCase.FEW;
  }

  return PluralCase.MANY;
}

export function numberToPluralWord(number: number, wordOne: string, wordFew: string, wordMany: string): string {
  switch (numberToPluralCase(number)) {
    case PluralCase.ONE:
      return wordOne;
    case PluralCase.FEW:
      return wordFew;
    case PluralCase.MANY:
      return wordMany;
  }
}

export function numberWithPluralSuffix(number: number, suffixOne: string, suffixFew: string, suffixMany: string): string {
  switch (numberToPluralCase(number)) {
    case PluralCase.ONE:
      return `${number} ${suffixOne}`;
    case PluralCase.FEW:
      return `${number} ${suffixFew}`;
    case PluralCase.MANY:
      return `${number} ${suffixMany}`;
  }
}
