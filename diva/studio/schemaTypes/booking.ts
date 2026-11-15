import {defineArrayMember, defineField, defineType} from 'sanity'

export const bookingSettings = defineType({
  name: 'bookingSettings',
  title: 'Bokning',
  type: 'document',
  fields: [
    defineField({name: 'intro', title: 'Introduktion', type: 'text', rows: 3}),
    defineField({
      name: 'services',
      title: 'Tider som går att boka',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'serviceId', title: 'Id', type: 'string'}),
            defineField({name: 'name', title: 'Namn', type: 'string'}),
            defineField({name: 'category', title: 'Kategori', type: 'string'}),
            defineField({name: 'minutes', title: 'Minuter', type: 'number'}),
            defineField({name: 'priceLabel', title: 'Pris', type: 'string'}),
            defineField({name: 'priceNote', title: 'Pris, förklaring', type: 'text', rows: 2}),
            defineField({name: 'summary', title: 'Kort text', type: 'text', rows: 2}),
            defineField({name: 'details', title: 'Mer information', type: 'text', rows: 4}),
            defineField({name: 'page', title: 'Läs mer-länk', type: 'string'}),
            defineField({
              name: 'group',
              title: 'Grupp',
              type: 'string',
              options: {
                list: [
                  {title: 'Vanliga tider', value: 'vanlig'},
                  {title: 'Fler tider', value: 'mer'},
                ],
              },
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'priceLabel'}},
        }),
      ],
    }),
  ],
})
