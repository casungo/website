import { db, ContactForm } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(ContactForm).values([
		{
			from: 'en',
			name: 'John Doe',
			email: 'john@example.com',
			message: 'You are so cool!'
		},
		{
			from: 'en',
			name: 'Jane Doe',
			email: 'jane@example.com',
			message: 'You are amazing!'
		},
		{
			from: 'it',
			name: 'Alice Smith',
			email: 'alice@example.com',
			message: 'You are awesome!'
		}
	]);
}
