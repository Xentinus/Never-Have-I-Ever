const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');
const Category = require('./models/category');
const Question = require('./models/question');

// Környezeti változók betöltése
dotenv.config();

const app = express();

// Middleware-ek beállítása
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// API middleware a JSON Content-Type beállításához
const apiMiddleware = (req, res, next) => {
  res.charset = 'utf-8';
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
};

// API útvonalak prefix és middleware
app.use('/api', apiMiddleware);

// Alapértelmezett where feltétel
const defaultWhere = { deletedFl: false };

// API útvonalak
// Kategória endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: defaultWhere
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories/with-questions', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: defaultWhere,
      include: [{
        model: Question,
        attributes: [],
        where: defaultWhere,
        required: true
      }],
      distinct: true
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.update(req.body);
      res.json(category);
    } else {
      res.status(404).json({ error: 'Kategória nem található' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.update({ deletedFl: true });
      res.json({ message: 'Kategória törölve' });
    } else {
      res.status(404).json({ error: 'Kategória nem található' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: defaultWhere,
      include: {
        model: Category,
        where: defaultWhere
      }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { text, categoryIds } = req.body;
    const question = await Question.create({ text });
    if (categoryIds && categoryIds.length > 0) {
      await question.setCategories(categoryIds);
    }
    const questionWithCategories = await Question.findByPk(question.id, {
      include: Category
    });
    res.json(questionWithCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const { text, categoryIds } = req.body;
    const question = await Question.findByPk(req.params.id);
    if (question) {
      await question.update({ text });
      if (categoryIds) {
        await question.setCategories(categoryIds);
      }
      const updatedQuestion = await Question.findByPk(question.id, {
        include: Category
      });
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ error: 'Kérdés nem található' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (question) {
      await question.update({ deletedFl: true });
      res.json({ message: 'Kérdés törölve' });
    } else {
      res.status(404).json({ error: 'Kérdés nem található' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/questions/categories', async (req, res) => {
  try {
    const { categoryIds } = req.query;

    if (!categoryIds) {
      return res.status(400).json({ error: 'Kategória ID-k megadása kötelező' });
    }

    const categories = categoryIds.split(',').map(Number);

    const questions = await Question.findAll({
      attributes: ['text'],
      where: defaultWhere,
      include: {
        model: Category,
        where: {
          ...defaultWhere,
          id: categories
        },
        attributes: []
      },
      group: ['Question.id'],
      order: db.sequelize.random()
    });

    const questionTexts = questions.map(q => q.text);

    res.json(questionTexts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Frontend catch-all route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), err => {
    if (err) {
      console.error('Hiba a frontend kiszolgálásakor:', err);
      res.status(500).send('Hiba történt a frontend betöltésekor');
    }
  });
});

// Port beállítása és szerver indítása
const port = process.env.VUE_APP_HOST_PORT || 8080; // Használjuk a sima PORT környezeti változót
const url = process.env.VUE_APP_API_URL || "http://localhost";
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Szerver fut a következő porton: ${port}`);
    console.log(`Frontend elérhető: ${url}`);
    console.log(`API elérhető: ${url}/api`);
  });
}); 