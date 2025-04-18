import { PokemonType } from './pokemonTypes';

export const defendEffectiveness:  {
  [defending in PokemonType]: {
    [attacking in PokemonType]?: number;
  };
} = {
  'Normal': {
    Fighting: 2,
    Ghost: 0,
  },
  'Fire': {
    Water: 2,
    Ground: 2,
    Rock: 2,
    Fire: 0.5,
    Grass:0.5,
    Ice: 0.5,
    Bug: 0.5,
    Steel: 0.5,
    Fairy: 0.5,
  },
  Water: {
    Grass: 2,
    Electric: 2,
    Fire: 0.5,
    Water: 0.5,
    Ice: 0.5,
    Steel: 0.5,
  },
  Grass: {
    Poison: 2,
    Bug: 2,
    Fire: 2,
    Flying: 2,
    Ice: 2,
    Ground: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Grass: 0.5,
  },
  Electric: {
    Ground: 2,
    Steel: 0.5,
    Flying: 0.5,
    Electric: 0.5,
  },
  Ice: {
    Steel: 2,
    Fighting: 2,
    Rock: 2,
    Fire: 2,
    Ice: 0.5,
  },
  Fighting: {
    Flying: 2,
    Psychic: 2,
    Fairy: 2,
    Rock: 0.5,
    Bug: 0.5,
    Dark: 0.5,
  },
  Poison: {
    Ground: 2,
    Psychic: 2,
    Fighting: 0.5,
    Poison: 0.5,
    Bug: 0.5,
    Grass: 0.5,
    Fairy: 0.5,
  },
  Ground: {
    Water: 2,
    Grass: 2,
    Ice: 2,
    Poison: 0.5,
    Rock: 0.5,
    Electric: 0,
  },
  Flying: {
    Electric: 2,
    Ice: 2,
    Rock: 2,
    Grass: 0.5,
    Fighting: 0.5,
    Bug: 0.5,
    Ground: 0,
  },
  Psychic: {
    Ghost: 2,
    Bug: 2,
    Dark: 2,
    Fighting: 0.5,
    Psychic: 0.5,
  },
  Bug: {
    Rock: 2,
    Fire: 2,
    Flying: 2,
    Fighting: 0.5,
    Ground: 0.5,
    Grass: 0.5,
  },
  Rock: {
    Steel: 2,
    Fighting: 2,
    Ground: 2,
    Water: 2,
    Grass: 2,
    Normal: 0.5,
    Poison: 0.5,
    Fire: 0.5,
    Flying: 0.5,
  },
  Ghost: {
    Ghost: 2,
    Dark: 2,
    Poison: 0.5,
    Bug: 0.5,
    Normal: 0,
    Fighting: 0,
  },
  Dragon: {
    Dragon: 2,
    Ice: 2,
    Fairy: 2,
    Water: 0.5,
    Fire: 0.5,
    Electric: 0.5,
    Grass: 0.5,
  },
  Dark: {
    Fighting: 2,
    Bug: 2,
    Fairy: 2,
    Ghost: 0.5,
    Dark: 0.5,
    Psychic: 0,
  },
  Steel: {
    Fighting: 2,
    Ground: 2,
    Fire: 2,
    Steel: 0.5,
    Normal: 0.5,
    Dragon: 0.5,
    Rock: 0.5,
    Bug: 0.5,
    Flying: 0.5,
    Ice: 0.5,
    Psychic: 0.5,
    Fairy: 0.5,
    Grass: 0.5,
    Poison: 0,
  },
  Fairy: {
    Poison: 2,
    Steel: 2,
    Fighting: 0.5,
    Bug: 0.5,
    Dark: 0.5,
    Dragon: 0,
  },
} as const;
