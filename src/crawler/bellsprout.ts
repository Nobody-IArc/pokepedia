// Bellsprout 사용 첫 테스트 용 코드

// 종족값 인터페이스
interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  total: number;
}

// 진화 정보 인터페이스 - 미진화 및 1단 진화 고려
interface EvolutionStage {
  name: string;
  image: string;
  types: string[];
  evolveMethod?: string;
}

// 분기에 여러 진화체가 존재할 경우 대비
type EvolutionData = EvolutionStage[] | EvolutionStage[][];

import axios from 'axios'; // http 요청을 보내기 위한 라이브러리
import * as cheerio from 'cheerio'; // html 파싱 및 요소 조작을 위한 라이브러리

const crawlBellsprout = async () => {
  const url = 'https://pokemondb.net/pokedex/bellsprout';

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 이름
    const name: string = $('main h1').text().trim();

    // 이미지 URL
    let imageUrl: string | undefined;

    $('source').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset && srcset.includes(name.toLowerCase())) {
        imageUrl = srcset;
        return false;
      }
    });

    // 타입
    const types: string[] = [];

    $('table tbody tr').each((_, el) => {
      const label = $(el).find('th').text().trim();
      if (label === 'Type') {
        $(el).find('td a.type-icon').each((_, tEl) => {
          types.push($(tEl).text().trim());
        })
      }
    });

    // 종족값
    const baseStats: BaseStats | null = getBaseStats($);
    const evolutions: EvolutionData | string | null = getEvolutionData($);

    console.log('이름: ', name);
    console.log('이미지 링크: ', imageUrl);
    console.log('타입: ', types);
    console.log('종족값: ', baseStats);
    console.log('진화 정보: ', evolutions);
  } catch (error) {
    console.log(error);
  }
}

// 테스트용 안쓰는 코드
// const getBaseStats = ($: cheerio.Root): BaseStats | null => {
//   const stats: Partial<BaseStats> = {};
//
//   const rows = $(
//     '#tab-basic-69 > div:nth-child(2) > div.grid-col.span-md-12.span-lg-8 > div.resp-scroll > table > tbody > tr'
//   );
//
//   rows.each((_, el) => {
//     const label = $(el).find('th').text().trim();
//     const value = Number($(el).find('td').text().trim());
//
//     switch (label) {
//       case 'HP':
//         stats.hp = Number(value);
//         break;
//       case 'Attack':
//         stats.attack = Number(value);
//         break;
//       case 'Defense':
//         stats.defense = Number(value);
//         break;
//       case 'Sp. Atk':
//         stats.spAtk = Number(value);
//         break;
//       case 'Sp. Def':
//         stats.spDef = Number(value);
//         break;
//       case 'Speed':
//         stats.speed = Number(value);
//         break;
//       case 'Total':
//         stats.total = Number(value);
//         break;
//     }
//   });
//   if (
//     stats.hp !== null &&
//     stats.attack !== null &&
//     stats.defense !== null &&
//     stats.spAtk !== null &&
//     stats.spDef !== null &&
//     stats.speed !== null &&
//     stats.total !== null
//   ) {
//     return stats as BaseStats;
//   }
//
//   return null;
// }

const getBaseStats = ($: cheerio.Root): BaseStats | null => {
  const values = $('.cell-num')
    .map((_, el) => Number($(el).text().trim()))
    .get();

  // 최소 7개 있어야 유효
  if (values.length >= 19) {
    return {
      hp: values[0],
      attack: values[3],
      defense: values[6],
      spAtk: values[9],
      spDef: values[12],
      speed: values[15],
      total: values[18],
    };
  } else {
    return null;
  }
}

// 진화 정보 받아오기
const getEvolutionData = ($: cheerio.Root): EvolutionData | string => {
  // 진화 정보가 담긴 html 태그 정보
  const evoSections = $('.infocard-list-evo');

  // 미진화체
  if (evoSections.length === 0) {
    return '진화가 없는 포켓몬입니다.';
  } else if (evoSections.length > 1) { // n단 진화에 여러 진화형이 있는 경우 ex) 이브이
    const result: EvolutionStage[][] = [];

    // 섹션 순회 및 정보 추출
    evoSections.each((_, section) => {
      const branch: EvolutionStage[] = [];

      $(section)
        .find('div.infocard')
        .each((_, el) => {
         const result = parseInfoCard($, el)
          branch.push(result);
        });

      if (branch.length > 0) result.push(branch);
    });

    return result;
  } else if (evoSections.length === 1) { // 일반적인 진화
    const stages: EvolutionStage[] = [];
    const elements = evoSections.children().toArray(); // 요소를 배열로

    // 배열 순회
    for (const el of elements) {
      // 진화체인 경우
      if ($(el).is('div.infocard')) {
        const result = parseInfoCard($, el);
        stages.push(result);
      }

      // 진화 방식인 경우
      if ($(el).is('span.infocard-arrow')) {
        const method = $(el).find('small').text().trim();
        if (stages.length > 0) {
          stages[stages.length - 1].evolveMethod = method;
        }
      }
    }

    return stages;
  }

  // 아무 것도 없는 경우
  return [];
};

// InfoCard - 진화 정보 파싱
const parseInfoCard = ($: cheerio.Root, el: cheerio.Element): EvolutionStage => {
  const name = $(el).find('a.ent-name').text().trim();
  const image = $(el).find('img.img-sprite').attr('src') || '';
  const types = $(el).find('a.itype').map((_, t) => $(t).text().trim()).get();

  return { name, image, types };
}


void crawlBellsprout();