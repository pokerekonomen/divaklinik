import {defineArrayMember, defineField, defineType} from 'sanity'

const link = [
  defineField({name: 'href', title: 'Länk', type: 'string'}),
  defineField({name: 'title', title: 'Namn', type: 'string'}),
  defineField({name: 'text', title: 'Kort text', type: 'string'}),
  defineField({name: 'icon', title: 'Ikon', type: 'string'}),
]

export const siteMenu = defineType({
  name: 'siteMenu',
  title: 'Meny',
  type: 'document',
  fields: [
    defineField({
      name: 'groups',
      title: 'Behandlingsgrupper',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Grupp', type: 'string'}),
            defineField({name: 'links', title: 'Länkar', type: 'array', of: [defineArrayMember({type: 'object', fields: link, preview: {select: {title: 'title'}}})]}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'Om oss',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: link, preview: {select: {title: 'title'}}})],
    }),
  ],
})
