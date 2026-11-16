import { Language } from '@/types';

export interface CharacterItem {
  id: string;
  name: string;
  role: Record<Language, string>;
  isProtagonist: boolean;
  image: string;
  bio: Record<Language, string>;
}

export interface GalleryItem {
  id: string;
  image: string;
  title: Record<Language, string>;
}

export const PROTAGONISTS: CharacterItem[] = [
  {
    id: 'jason_duval',
    name: 'Jason Duval',
    role: {
      en: 'Protagonist',
      'pt-BR': 'Protagonista',
      es: 'Protagonista',
    },
    isProtagonist: true,
    image: '/characters/jason.jpg',
    bio: {
      'pt-BR':
        'Um veterano do exército que cresceu entre trapaceiros e bandidos e quer uma vida tranquila que sempre lhe escapa. Agora ele faz serviços para traficantes locais nos Keys — e conhecer Lucia pode ser a melhor ou a pior coisa que já lhe aconteceu.',
      en:
        'An army veteran who grew up around hustlers and crooks, seeking a quiet life that always seems to slip away. Now running jobs for local dealers across the Keys — meeting Lucia might be the best or the worst thing that ever happened to him.',
      es:
        'Un veterano del ejército que creció entre estafadores y delincuentes buscando una vida tranquila que siempre se le escapa. Ahora hace encargos para traficantes locales en los Cayos — y conocer a Lucia puede ser lo mejor o lo peor que le haya pasado.',
    },
  },
  {
    id: 'lucia_caminos',
    name: 'Lucia Caminos',
    role: {
      en: 'Protagonist',
      'pt-BR': 'Protagonista',
      es: 'Protagonista',
    },
    isProtagonist: true,
    image: '/characters/lucia.jpg',
    bio: {
      'pt-BR':
        'A primeira protagonista feminina jogável de um GTA moderno. Criada em Liberty City e ensinada a lutar pelo pai, ela cumpriu pena na Penitenciária de Leonida por proteger a família. Recém-saída da prisão, quer a boa vida que a mãe sempre sonhou — e desta vez, só jogadas espertas.',
      en:
        'The first playable female protagonist of modern GTA. Raised in Liberty City and taught to fight by her father, she served time at the Leonida Penitentiary protecting family. Fresh out of prison, she wants the good life her mother dreamed of — and this time, only smart plays.',
      es:
        'La primera protagonista femenina jugable de un GTA moderno. Criada en Liberty City y enseñada a pelear por su padre, cumplió condena en la Penitenciaría de Leonida por proteger a su familia. Recién salida de prisión, busca la buena vida con la que su madre soñaba — y esta vez, solo jugadas inteligentes.',
    },
  },
];

export const OFFICIAL_GALLERY: GalleryItem[] = [
  {
    id: 'store_heist',
    image: '/characters/gallery-1.jpg',
    title: {
      'pt-BR': 'Planejamento e Assalto',
      en: 'Store Heist Crew',
      es: 'Asalto en Tienda',
    },
  },
  {
    id: 'bedroom_talk',
    image: '/characters/gallery-2.jpg',
    title: {
      'pt-BR': 'Diálogo e Confiança',
      en: 'Late Night Talk',
      es: 'Conversación Íntima',
    },
  },
  {
    id: 'night_streets',
    image: '/characters/gallery-3.jpg',
    title: {
      'pt-BR': 'Sob a Luz Neon',
      en: 'Vice City Under Neon',
      es: 'Bajo las Luces de Neón',
    },
  },
  {
    id: 'getaway_walk',
    image: '/characters/gallery-4.jpg',
    title: {
      'pt-BR': 'Fuga com o Dinheiro',
      en: 'Getaway Walk',
      es: 'Escape con el Botín',
    },
  },
  {
    id: 'convertible_cruise',
    image: '/characters/gallery-5.jpg',
    title: {
      'pt-BR': 'Conversível em Alta Velocidade',
      en: 'Convertible Ride',
      es: 'Huida en Descapotable',
    },
  },
  {
    id: 'standoff',
    image: '/characters/gallery-6.jpg',
    title: {
      'pt-BR': 'Ação Armada em Dupla',
      en: 'Armed Duo in Action',
      es: 'Dúo Armado en Acción',
    },
  },
];

