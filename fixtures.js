const mongoose = require('mongoose');
const config = require('./config');
const Category = require('./models/Category');
const Product = require('./models/Product');

const run = async () => {
	await mongoose.connect(config.database, config.databaseOptions);

	const collections = await mongoose.connection.db.listCollections().toArray();

	for (let coll of collections) {
		await mongoose.connection.db.dropCollection(coll.name);
	}

	const [cpus, hdds, gpus] = await Category.create({
		title: 'CPUs',
		description: 'Central Processing Units'
	}, {
		title: 'HDDs',
		description: 'Hard Disk Drives'
	}, {
		title: 'GPUs',
		description: 'Video cards'
	});

	await Product.create({
		title: 'Intel Core i7',
		price: 400,
		category: cpus,
		image: 'fixtures/cpu.jpg'
	}, {
		title: 'Seagate Barracuda 2TB',
		price: 70,
		category: hdds,
		image: 'fixtures/hdd.jpg'
	}, {
		title: 'ASUS Geforce RTX 2080Ti',
		price: 1000,
		category: gpus,
		image: 'fixtures/gpu.jpg'
	});

	mongoose.connection.close();
};

run().catch(e => {
	mongoose.connection.close();
	throw e;
});