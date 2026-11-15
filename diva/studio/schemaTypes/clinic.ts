import {defineArrayMember, defineField, defineType} from 'sanity'

export const clinicSettings = defineType({
  name: 'clinicSettings',
  title: 'Kliniken',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Namn', type: 'string'}),
    defineField({name: 'legalName', title: 'Bolagsnamn', type: 'string'}),
    defineField({name: 'dentist', title: 'Tandläkare', type: 'string'}),
    defineField({name: 'phoneDisplay', title: 'Telefon, så det visas', type: 'string'}),
    defineField({name: 'phoneTel', title: 'Telefon, för länk', type: 'string'}),
    defineField({name: 'email', title: 'E-post', type: 'string'}),
    defineField({name: 'street', title: 'Gatuadress', type: 'string'}),
    defineField({name: 'postal', title: 'Postnummer', type: 'string'}),
    defineField({name: 'city', title: 'Ort', type: 'string'}),
    defineField({name: 'area', title: 'Område', type: 'string'}),
    defineField({name: 'since', title: 'Startår', type: 'number'}),
    defineField({name: 'minAge', title: 'Lägsta ålder', type: 'number'}),
    defineField({name: 'reviewLabel', title: 'Omdömesrad', type: 'string'}),
    defineField({name: 'reviews', title: 'Antal omdömen', type: 'number'}),
    defineField({name: 'logo', title: 'Logotyp', type: 'image'}),
    defineField({name: 'favicon', title: 'Favicon', type: 'image'}),
    defineField({name: 'topBar', title: 'Text i toppfältet', type: 'string'}),
    defineField({
      name: 'hours',
      title: 'Öppettider',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'days', title: 'Dagar', type: 'string'}),
            defineField({name: 'time', title: 'Tid', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'maps', title: 'Kartlänk', type: 'url'}),
    defineField({name: 'directions', title: 'Vägbeskrivning', type: 'url'}),
    defineField({name: 'mapEmbed', title: 'Inbäddad karta', type: 'url'}),
    defineField({name: 'url', title: 'Webbplats', type: 'url'}),
  ],
})
