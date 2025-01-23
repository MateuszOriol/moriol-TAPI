import { Request, Response } from 'express';
import { Character } from '../models/Character';
import { Location } from '../models/Location';
import { Monster } from '../models/Monster';
import { generateLinks } from '../utils/hateoas';
import { characters, locations, monsters } from '../server';

export const getAllCharacters = (req: Request, res: Response): Response => {
  try {
    if (characters.length === 0) {
      return res.status(404).json({ message: 'No characters found' });
    }

    const data = characters.map(character => {
      const location = locations.find(loc => loc.id === character.locationId);
      const locationMonsters = location
        ? monsters.filter(monster => location.monsters.includes(monster.id))
        : [];

      return {
        ...character,
        location: location
          ? {
              id: location.id,
              name: location.name,
              region: location.region,
              description: location.description,
              monsters: locationMonsters.map(monster => ({
                id: monster.id,
                name: monster.name,
                type: monster.type,
                weakness: monster.weakness,
              })),
            }
          : null,
        links: generateLinks(character.id, 'characters'),
      };
    });

    return res.status(200).json({
      message: 'List of characters with location and monsters',
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCharacterById = (req: Request, res: Response): Response => {
  try {
    const character = characters.find(c => c.id === req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const location = locations.find(loc => loc.id === character.locationId);
    const locationMonsters = location
      ? monsters.filter(monster => location.monsters.includes(monster.id))
      : [];

    return res.status(200).json({
      message: 'Character details',
      data: {
        ...character,
        location: location
          ? {
              id: location.id,
              name: location.name,
              region: location.region,
              description: location.description,
              monsters: locationMonsters.map(monster => ({
                id: monster.id,
                name: monster.name,
                type: monster.type,
                weakness: monster.weakness,
              })),
            }
          : null,
        links: generateLinks(character.id, 'characters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCharacter = (req: Request, res: Response): Response => {
  try {
    const { name, race, profession, age, locationId } = req.body;
    if (!name || !race || !profession || !age || !locationId) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const newCharacter: Character = { ...req.body, id: Date.now().toString() };
    characters.push(newCharacter);
    return res.status(201).json({
      message: 'Character created',
      data: {
        ...newCharacter,
        links: generateLinks(newCharacter.id, 'characters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCharacter = (req: Request, res: Response): Response => {
  try {
    const index = characters.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Character not found' });
    }
    characters[index] = { ...characters[index], ...req.body };
    return res.status(200).json({
      message: 'Character updated',
      data: {
        ...characters[index],
        links: generateLinks(characters[index].id, 'characters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCharacter = (req: Request, res: Response): Response => {
  try {
    const index = characters.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Character not found' });
    }
    characters.splice(index, 1);
    return res.status(200).json({ message: 'Character deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
