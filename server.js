import app from './app.js';
import sequelize from './config/database.js';

sequelize.authenticate()
  .then(() => console.log('Connecté à la base de données'))
  .catch(err => console.error('Erreur de connexion :', err));

sequelize.sync({ alter: true })
  .then(() => console.log('Modèles synchronisés'))
  .catch(err => console.error('Erreur de sync :', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));