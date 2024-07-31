import { db, ContactForm, Alert } from "astro:db";

// https://astro.build/db/seed
export default async function () {
  await db.insert(ContactForm).values([
    {
      id: 1,
      from: "en",
      sentAt: new Date(),
      name: "John Doe",
      email: "john@example.com",
      message: "You are so cool!",
    },
    {
      id: 2,
      from: "en",
      sentAt: new Date(),
      name: "Jane Doe",
      email: "jane@example.com",
      message: "You are amazing!",
    },
    {
      id: 3,
      from: "it",
      sentAt: new Date(),
      name: "Alice Smith",
      email: "alice@example.com",
      message: "You are awesome!",
    },
  ]);

  await db.insert(Alert).values([
    {
      locale: "it",
      visible: true,
      closable: true,
      alertClass: "info",
      icon: "exclamation-triangle-fill",
      content: "Firma la lettera aperta contro gli eccessi di Piracy Shield!",
      CTA: "Scopri di più e firma qui",
      CTALink: "https://stop-piracy-shield.it/",
    },
    {
      locale: "en",
      visible: true,
      closable: true,
      alertClass: "info",
      icon: "exclamation-triangle-fill",
      content: "Sign the open letter against the excesses of Piracy Shield!",
      CTA: "Learn more and sign here",
      CTALink: "https://stop-piracy-shield.it/",
    },
  ]);
}
