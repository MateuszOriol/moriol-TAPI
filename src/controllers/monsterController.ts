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
      const monsterLocations = locations.filter(loc => monster.locationId.includes(loc.id));

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

    const monsterLocations = locations.filter(loc => monster.locationId.includes(loc.id));

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
    const { name, type, weakness, locationId } = req.body;
    if (!name || !type || !weakness || !locationId) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const location = locations.find(loc => loc.id === locationId);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const newMonster: Monster = {
      id: Date.now().toString(),
      name,
      type,
      weakness,
      locationId,
    };
    monsters.push(newMonster);

    location.monsters.push(newMonster.id);

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

    const monster = monsters[index];
    const { locationId, ...otherUpdates } = req.body;

    if (locationId && locationId !== monster.locationId) {
      const oldLocation = locations.find(loc => loc.id === monster.locationId);
      if (oldLocation) {
        oldLocation.monsters = oldLocation.monsters.filter(id => id !== monster.id);
      }

      const newLocation = locations.find(loc => loc.id === locationId);
      if (!newLocation) {
        return res.status(404).json({ message: 'New location not found' });
      }
      newLocation.monsters.push(monster.id);
    }

    monsters[index] = {
      ...monster,
      ...otherUpdates,
      locationId: locationId || monster.locationId,
    };

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

    const monster = monsters[index];

    const location = locations.find(loc => loc.id === monster.locationId);
    if (location) {
      location.monsters = location.monsters.filter(monsterId => monsterId !== monster.id);
    }

    monsters.splice(index, 1);

    return res.status(200).json({ message: 'Monster deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

