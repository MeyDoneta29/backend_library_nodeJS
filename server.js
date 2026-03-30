import app from './app.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sequelize, User } from './models/index.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(async () => {
    const existing = await User.findOne({ where: { email: 'admin@bibliotheque.com' } });
    if (!existing) {
      await User.create({
        name: 'Administrateur',
        email: 'admin@bibliotheque.com',
        password: await bcrypt.hash('admin123', 10),
      });
      console.log('✅ Admin créé : admin@bibliotheque.com / admin123');
    }
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
  })
  .catch(err => console.error('❌ Erreur Sequelize :', err));