export const SUPPORTING_CAST: CharacterItem[] = [
  {
    id: 'cal_hampton',
    name: 'Cal Hampton',
    role: {
      'pt-BR': 'AMIGO DE JASON',
      en: 'FRIEND OF JASON',
      es: 'AMIGO DE JASON',
    },
    isProtagonist: false,
    image: '/characters/cal-hampton.jpg',
    bio: {
      'pt-BR':
        'Um teórico da conspiração que se sente mais seguro em casa — mergulhado em tocas de coelho da internet, escutando a comunicação da Guarda Costeira do sofá.',
      en:
        'A conspiracy theorist who feels safest at home — immersed in internet rabbit holes, listening to Coast Guard scanners from his couch.',
      es:
        'Un teórico de la conspiración que se siente más seguro en casa — sumergido en madrigueras de internet, escuchando las frecuencias de la Guardia Costera desde su sofá.',
    },
  },
  {
    id: 'boobie_ike',
    name: 'Boobie Ike',
    role: {
      'pt-BR': 'MAGNATA DE VICE CITY',
      en: 'VICE CITY MOGUL',
      es: 'MAGNATE DE VICE CITY',
    },
    isProtagonist: false,
    image: '/characters/boobie-ike.jpg',
    bio: {
      'pt-BR':
        'Uma lenda local que transformou dinheiro das ruas em um império legítimo — uma boate de strip, um estúdio de gravação e imóveis por toda Vice City.',
      en:
        'A local legend who turned street money into a legitimate empire — a strip club, a recording studio, and properties across all of Vice City.',
      es:
        'Una leyenda local que transformó el dinero callejero en un imperio legítimo — un club de striptease, un estudio de grabación y propiedades en toda Vice City.',
    },
  },
  {
    id: 'drequan_priest',
    name: "Dre'Quan Priest",
    role: {
      'pt-BR': 'EMPRESÁRIO MUSICAL',
      en: 'MUSIC EXECUTIVE',
      es: 'EMPRESARIO MUSICAL',
    },
    isProtagonist: false,
    image: '/characters/drequan-priest.jpg',
    bio: {
      'pt-BR':
        'Fundador da Only Raw Records, trabalhando para transformar a cena de clubes de Vice City em um verdadeiro império musical — com um pé de cada lado da lei.',
      en:
        'Founder of Only Raw Records, striving to turn Vice City’s club scene into a bona fide music empire — with one foot on each side of the law.',
      es:
        'Fundador de Only Raw Records, trabajando para convertir la escena nocturna de Vice City en un auténtico imperio musical — con un pie a cada lado de la ley.',
    },
  },
  {
    id: 'real_dimez',
    name: 'Real Dimez',
    role: {
      'pt-BR': 'DUPLA DE RAP',
      en: 'RAP DUO',
      es: 'DÚO DE RAP',
    },
    isProtagonist: false,
    image: '/characters/real-dimez.jpg',
    bio: {
      'pt-BR':
        'Bae-Luxe e Roxy — uma dupla de rap ligada nas redes sociais e assinada pela Only Raw Records, misturando máxima visibilidade pública com conexões discretas no submundo.',
      en:
        'Bae-Luxe and Roxy — a social media-savvy rap duo signed to Only Raw Records, blending maximum public visibility with discrete underworld connections.',
      es:
        'Bae-Luxe y Roxy — un dúo de rap activo en redes sociales y firmado por Only Raw Records, combinando máxima visibilidad pública con discretos contactos en el bajo mundo.',
    },
  },
  {
    id: 'raul_bautista',
    name: 'Raul Bautista',
    role: {
      'pt-BR': 'VETERANO DE ASSALTOS',
      en: 'HEIST VETERAN',
      es: 'VETERANO DE ASALTOS',
    },
    isProtagonist: false,
    image: '/characters/raul-bautista.jpg',
    bio: {
      'pt-BR':
        'Um assaltante de bancos experiente sempre em busca de gente capaz para o próximo grande golpe — muita pressão, muita recompensa.',
      en:
        'An experienced bank robber always scouting capable talent for the next big score — high pressure, massive payout.',
      es:
        'Un atracador de bancos veterano siempre en busca de cómplices capaces para el próximo gran golpe — alta presión, gran recompensa.',
    },
  },
  {
    id: 'brian_heder',
    name: 'Brian Heder',
    role: {
      'pt-BR': 'CONTRABANDISTA DA VELHA GUARDA',
      en: 'OLD-SCHOOL SMUGGLER',
      es: 'CONTRABANDISTA DE LA VIEJA GUARDIA',
    },
    isProtagonist: false,
    image: '/characters/brian-heder.jpg',
    bio: {
      'pt-BR':
        'Um traficante dos tempos áureos dos Keys que deixa Jason morar em uma de suas propriedades em troca de pequenos serviços.',
      en:
        'A smuggler from the golden era of the Keys who lets Jason stay at one of his properties in exchange for odd jobs.',
      es:
        'Un traficante de la época dorada de los Cayos que deja vivir a Jason en una de sus propiedades a cambio de pequeños favores.',
    },
  },
];
