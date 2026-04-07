export const cmfSupportedLangs = ['en', 'es'] as const;

export type CmfLang = (typeof cmfSupportedLangs)[number];

function normalizeLang(lang?: string): CmfLang {
  return lang === 'es' ? 'es' : 'en';
}

export const cmfCopy = {
  en: {
    meta: {
      title: 'Casa Maria Flora | Holiday Home in Ojen, Andalusia',
      description:
        'Discover Casa Maria Flora, a holiday home in Ojen (Malaga, Andalusia, Spain) for 2 persons.',
    },
    header: {
      nav: [
        { href: '/#booking', label: 'Book Now' },
        { href: '/#features', label: 'Features' },
        { href: '/#gallery', label: 'Gallery' },
        { href: '/#about-us', label: 'About Us' },
        { href: '/#contact', label: 'Contact' },
      ],
      cta: 'Book Now',
      menuToggleLabel: 'Toggle menu',
      homeLabel: 'Home',
    },
    footer: {
      tagline: 'Ojen · Andalusia · Spain',
      nav: [
        { href: '/#features', label: 'Features' },
        { href: '/#booking', label: 'Booking' },
        { href: '/#gallery', label: 'Gallery' },
        { href: '/#faq', label: 'FAQ' },
        { href: '/#about-us', label: 'About Us' },
        { href: '/#contact', label: 'Contact' },
      ],
      social: [
        { href: 'mailto:hola@casa-maria-flora.com', label: 'Email' },
        { href: 'tel:+34680607675', label: 'Phone' },
        { href: '/#booking', label: 'Book Now' },
      ],
      locationLine: 'Holiday home in Ojen, Malaga, Andalusia, Spain.',
      addressLine: 'Calle Almona 11 · 29610 Ojen · hola@casa-maria-flora.com',
      copyrightSuffix: 'All rights reserved.',
    },
    hero: {
      location: 'Andalusia, Spain',
      title: 'Discover our holiday home',
      cta: 'Book Now',
      contactCards: [
        {
          label: 'Casa Maria',
          value: 'Calle Almona 11',
          lines: ['29610, Ojen', 'Andalusia, Spain'],
        },
        {
          label: 'Email',
          value: 'hola@casa-maria-flora.com',
          href: 'mailto:hola@casa-maria-flora.com',
          lines: [],
        },
        {
          label: 'Phone',
          value: '+34 680 607 675',
          href: 'tel:+34680607675',
          lines: [],
        },
      ],
    },
    featuresSection: {
      eyebrow: 'Welcome',
      title: 'Discover our holiday home Casa Maria Flora',
      paragraphs: [
        'We are welcoming you in sunny Spain. In the authentic Spanish village Ojen with lots of nature and a beach around the corner, we have a sweet holiday home. We offer a fully equipped house to make your stay as pleasant as possible. The house is available for two persons.',
        'You can book the house in the low season from 2 nights. In the high season the house is rented per week.',
        'To make a booking you can check the availability calendar down below and create your booking directly from our website. If you have special wishes regarding arrival days or longer or shorter stays, please send us an email or WhatsApp.',
      ],
      quickFactsLabel: 'Quick facts',
      quickFacts: [
        'Beautiful and comfortable apartment in Ojen, Malaga, Andalusia, Spain for 2 persons',
        'Mountainous landscape and close to restaurants and bars',
        '1 bedroom and 1 bathroom',
        'Wonderful roof terrace with lounge area and dining table',
        'Great holiday accommodation in Andalusia for your stay',
      ],
    },
    ojenCard: {
      eyebrow: 'Ojen, Spain',
      title: "One of the 'pueblos blancos'",
      intro:
        'Ojen is one of the white-washed villages which are typical for Andalusia and a must for your Spain bucket list. Postcard pretty Ojen is not one of the famous destinations in Andalusia, making this a beautiful hidden gem in Andalusia!',
      restaurantsTitle: 'Charming restaurants',
      restaurantsBody:
        "In the heart of Ojen you'll find the city square, with the local church, next to which you'll find multiple terraces and restaurants where you can enjoy some drinks or local food.",
      hikesTitle: 'Beautiful hikes in the direct surrounding',
      hikesBody:
        'One of the best things to do during your stay in Ojen is hiking in the Juanar nature reserve. The mountain views are beautiful and there are hikes for each fitness level.',
      hikes: [
        'Mirador hike: 1.5 hour easy hike',
        'El Cruz de Juanar hike: 1.5 hike up the mountain',
        'El Pozuelo round trip: easy-moderate 3 hours',
        'Climbing the Concha: 5 hours to climb the highest mountain',
      ],
    },
    directBooking: {
      eyebrow: 'Casa Maria Flora',
      title: 'Direct booking',
      iframeTitle: 'Direct booking',
    },
    bookingSection: {
      eyebrow: 'Booking',
      title: 'Book your stay',
      body:
        'To make a booking you can check the availability calendar down below and create your booking directly from our website. If you have special wishes regarding arrival days or longer or shorter stays, please send us an email or WhatsApp.',
      note:
        'Please contact us directly for any special requests regarding arrival days or longer/shorter stays.',
      emailButton: 'Email Us',
      contactButton: 'Contact Section',
      placeholderEyebrow: 'Phase 2 placeholder',
      placeholderText:
        'Calendar, date picker, price rules and booking confirmation will be added later using a reservation engine or PMS integration (instead of reproducing WordPress plugin behavior).',
    },
    amenitiesSection: {
      eyebrow: 'Amenities',
      title: 'Apartment features and facilities',
      items: [
        { title: 'Double Bed', description: 'One master bedroom with a double bed.', iconType: 'bed' },
        { title: 'Private Bathroom', description: 'A private bathroom adjoining the master bedroom.', iconType: 'bath' },
        { title: 'WiFi', description: 'We have free WiFi available for our guests.', iconType: 'wifi' },
        { title: 'Roof Terrace', description: 'On the top of the house there is a little roof terrace to enjoy the lovely weather.', iconType: 'terrace' },
        { title: 'Kitchen', description: 'Fully equipped kitchen with everything you need to cook a nice meal.', iconType: 'kitchen' },
        { title: 'Towels', description: "You don't have to bring your own towels, we have them ready for you.", iconType: 'towels' },
        { title: 'Laundry', description: "There's a washing machine available in the house.", iconType: 'laundry' },
        { title: 'Air Conditioning', description: "To make sure you have comfortable nights, we've equipped the bedroom with air conditioning.", iconType: 'air' },
        { title: 'Marbella Beach', description: 'Within 15 minutes you can enjoy lovely Marbella Beach.', iconType: 'beach' },
        { title: 'Coffee & Tea', description: 'To make your arrival as nice as possible, we have some coffee and tea ready for you.', iconType: 'coffee' },
        { title: 'Toiletries', description: "In the bathroom we've got toiletries ready for you.", iconType: 'toiletries' },
      ],
    },
    policies: {
      longStayTitle: 'Long stay',
      longStayBody:
        "Would you like a longer stay in Casa Maria Flora? It's possible to book a stay of a maximum number of days on our website. If you would like to stay longer, that's also possible. Please reach out to us by email or WhatsApp, or fill in the contact form at the bottom of the page.",
      cancellationTitle: 'Cancellation policy',
      cancellationItems: [
        'More than 60 days before arrival: free of charge. A credit note of 100% of the amount received will be issued and remains valid until the end of the following calendar year.',
        'Up to 28 days before arrival: a credit note of 75% of the amount received will be issued and remains valid until the end of the following calendar year.',
        'From 27 to 14 days before arrival: a credit note of 50% of the amount received will be issued and remains valid until the end of the following calendar year.',
        '13 days or less before arrival: the full booking amount is due.',
        'In case of no-show: the full booking amount is due.',
      ],
    },
    gallerySection: {
      eyebrow: 'Gallery',
      title: 'Take a look inside Casa Maria Flora',
    },
    testimonialsSection: {
      title: 'What Our Customers Are Saying',
      stars: '★★★★★',
      items: [
        {
          quote:
            'Thank you for the lovely holiday. We loved your place. The design and facilities were great. We certainly come back.',
          author: 'Esther van Graaf',
          visit: 'Visited in June 2023.',
        },
        {
          quote: 'Great host and good bed! Nice restaurants around the corner.',
          author: 'Bart Bilaard',
          visit: 'Visited in June 2023.',
        },
      ],
    },
    faqSection: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'Is a long stay possible in Casa Maria Flora?',
          a: "Would you like a longer stay in Casa Maria Flora? It's possible to book a stay of a maximum number of days on our website. If you would like to stay longer, that's also possible. Please reach out to us by email or WhatsApp. You can also fill in our contact form at the bottom of the page.",
        },
        {
          q: 'Can we come with our child?',
          a: 'It is possible to come with one child. For a small extra charge of EUR 25, we will provide a baby bed. Please inform us in your reservation or by email / phone.',
        },
        {
          q: 'Do I have to pay upfront?',
          a: 'We ask you to pay 30% of the total rent (including final cleaning) when making the reservation. Once the amount is received in our account, the reservation is confirmed. The remaining amount must be paid 30 days before arrival.',
        },
        {
          q: 'Can we park our car for free?',
          a: "Yes, that's possible. Within a five-minute walk there is a public parking area where you can park your car.",
        },
      ],
    },
    aboutSection: {
      eyebrow: 'About us',
      title: 'Welcome to Casa Maria Flora',
      paragraphs: [
        'We are two sisters-in-law who love this part of Spain. We work as entrepreneurs in property and fell in love with this little home, designing it into a special Spanish beach style. We hope you will enjoy it!',
        'Hola!\nMaria and Flora',
      ],
    },
    contactSection: {
      eyebrow: 'Contact',
      title: 'Want to connect?',
      formName: 'Name',
      formEmail: 'Email',
      formMessage: 'Message',
      formButton: 'Send message',
      successTitle: 'Message sent',
      successBody: 'Thanks, we will be in touch soon.',
      errorTitle: 'Message not sent',
      errorBody: 'Please try again soon or call us directly.',
      addressLabel: 'Address',
      openInMaps: 'Open in Maps',
    },
  },
  es: {
    meta: {
      title: 'Casa Maria Flora | Casa Vacacional en Ojen, Andalucia',
      description:
        'Descubre Casa Maria Flora, una casa vacacional en Ojen (Malaga, Andalucia, Espana) para 2 personas.',
    },
    header: {
      nav: [
        { href: '/#booking', label: 'Reserva' },
        { href: '/#features', label: 'Caracteristicas' },
        { href: '/#gallery', label: 'Galeria' },
        { href: '/#about-us', label: 'Sobre nosotras' },
        { href: '/#contact', label: 'Contacto' },
      ],
      cta: 'Reserva',
      menuToggleLabel: 'Abrir menu',
      homeLabel: 'Inicio',
    },
    footer: {
      tagline: 'Ojen · Andalucia · Espana',
      nav: [
        { href: '/#features', label: 'Caracteristicas' },
        { href: '/#booking', label: 'Reserva' },
        { href: '/#gallery', label: 'Galeria' },
        { href: '/#faq', label: 'FAQ' },
        { href: '/#about-us', label: 'Sobre nosotras' },
        { href: '/#contact', label: 'Contacto' },
      ],
      social: [
        { href: 'mailto:hola@casa-maria-flora.com', label: 'Email' },
        { href: 'tel:+34680607675', label: 'Telefono' },
        { href: '/#booking', label: 'Reserva' },
      ],
      locationLine: 'Casa vacacional en Ojen, Malaga, Andalucia, Espana.',
      addressLine: 'Calle Almona 11 · 29610 Ojen · hola@casa-maria-flora.com',
      copyrightSuffix: 'Todos los derechos reservados.',
    },
    hero: {
      location: 'Andalucia, Espana',
      title: 'Descubre nuestra casa vacacional',
      cta: 'Reserva ahora',
      contactCards: [
        {
          label: 'Casa Maria',
          value: 'Calle Almona 11',
          lines: ['29610, Ojen', 'Andalucia, Espana'],
        },
        {
          label: 'Email',
          value: 'hola@casa-maria-flora.com',
          href: 'mailto:hola@casa-maria-flora.com',
          lines: [],
        },
        {
          label: 'Telefono',
          value: '+34 680 607 675',
          href: 'tel:+34680607675',
          lines: [],
        },
      ],
    },
    featuresSection: {
      eyebrow: 'Bienvenidos',
      title: 'Descubre nuestra casa vacacional Casa Maria Flora',
      paragraphs: [
        'Te damos la bienvenida a la soleada Espana. En el autentico pueblo andaluz de Ojen, rodeado de naturaleza y con la playa muy cerca, tenemos una encantadora casa vacacional. Ofrecemos una casa totalmente equipada para que tu estancia sea lo mas agradable posible. La casa esta disponible para dos personas.',
        'Puedes reservar la casa en temporada baja desde 2 noches. En temporada alta se alquila por semanas.',
        'Para reservar, puedes consultar el calendario de disponibilidad y completar tu reserva directamente desde nuestra web. Si tienes peticiones especiales sobre dias de llegada o estancias mas largas o mas cortas, envianos un email o WhatsApp.',
      ],
      quickFactsLabel: 'Datos rapidos',
      quickFacts: [
        'Apartamento bonito y comodo en Ojen, Malaga, Andalucia, Espana para 2 personas',
        'Entorno montanoso y cerca de restaurantes y bares',
        '1 dormitorio y 1 bano',
        'Maravillosa azotea con zona chill-out y mesa de comedor',
        'Excelente alojamiento vacacional en Andalucia para tu estancia',
      ],
    },
    ojenCard: {
      eyebrow: 'Ojen, Espana',
      title: "Uno de los 'pueblos blancos'",
      intro:
        'Ojen es uno de los pueblos blancos tipicos de Andalucia y una visita imprescindible en tu lista de viaje por Espana. Ojen, de postal, no es uno de los destinos mas famosos de Andalucia, y eso lo convierte en una preciosa joya escondida.',
      restaurantsTitle: 'Restaurantes con encanto',
      restaurantsBody:
        'En el corazon de Ojen encontraras la plaza del pueblo, con la iglesia local, y a su lado varias terrazas y restaurantes donde disfrutar de una copa o comida local.',
      hikesTitle: 'Preciosas rutas de senderismo en los alrededores',
      hikesBody:
        'Una de las mejores actividades durante tu estancia en Ojen es hacer senderismo en la reserva natural de Juanar. Las vistas a la montana son preciosas y hay rutas para todos los niveles.',
      hikes: [
        'Ruta al Mirador: sendero facil de 1,5 horas',
        'Ruta Cruz de Juanar: subida de 1,5 horas',
        'Ruta circular El Pozuelo: facil-moderada, 3 horas',
        'Subida a La Concha: 5 horas hasta la cima',
      ],
    },
    directBooking: {
      eyebrow: 'Casa Maria Flora',
      title: 'Reserva directa',
      iframeTitle: 'Reserva directa',
    },
    bookingSection: {
      eyebrow: 'Reserva',
      title: 'Reserva tu estancia',
      body:
        'Para reservar, puedes consultar el calendario de disponibilidad y completar tu reserva directamente desde nuestra web. Si tienes peticiones especiales sobre dias de llegada o estancias mas largas o mas cortas, envianos un email o WhatsApp.',
      note:
        'Por favor, contactanos directamente para cualquier peticion especial sobre dias de llegada o estancias mas largas/cortas.',
      emailButton: 'Enviar email',
      contactButton: 'Ir a contacto',
      placeholderEyebrow: 'Marcador Fase 2',
      placeholderText:
        'El calendario, selector de fechas, reglas de precio y confirmacion de reserva se añadiran mas adelante con un motor de reservas o integracion PMS (sin reproducir el comportamiento del plugin de WordPress).',
    },
    amenitiesSection: {
      eyebrow: 'Comodidades',
      title: 'Caracteristicas y equipamiento del apartamento',
      items: [
        { title: 'Cama doble', description: 'Dormitorio principal con cama doble.', iconType: 'bed' },
        { title: 'Bano privado', description: 'Bano privado junto al dormitorio principal.', iconType: 'bath' },
        { title: 'Wifi', description: 'Wifi gratuito disponible para nuestros huespedes.', iconType: 'wifi' },
        { title: 'Azotea', description: 'En la parte superior de la casa hay una pequena azotea para disfrutar del buen tiempo.', iconType: 'terrace' },
        { title: 'Cocina', description: 'Cocina totalmente equipada con todo lo necesario para preparar una buena comida.', iconType: 'kitchen' },
        { title: 'Toallas', description: 'No tienes que traer toallas, las dejamos preparadas para ti.', iconType: 'towels' },
        { title: 'Lavanderia', description: 'Hay lavadora disponible en la casa.', iconType: 'laundry' },
        { title: 'Aire acondicionado', description: 'Para asegurar noches comodas, el dormitorio dispone de aire acondicionado.', iconType: 'air' },
        { title: 'Playa de Marbella', description: 'En 15 minutos puedes disfrutar de la playa de Marbella.', iconType: 'beach' },
        { title: 'Cafe y te', description: 'Para que tu llegada sea mas agradable, dejamos cafe y te listos para ti.', iconType: 'coffee' },
        { title: 'Aseo personal', description: 'En el bano dejamos productos basicos de aseo para ti.', iconType: 'toiletries' },
      ],
    },
    policies: {
      longStayTitle: 'Estancias largas',
      longStayBody:
        'Quieres quedarte mas tiempo en Casa Maria Flora? En la web puedes reservar hasta un numero maximo de dias. Si quieres una estancia mas larga, tambien es posible. Contactanos por email o WhatsApp, o rellena el formulario de contacto al final de la pagina.',
      cancellationTitle: 'Politica de cancelacion',
      cancellationItems: [
        'Mas de 60 dias antes de la llegada: gratis. Se emitira un bono por el 100% del importe recibido, valido hasta el final del siguiente ano natural.',
        'Hasta 28 dias antes de la llegada: se emitira un bono por el 75% del importe recibido, valido hasta el final del siguiente ano natural.',
        'De 27 a 14 dias antes de la llegada: se emitira un bono por el 50% del importe recibido, valido hasta el final del siguiente ano natural.',
        '13 dias o menos antes de la llegada: se debe abonar el importe total de la reserva.',
        'En caso de no presentarse: se debe abonar el importe total de la reserva.',
      ],
    },
    gallerySection: {
      eyebrow: 'Galeria',
      title: 'Descubre Casa Maria Flora por dentro',
    },
    testimonialsSection: {
      title: 'Lo Que Dicen Nuestros Clientes',
      stars: '★★★★★',
      items: [
        {
          quote:
            'Gracias por unas vacaciones encantadoras. Nos encanto vuestra casa. El diseno y las instalaciones fueron geniales. Volveremos sin duda.',
          author: 'Esther van Graaf',
          visit: 'Visita en junio de 2023.',
        },
        {
          quote: 'Gran anfitriona y muy buena cama. Buenos restaurantes a la vuelta de la esquina.',
          author: 'Bart Bilaard',
          visit: 'Visita en junio de 2023.',
        },
      ],
    },
    faqSection: {
      eyebrow: 'FAQ',
      title: 'Preguntas frecuentes',
      items: [
        {
          q: 'Es posible una estancia larga en Casa Maria Flora?',
          a: 'Si quieres una estancia mas larga en Casa Maria Flora, es posible. En nuestra web puedes reservar hasta un numero maximo de dias, pero para estancias mas largas puedes escribirnos por email o WhatsApp. Tambien puedes rellenar el formulario de contacto al final de la pagina.',
        },
        {
          q: 'Podemos venir con nuestro hijo?',
          a: 'Es posible venir con un nino. Por un pequeno suplemento de 25 EUR, proporcionamos una cuna. Indicalo en la reserva o por email / telefono.',
        },
        {
          q: 'Tengo que pagar por adelantado?',
          a: 'Solicitamos el 30% del alquiler total (incluida la limpieza final) al hacer la reserva. Una vez recibido el importe en nuestra cuenta, la reserva queda confirmada. El resto del importe debe abonarse 30 dias antes de la llegada.',
        },
        {
          q: 'Podemos aparcar el coche gratis?',
          a: 'Si, es posible. A unos cinco minutos andando hay una zona de aparcamiento publico donde puedes aparcar el coche.',
        },
      ],
    },
    aboutSection: {
      eyebrow: 'Sobre nosotras',
      title: 'Bienvenidos a Casa Maria Flora',
      paragraphs: [
        'Somos dos cunadas enamoradas de esta parte de Espana. Trabajamos como emprendedoras en el sector inmobiliario y nos enamoramos de esta casita, que disenamos con un estilo especial de playa espanola. Esperamos que la disfrutes mucho.',
        'Hola!\nMaria y Flora',
      ],
    },
    contactSection: {
      eyebrow: 'Contacto',
      title: 'Quieres escribirnos?',
      formName: 'Nombre',
      formEmail: 'Email',
      formMessage: 'Mensaje',
      formButton: 'Enviar mensaje',
      successTitle: 'Mensaje enviado',
      successBody: 'Gracias, te responderemos pronto.',
      errorTitle: 'Mensaje no enviado',
      errorBody: 'Intentalo de nuevo en unos minutos o llamanos directamente.',
      addressLabel: 'Direccion',
      openInMaps: 'Abrir en Maps',
    },
  },
} as const;

export function getCmfCopy(lang?: string) {
  return cmfCopy[normalizeLang(lang)];
}
