import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { sequelize, User, Category, Book, Member } from '../models/index.js';

dotenv.config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion BDD établie');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');

    // ─── USERS ───────────────────────────────────────────────
    const usersData = [
      { name: 'Administrateur',    email: 'admin@bibliotheque.com', password: 'admin123' },
      { name: 'Bibliothécaire Test', email: 'biblio@test.com',      password: 'biblio123' },
    ];

    for (const u of usersData) {
      const exists = await User.findOne({ where: { email: u.email } });
      if (!exists) {
        await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
        console.log(`  👤 User créé : ${u.email}`);
      } else {
        console.log(`  ⏭️  User déjà existant : ${u.email}`);
      }
    }

    // ─── CATEGORIES ──────────────────────────────────────────
    const categoriesData = [
      { name: 'Roman',           description: 'Œuvres de fiction narrative longue' },
      { name: 'Science-Fiction', description: 'Littérature d\'anticipation et de futur' },
      { name: 'Histoire',        description: 'Ouvrages historiques et biographies' },
      { name: 'Informatique',    description: 'Programmation, réseaux et systèmes' },
    ];

    const categories = {};
    for (const c of categoriesData) {
      const [category, created] = await Category.findOrCreate({ where: { name: c.name }, defaults: c });
      categories[c.name] = category;
      console.log(`  📂 Catégorie ${created ? 'créée' : 'déjà existante'} : ${c.name}`);
    }

    // ─── BOOKS ───────────────────────────────────────────────
    const booksData = [
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-2-07-040850-4',
        category_id: categories['Roman'].id,
        quantity: 5,
        available_quantity: 5,
        description: 'Un pilote échoué dans le désert rencontre un petit prince venu d\'une autre planète.',
      },
      {
        title: 'L\'Étranger',
        author: 'Albert Camus',
        isbn: '978-2-07-036024-6',
        category_id: categories['Roman'].id,
        quantity: 6,
        available_quantity: 6,
        description: 'Meursault, un homme indifférent au monde, tue un Arabe sur une plage algérienne.',
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        isbn: '978-2-07-036822-8',
        category_id: categories['Science-Fiction'].id,
        quantity: 3,
        available_quantity: 3,
        description: 'Sur la planète désertique Arrakis, Paul Atréides affronte son destin.',
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-2-07-036822-1',
        category_id: categories['Science-Fiction'].id,
        quantity: 4,
        available_quantity: 4,
        description: 'Dans un futur totalitaire, Winston Smith résiste au régime du Grand Frère.',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        isbn: '978-2-226-25723-1',
        category_id: categories['Histoire'].id,
        quantity: 2,
        available_quantity: 2,
        description: 'Une brève histoire de l\'humanité des origines à aujourd\'hui.',
      },
      {
        title: 'Le monde est plat',
        author: 'Thomas L. Friedman',
        isbn: '978-2-082-10345-2',
        category_id: categories['Histoire'].id,
        quantity: 3,
        available_quantity: 3,
        description: 'Comment la mondialisation a aplati le monde économique et culturel.',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        category_id: categories['Informatique'].id,
        quantity: 4,
        available_quantity: 4,
        description: 'Les bonnes pratiques pour écrire un code propre, lisible et maintenable.',
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        isbn: '978-0-20-161622-4',
        category_id: categories['Informatique'].id,
        quantity: 3,
        available_quantity: 3,
        description: 'Guide essentiel pour devenir un développeur pragmatique et efficace.',
      },
    ];

    for (const b of booksData) {
      const [, created] = await Book.findOrCreate({ where: { isbn: b.isbn }, defaults: b });
      console.log(`  📖 Livre ${created ? 'créé' : 'déjà existant'} : ${b.title}`);
    }

    // ─── MEMBERS ─────────────────────────────────────────────
    const membersData = [
      {
        first_name: 'Aminata', last_name: 'Diallo',
        email: 'aminata.diallo@gmail.com', phone: '+221 77 123 45 67',
        address: 'Dakar, Sénégal', status: 'active',
      },
      {
        first_name: 'Kofi', last_name: 'Mensah',
        email: 'kofi.mensah@yahoo.fr', phone: '+225 07 456 78 90',
        address: 'Abidjan, Côte d\'Ivoire', status: 'active',
      },
      {
        first_name: 'Fatou', last_name: 'Ndiaye',
        email: 'fatou.ndiaye@outlook.com', phone: '+221 76 987 65 43',
        address: 'Saint-Louis, Sénégal', status: 'inactive',
      },
      {
        first_name: 'Jean-Baptiste', last_name: 'Rakoto',
        email: 'jb.rakoto@gmail.com', phone: '+261 34 567 89 01',
        address: 'Antananarivo, Madagascar', status: 'active',
      },
      {
        first_name: 'Mariam', last_name: 'Touré',
        email: 'mariam.toure@gmail.com', phone: '+223 76 234 56 78',
        address: 'Bamako, Mali', status: 'active',
      },
    ];

    for (const m of membersData) {
      const [, created] = await Member.findOrCreate({ where: { email: m.email }, defaults: m });
      console.log(`  👥 Membre ${created ? 'créé' : 'déjà existant'} : ${m.first_name} ${m.last_name}`);
    }

    console.log('\n🎉 Seeder terminé avec succès !');
    console.log('─────────────────────────────────────');
    console.log('  Connexion admin → admin@bibliotheque.com / admin123');
    console.log('─────────────────────────────────────');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erreur seeder :', err.message);
    process.exit(1);
  }
};

seed();
