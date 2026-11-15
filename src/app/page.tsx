import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redireciona para o idioma padrão (inglês) conforme especificação
  redirect('/en');
}
