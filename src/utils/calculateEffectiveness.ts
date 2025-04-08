// 타입 상성에 대한 결과값 계산

import { PokemonType } from '../pokemonTypes/pokemonTypes';
import { defendEffectiveness } from '../pokemonTypes/defendTypeEffectiveness';

// 타입 개수 확인 후 함수 호출하는 함수
export function calculateEffectiveness(types: PokemonType[]) {
  if (types.length === 1) {
    return calculateSingle(types[0]);
  } else if (types.length === 2) {
    return calculateDouble(types);
  } else {
    throw new Error('잘못된 타입 입력');
  }
}

// 단일 타입 시 결과 반환
function calculateSingle(type: PokemonType): Record<number, PokemonType[]> {
  const table = defendEffectiveness[type];
  if (!table) {
    throw new Error('계산 중 오류 발생');
  }
  return table;
}

// 2개의 타입일 경우 계산 및 결과 반환
function calculateDouble(types: PokemonType[]): Record<number, PokemonType[]> {

  // 빈 배열로 선언하기 위해 Partial<> 사용
  const raw: Partial<Record<PokemonType, number>> = {};
  const table1 = defendEffectiveness[types[0]];
  const table2 = defendEffectiveness[types[1]];

  const interTypes
    = Object.keys(table1).filter((key): key is PokemonType => key in table2);

  // 교집합 부분에 대한 계산
  for (const key of interTypes) {
    const a = table1[key];
    const b = table2[key];

    // a 와 b 에 대한 값 유효성 확인
    if (!a || !b) {
      throw new Error('계산 중 오류 발생');
    }
    // 반환할 배열에 값 추가
    raw[key] = a * b;
  }

  // 여집합 계산 1
  for (const key in table1) {
    if (!(key in interTypes)) {
      raw[key as PokemonType] = table1[key as PokemonType];
    }
  }

  // 여집합 계산 2
  for (const key in table2) {
    if (!(key in interTypes)) {
      raw[key as PokemonType] = table2[key as PokemonType];
    }
  }

  // 내림차순 정렬
  const tmp
    = Object.entries(raw).sort((a, b) => b[1] - a[1]);
  const result: Partial<Record<PokemonType, number>> = Object.fromEntries(tmp);

  console.log(result);
  return result;
}

/*
테스트용 코드
calculateEffectiveness(['Grass'] as PokemonType[]);
calculateEffectiveness(['Grass', 'Poison'] as PokemonType[]);
 */