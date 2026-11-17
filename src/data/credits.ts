export interface LibraryCredit {
  name: string;
  version?: string;
  license: string;
  url: string;
  description: {
    'pt-BR': string;
    en: string;
    es: string;
  };
}

export const OPEN_SOURCE_LIBRARIES: LibraryCredit[] = [
  {
    name: 'Leaflet',
    version: '1.9.4',
    license: 'BSD-2-Clause',
    url: 'https://leafletjs.com',
    description: {
      'pt-BR': 'Biblioteca JavaScript open-source de alto desempenho para mapas interativos e renderização em canvas/SVG.',
      en: 'Leading open-source JavaScript library for mobile-friendly interactive maps.',
      es: 'Biblioteca JavaScript de código abierto para mapas interactivos adaptados a móviles.',
    },
  },
  {
    name: 'Next.js',
    version: '16.0.0',
    license: 'MIT',
    url: 'https://nextjs.org',
    description: {
      'pt-BR': 'Framework React de produção com App Router, renderização estática avançada e cache de componentes.',
      en: 'Production React framework enabling hybrid static generation and server components.',
      es: 'Framework React para producción con generación estática híbrida y componentes de servidor.',
    },
  },
  {
    name: 'React',
    version: '19.0.0',
    license: 'MIT',
    url: 'https://react.dev',
    description: {
      'pt-BR': 'Biblioteca fundamental para construção de interfaces declarativas baseadas em componentes.',
      en: 'Declarative, component-based user interface library.',
      es: 'Biblioteca declarativa basada en componentes para interfaces de usuario.',
    },
  },
  {
    name: 'Lucide React',
    version: '0.460.0',
    license: 'ISC',
    url: 'https://lucide.dev',
    description: {
      'pt-BR': 'Conjunto de ícones vetoriais com tree-shaking rigoroso para navegação acessível e HUD responsivo.',
      en: 'Clean and consistent icon toolkit with fine-grained tree-shaking support.',
      es: 'Conjunto de iconos limpio y consistente con soporte optimizado para tree-shaking.',
    },
  },
  {
    name: 'Tailwind CSS',
    version: '3.4.1',
    license: 'MIT',
    url: 'https://tailwindcss.com',
    description: {
      'pt-BR': 'Framework CSS utility-first para styling atômico de alto desempenho sem runtime overhead.',
      en: 'Utility-first CSS framework for atomic, zero-runtime styling.',
      es: 'Framework CSS orientado a utilidades para diseño atómico sin sobrecarga en tiempo de ejecución.',
    },
  },
];
