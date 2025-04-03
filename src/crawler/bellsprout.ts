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

    console.log(name);
    console.log(imageUrl);
    console.log(types);
    console.log(baseStats);
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

void crawlBellsprout();