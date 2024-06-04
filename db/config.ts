import { defineDb, defineTable, column, NOW } from 'astro:db'

const ContactForm = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    from: column.text(),
    sentAt: column.date({ default: NOW }),
    name: column.text(),
    email: column.text(),
    message: column.text(),
  }
})

export default defineDb({
  tables: {
    ContactForm,
  }
})