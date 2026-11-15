import {defineArrayMember, defineField, defineType} from 'sanity'

const paragraphs = defineField({
  name: 'paragraphs',
  title: 'Stycken',
  type: 'array',
  of: [defineArrayMember({type: 'text', rows: 4})],
})

export const page = defineType({
  name: 'page',
  title: 'Sida',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titel', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'slug', title: 'Adress', type: 'slug', options: {source: 'title'}, validation: (rule) => rule.required()}),
    defineField({
      name: 'kind',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: 'Behandling', value: 'treatment'},
          {title: 'Guide', value: 'post'},
          {title: 'Om kliniken', value: 'about'},
          {title: 'Priser', value: 'prices'},
          {title: 'Kontakt', value: 'contact'},
          {title: 'Juridik', value: 'legal'},
          {title: 'Startsida', value: 'home'},
          {title: 'Övrigt', value: 'other'},
        ],
      },
    }),
    defineField({name: 'h1', title: 'Rubrik på sidan', type: 'string'}),
    defineField({name: 'lead', title: 'Ingress', type: 'array', of: [defineArrayMember({type: 'text', rows: 3})]}),
    defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}}),
    defineField({name: 'date', title: 'Datum', type: 'date'}),
    defineField({
      name: 'sections',
      title: 'Avsnitt',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'heading', title: 'Rubrik', type: 'string'}),
            paragraphs,
            defineField({
              name: 'subsections',
              title: 'Underavsnitt',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'heading', title: 'Rubrik', type: 'string'}),
                    paragraphs,
                  ],
                  preview: {select: {title: 'heading'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'heading'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'h1', subtitle: 'kind', media: 'image'}},
})
