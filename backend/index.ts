import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. READ: Get all todos from the database
app.get('/todos', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// 2. CREATE: Add a new todo item
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = await prisma.todo.create({
      data: { title },
    });
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// 3. UPDATE: Toggle a todo between completed and uncompleted
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { completed },
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// 4. DELETE: Remove a todo item permanently
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});