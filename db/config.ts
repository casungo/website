import { defineDb, defineTable, column, NOW } from "astro:db";

const ContactForm = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    from: column.text(),
    sentAt: column.date({ default: NOW }),
    name: column.text(),
    email: column.text(),
    message: column.text(),
  },
});

const Alert = defineTable({
  columns: {
    locale: column.text(),
    visible: column.boolean(),
    closable: column.boolean(),
    alertClass: column.text(),
    icon: column.text(),
    content: column.text(),
    CTA: column.text(),
    CTALink: column.text(),
  },
});

export default defineDb({
  tables: {
    ContactForm,
    Alert,
  },
});
