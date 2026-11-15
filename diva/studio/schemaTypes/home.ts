import {defineArrayMember, defineField, defineType} from 'sanity'

const card = [
  defineField({name: 'title', title: 'Rubrik', type: 'string'}),
  defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Startsidan',
  type: 'document',
  fields: [
    defineField({name: 'kicker', title: 'Liten rad över rubriken', type: 'string'}),
    defineField({name: 'h1', title: 'Huvudrubrik', type: 'string'}),
    defineField({name: 'lead', title: 'Ingress', type: 'text', rows: 3}),
    defineField({name: 'heroImage', title: 'Stor bild', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'reasons',
      title: 'Tre korta kort',
      type: 'array',
      of: [defineArrayMember({type: 'object', fields: card, preview: {select: {title: 'title'}}})],
    }),
    defineField({name: 'pathsHeading', title: 'Rubrik, vägar', type: 'string'}),
    defineField({name: 'pathsLead', title: 'Text, vägar', type: 'text', rows: 3}),
    defineField({
      name: 'paths',
      title: 'Vägar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'href', title: 'Länk', type: 'string'}),
            defineField({name: 'title', title: 'Rubrik', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({name: 'icon', title: 'Ikon', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'text'}},
        }),
      ],
    }),
    defineField({name: 'featuredHeading', title: 'Rubrik, behandlingar', type: 'string'}),
    defineField({name: 'featuredLead', title: 'Text, behandlingar', type: 'text', rows: 3}),
    defineField({
      name: 'featured',
      title: 'Utvalda behandlingar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'href', title: 'Länk', type: 'string'}),
            defineField({name: 'title', title: 'Rubrik', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            defineField({name: 'image', title: 'Bild', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'title', media: 'image'}},
        }),
      ],
    }),
    defineField({name: 'listeningHeading', title: 'Rubrik, lyssna', type: 'string'}),
    defineField({name: 'listeningText', title: 'Text, lyssna', type: 'array', of: [defineArrayMember({type: 'text', rows: 3})]}),
    defineField({name: 'listeningImage', title: 'Bild, lyssna', type: 'image'}),
    defineField({name: 'reviewsHeading', title: 'Rubrik, omdömen', type: 'string'}),
    defineField({name: 'reviewsLead', title: 'Text, omdömen', type: 'text', rows: 2}),
    defineField({
      name: 'reviews',
      title: 'Omdömen',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Namn', type: 'string'}),
            defineField({name: 'text', title: 'Citat', type: 'text', rows: 4}),
          ],
          preview: {select: {title: 'name', subtitle: 'text'}},
        }),
      ],
    }),
    defineField({name: 'locationHeading', title: 'Rubrik, hitta hit', type: 'string'}),
    defineField({name: 'locationText', title: 'Text, hitta hit', type: 'text', rows: 3}),
    defineField({name: 'locationImage', title: 'Bild, hitta hit', type: 'image'}),
    defineField({name: 'mapHeading', title: 'Rubrik över kartan', type: 'string'}),
  ],
})
