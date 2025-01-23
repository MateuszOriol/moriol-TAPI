import { Request, Response } from 'express';
import { Monster } from '../models/Monster';
import { Location } from '../models/Location';
import { generateLinks } from '../utils/hateoas';
import { monsters, locations } from '../server';

export const getAllMonsters = (req: Request, res: Response): Response => {
  try {
    if (monsters.length === 0) {
      return res.status(404).json({ message: 'No monsters found' });
    }

    const data = monsters.map(monster => {
      const monsterLocations = locations.filter(loc => monster.locationIds.includes(loc.id));

      return {
        id: monster.id,
        name: monster.name,
        type: monster.type,
        weakness: monster.weakness,
        locations: monsterLocations.map(loc => ({
          id: loc.id,
          name: loc.name,
          region: loc.region,
          description: loc.description,
        })),
        links: generateLinks(monster.id, 'monsters'),
      };
    });

    return res.status(200).json({
      message: 'List of monsters with locations',
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMonsterById = (req: Request, res: Response): Response => {
  try {
    const monster = monsters.find(m => m.id === req.params.id);
    if (!monster) {
      return res.status(404).json({ message: 'Monster not found' });
    }

    const monsterLocations = locations.filter(loc => monster.locationIds.includes(loc.id));

    return res.status(200).json({
      message: 'Monster details',
      data: {
        id: monster.id,
        name: monster.name,
        type: monster.type,
        weakness: monster.weakness,
        locations: monsterLocations.map(loc => ({
          id: loc.id,
          name: loc.name,
          region: loc.region,
          description: loc.description,
        })),
        links: generateLinks(monster.id, 'monsters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMonster = (req: Request, res: Response): Response => {
  try {
    const { name, type, weakness, locationIds } = req.body;
    if (!name || !type || !weakness || !locationIds) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const newMonster: Monster = { ...req.body, id: Date.now().toString() };
    monsters.push(newMonster);
    return res.status(201).json({
      message: 'Monster created',
      data: {
        ...newMonster,
        links: generateLinks(newMonster.id, 'monsters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMonster = (req: Request, res: Response): Response => {
  try {
    const index = monsters.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Monster not found' });
    }
    monsters[index] = { ...monsters[index], ...req.body };
    return res.status(200).json({
      message: 'Monster updated',
      data: {
        ...monsters[index],
        links: generateLinks(monsters[index].id, 'monsters'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMonster = (req: Request, res: Response): Response => {
  try {
    const index = monsters.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Monster not found' });
    }
    monsters.splice(index, 1);
    return res.status(200).json({ message: 'Monster deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
