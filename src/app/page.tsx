//✅ Server Component — solo renderiza HTML
import Image from 'next/image';
import ImagenGrafico from '../../public/chart.png';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function HomePage() {
 return (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <h2 className="text-3xl font-bold text-gray-900">Bienvenido a ProjectFlow</h2>
    <p className="text-gray-500">Gestiona tus proyectos con arquitectura profesional</p>
    <Image
      src={ImagenGrafico}
      alt="Gráfico de la compañía"
      width={400}
      height={400}
      className="rounded-full"
    />
    <p className={inter.className}>© Todos los derechos reservados.</p>
  </div>
 );
}
