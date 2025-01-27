export const sampleCharacters = [
  {
    id: '1',
    name: 'Geralt of Rivia',
    race: 'Human',
    profession: 'Witcher',
    age: 98,
    favouriteLocation: '1',
  },
  {
    id: '2',
    name: 'Yennefer of Vengerberg',
    race: 'Elf',
    profession: 'Sorceress',
    age: 94,
    favouriteLocation: '2',
  },
];

export const sampleLocations = [
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

export const sampleMonsters = [
  {
    id: '1',
    name: 'Griffin',
    type: 'Hybrid',
    weakness: ['Silver Sword', 'Grapeshot'],
    favouriteLocation: '1',
  },
];
