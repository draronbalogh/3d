import express from 'express';

const app = express();
const port = process.env.PORT;

interface Dog {
  name: string;
  breed: 'labrador' | 'german shepherd' | 'golden retriever';
  adopted_at: Date | null;
  birth_date: Date | null;
}
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
