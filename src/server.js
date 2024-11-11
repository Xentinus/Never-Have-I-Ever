const express = require('express');
const cors = require('cors');
const db = require('./models');
const Category = require('./models/category');
const Question = require('./models/question');

const app = express();
app.use(cors());

// UTF-8 kódolás beállítása
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Explicit karakter kódolás beállítása
app.use((req, res, next) => {
  res.charset = 'utf-8';
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Alapértelmezett where feltétel a nem törölt elemekhez
const defaultWhere = { deletedFl: false };

// Kategória műveletek
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: defaultWhere
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/categories/:id', async (req, res) => {
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

app.delete('/categories/:id', async (req, res) => {
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

// Kérdés műveletek
app.get('/questions', async (req, res) => {
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

app.post('/questions', async (req, res) => {
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

app.put('/questions/:id', async (req, res) => {
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

app.delete('/questions/:id', async (req, res) => {
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

// Kérdések lekérése több kategóriából
app.get('/questions/categories', async (req, res) => {
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

// Adatbázis inicializálása és szerver indítása
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Szerver fut a következő porton: ${PORT}`);
  });
});