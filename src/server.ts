import express, { Application } from 'express';
import cors from 'cors';
import characterRoutes from './routes/characterRoutes';
import locationRoutes from './routes/locationRoutes';
import monsterRoutes from './routes/monsterRoutes';
import { sampleCharacters, sampleLocations, sampleMonsters } from './data/sampleData';
import { Character } from './models/Character';
import { Location } from './models/Location';
import { Monster } from './models/Monster';
import { setHeaders } from './middleware/setHeaders';
import typeDefs from './graphql/schema/schema';
import resolvers from './graphql/resolvers/resolvers';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

export const characters: Character[] = [];
export const locations: Location[] = [];
export const monsters: Monster[] = [];

const initializeSampleData = () => {
  characters.push(...sampleCharacters);
  locations.push(...sampleLocations);
  monsters.push(...sampleMonsters);
  console.log('Sample REST data initialized.');
};

const startRestServer = (): void => {
  const app: Application = express();
  const PORT = 3000;

  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  const swaggerDocument = YAML.load('./src/docs/openapi.yaml');

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(setHeaders);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/characters', characterRoutes);
  app.use('/locations', locationRoutes);
  app.use('/monsters', monsterRoutes);

  initializeSampleData();

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  });
};

startServer().catch(err => console.error('Failed to start server:', err));