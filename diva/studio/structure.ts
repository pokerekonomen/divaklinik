import type {StructureResolver} from 'sanity/structure'

const kinds = [
  ['treatment', 'Behandlingar'],
  ['post', 'Guider och råd'],
  ['about', 'Om kliniken'],
  ['prices', 'Priser'],
  ['contact', 'Kontakt'],
  ['legal', 'Juridik'],
  ['home', 'Startsidans långa text'],
  ['other', 'Övriga sidor'],
] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Innehåll')
    .items([
      S.listItem().title('Kliniken').child(S.document().schemaType('clinicSettings').documentId('klinik').title('Kliniken')),
      S.listItem().title('Startsidan').child(S.document().schemaType('homePage').documentId('startsida').title('Startsidan')),
      S.listItem().title('Meny').child(S.document().schemaType('siteMenu').documentId('meny').title('Meny')),
      S.listItem().title('Bokning').child(S.document().schemaType('bookingSettings').documentId('bokning').title('Bokning')),
      S.divider(),
      ...kinds.map(([kind, title]) =>
        S.listItem()
          .title(title)
          .child(S.documentList().title(title).filter('_type == "page" && kind == $kind').params({kind})),
      ),
    ])
