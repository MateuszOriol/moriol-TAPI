import { Request, Response } from 'express';
import { Location } from '../models/Location';
import { Character } from '../models/Character';
import { Monster } from '../models/Monster';
import { generateLinks } from '../utils/hateoas';
import { characters, locations, monsters } from '../server';

export const getAllLocations = (req: Request, res: Response): Response => {
  try {
    if (locations.length === 0) {
      return res.status(404).json({ message: 'No locations found' });
    }

    const data = locations.map(location => {
      const locationCharacters = characters.filter(char => char.locationId === location.id);
      const locationMonsters = monsters.filter(monster => location.monsters.includes(monster.id));

      return {
        id: location.id,
        name: location.name,
        region: location.region,
        description: location.description,
        characters: locationCharacters.map(char => ({
          id: char.id,
          name: char.name,
          race: char.race,
          profession: char.profession,
          age: char.age,
        })),
        monsters: locationMonsters.map(monster => ({
          id: monster.id,
          name: monster.name,
          type: monster.type,
          weakness: monster.weakness,
        })),
        links: generateLinks(location.id, 'locations'),
      };
    });

    return res.status(200).json({
      message: 'List of locations with characters and monsters',
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLocationById = (req: Request, res: Response): Response => {
  try {
    const location = locations.find(loc => loc.id === req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const locationCharacters = characters.filter(char => char.locationId === location.id);
    const locationMonsters = monsters.filter(monster => location.monsters.includes(monster.id));

    return res.status(200).json({
      message: 'Location details',
      data: {
        id: location.id,
        name: location.name,
        region: location.region,
        description: location.description,
        characters: locationCharacters.map(char => ({
          id: char.id,
          name: char.name,
          race: char.race,
          profession: char.profession,
          age: char.age,
        })),
        monsters: locationMonsters.map(monster => ({
          id: monster.id,
          name: monster.name,
          type: monster.type,
          weakness: monster.weakness,
        })),
        links: generateLinks(location.id, 'locations'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createLocation = (req: Request, res: Response): Response => {
  try {
    const { name, region, description } = req.body;

    if (!name || !region || !description) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const newLocation: Location = {
      id: Date.now().toString(),
      name,
      region,
      description,
      characters: [],
      monsters: [],
    };

    locations.push(newLocation);

    return res.status(201).json({
      message: 'Location created',
      data: {
        ...newLocation,
        links: generateLinks(newLocation.id, 'locations'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateLocation = (req: Request, res: Response): Response => {
  try {
    const index = locations.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Location not found' });
    }
    locations[index] = { ...locations[index], ...req.body };
    return res.status(200).json({
      message: 'Location updated',
      data: {
        ...locations[index],
        links: generateLinks(locations[index].id, 'locations'),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLocation = (req: Request, res: Response): Response => {
  try {
    const index = locations.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Location not found' });
    }
    locations.splice(index, 1);
    return res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
