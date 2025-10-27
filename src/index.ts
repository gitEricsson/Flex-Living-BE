import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import reviewRoutes from './routes/review.routes'; // Import review routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Using 3001 to avoid conflict if frontend uses 3000

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Mount review routes
app.use('/api/reviews', reviewRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Flex Living Reviews Dashboard Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
