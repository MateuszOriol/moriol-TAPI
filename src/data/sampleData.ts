import { Character } from '../models/Character';
import { Location } from '../models/Location';
import { Monster } from '../models/Monster';

export const sampleCharacters: Character[] = [
  {
    id: '1',
    name: 'Geralt of Rivia',
    race: 'Human',
    profession: 'Witcher',
    age: 98,
    locationId: '1',
  },
  {
    id: '2',
    name: 'Yennefer of Vengerberg',
    race: 'Elf',
    profession: 'Sorceress',
    age: 94,
    locationId: '2',
  },
];

export const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Kaer Morhen',
    region: 'Kaedwen',
    description: 'The keep of the witchers of the School of the Wolf.',
    characters: ['1'],
    monsters: ['1'],
  },
  {
    id: '2',
    name: 'Vengerberg',
    region: 'Aedirn',
    description: 'Capital city of Aedirn.',
    characters: ['2'],
    monsters: [],
  },
];

export const sampleMonsters: Monster[] = [
  {
    id: '1',
    name: 'Griffin',
    type: 'Hybrid',
    weakness: ['Silver Sword', 'Grapeshot'],
    locationId: '1',
  },
];
