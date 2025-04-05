"use strict";
// Bellsprout 사용 첫 테스트 용 코드
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios")); // http 요청을 보내기 위한 라이브러리
const cheerio = __importStar(require("cheerio")); // html 파싱 및 요소 조작을 위한 라이브러리
const crawlBellsprout = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://pokemondb.net/pokedex/bellsprout';
    try {
        const { data } = yield axios_1.default.get(url);
        const $ = cheerio.load(data);
        // 이름
        const name = $('main h1').text().trim();
        // 한글명
        const koreanName = $('#main > div:nth-child(27) > div:nth-child(1) > div > table > tbody > tr:nth-child(7) > td')
            .text().trim().split(' ')[0];
        // 종족
        const species = $('#main > div:nth-child(27) > div:nth-child(2) > div > table > tbody > tr:nth-child(7) > td')
            .text().trim();
        // 이미지 URL
        let imageUrl;
        $('source').each((_, el) => {
            const srcset = $(el).attr('srcset');
            if (srcset && srcset.includes(name.toLowerCase())) {
                imageUrl = srcset;
                return false;
            }
        });
        // 타입
        const types = [];
        $('table tbody tr').each((_, el) => {
            const label = $(el).find('th').text().trim();
            if (label === 'Type') {
                $(el).find('td a.type-icon').each((_, tEl) => {
                    types.push($(tEl).text().trim());
                });
            }
        });
        // 종족값
        const baseStats = getBaseStats($);
        const evolutions = getEvolutionData($);
        console.log('이름: ', name);
        console.log('한글명: ', koreanName);
        console.log('종족: ', species);
        console.log('이미지 링크: ', imageUrl);
        console.log('타입: ', types);
        console.log('종족값: ', baseStats);
        console.log('진화 정보: ', evolutions);
        const jsonData = {
            name: name,
            korName: koreanName,
            species: species,
            imageUrl: imageUrl,
            types: types,
            baseStats: baseStats,
            evolutions: evolutions,
        };
        fs_1.default.writeFileSync(`./data/${name.toLowerCase()}.json`, JSON.stringify(jsonData, null, 2));
    }
    catch (error) {
        console.log(error);
    }
});
const getBaseStats = ($) => {
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
    }
    else {
        return null;
    }
};
// 진화 정보 받아오기
const getEvolutionData = ($) => {
    // 진화 정보가 담긴 html 태그 정보
    const evoSections = $('.infocard-list-evo');
    // 미진화체
    if (evoSections.length === 0) {
        return '진화가 없는 포켓몬입니다.';
    }
    else if (evoSections.length > 1) { // n단 진화에 여러 진화형이 있는 경우 ex) 이브이
        const result = [];
        // 섹션 순회 및 정보 추출
        evoSections.each((_, section) => {
            const branch = [];
            $(section)
                .find('div.infocard')
                .each((_, el) => {
                const result = parseInfoCard($, el);
                branch.push(result);
            });
            if (branch.length > 0)
                result.push(branch);
        });
        return result;
    }
    else if (evoSections.length === 1) { // 일반적인 진화
        const stages = [];
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
const parseInfoCard = ($, el) => {
    const name = $(el).find('a.ent-name').text().trim();
    const image = $(el).find('img.img-sprite').attr('src') || '';
    const types = $(el).find('a.itype').map((_, t) => $(t).text().trim()).get();
    return { name, image, types };
};
void crawlBellsprout();
