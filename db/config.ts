import { defineDb, defineTable, column } from 'astro:db';

const ContactForm = defineTable({
  columns: {
    from: column.text(),
    name: column.text(),
    email: column.text(),
    message: column.text(),
  }
});

export default defineDb({
  tables: {
    ContactForm,
  }
})