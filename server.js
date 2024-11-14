const express = require('express');
const path = require('path');
const app = express();

// A statikus fájlok kiszolgálása a dist mappából
app.use(express.static(path.join(__dirname, 'dist')));

// Minden kérést a Vue alkalmazás index.html fájljára irányítunk
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Szerver indítása a 8080-as porton
const port = 8080;
app.listen(port, () => {
  console.log(`A szerver fut a következő porton: ${port}`);
}); 