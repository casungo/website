import { db, ContactForm } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	const contactFormData = [
		{
			id: 1,
			from: 'en',
			sentAt: new Date(),
			name: 'John Doe',
			email: 'john@example.com',
			message: 'You are so cool!'
		},
		{
			id: 2,
			from: 'en',
			sentAt: new Date(),
			name: 'Jane Doe',
			email: 'jane@example.com',
			message: 'You are amazing!'
		},
		{
			id: 3,
			from: 'it',
			sentAt: new Date(),
			name: 'Alice Smith',
			email: 'alice@example.com',
			message: 'You are awesome!'
		}
	];

	await db.insert(ContactForm).values(contactFormData);
}