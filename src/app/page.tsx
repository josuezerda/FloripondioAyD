'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePromoPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/mercadopago/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Promo Mini Escenográfica',
          price: 500000,
          description: 'Decoración mini escenográfica con globos, nombres, torta 2kg, cajitas'
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-neutral-800">

      {/* 
        ====================================================================
        HEADER / NAVIGATION (Pink Theme)
        ====================================================================
      */}
      <header className="sticky top-0 z-50 w-full bg-[#FF4F8B] text-white shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-14 w-40">
                <Image
                  src="/logo.png"
                  alt="Floripondio Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
              <Link href="/" className="hover:text-pink-200 transition-colors">Inicio</Link>
              <Link href="#nosotros" className="hover:text-pink-200 transition-colors">Sobre Nosotros</Link>
              <Link href="#tienda" className="hover:text-pink-200 transition-colors">Tienda</Link>

              <div className="relative group flex items-center gap-1 cursor-pointer">
                <span className="border-b-2 border-white pb-1">Servicios</span>
                <ChevronDown className="h-4 w-4 mb-1" />
              </div>

              <Link href="#galeria" className="hover:text-pink-200 transition-colors">Galería</Link>
              <Link href="#contacto" className="hover:text-pink-200 transition-colors">Contacto</Link>
            </nav>

            {/* Cart & Price */}
            <div className="flex items-center gap-3 font-semibold text-sm">
              <span>$ 0,00</span>
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">

        {/* 
          ====================================================================
          HERO / INTRO SECTION (Auto-playing Slider)
          ====================================================================
        */}
        <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#FFF0F5]">
          <HeroSlider />
        </section>

        {/* 
          ====================================================================
          PROMO ESPECIAL ($500.000)
          ====================================================================
        */}
        <section className="relative w-full py-20 bg-[#FF4F8B] text-white">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <div className="container px-4 md:px-8 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-white/10 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/20 shadow-2xl">

              {/* Promo Banner / Info */}
              <div className="flex-1 space-y-6">
                <div className="inline-block bg-white text-[#FF4F8B] font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wide mb-2 shadow-sm">
                  Oferta Limitada
                </div>
                <h2 className="font-['var(--font-just-hello)'] text-6xl md:text-7xl leading-none">
                  Promo Mini Escenográfica
                </h2>
                <div className="text-4xl font-extrabold pb-4 border-b border-white/30">
                  $500.000
                </div>

                <ul className="space-y-3 font-light text-lg">
                  <li className="flex items-center gap-2"><ArrowRightIcon className="h-5 w-5" /> Temáticas ya existentes a elección</li>
                  <li className="flex items-center gap-2"><ArrowRightIcon className="h-5 w-5" /> Ornamentación, globos, personajes y alfombras</li>
                  <li className="flex items-center gap-2"><ArrowRightIcon className="h-5 w-5" /> Bases alzadas para los dulces</li>
                  <li className="flex items-center gap-2 text-pink-100 font-medium"><ArrowRightIcon className="h-5 w-5" /> Torta de 2kg personalizada</li>
                  <li className="flex items-center gap-2"><ArrowRightIcon className="h-5 w-5" /> 20 cajitas golosineras (vacías)</li>
                  <li className="flex items-center gap-2"><ArrowRightIcon className="h-5 w-5" /> 12 cajitas mini candy</li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handlePromoPayment}
                    disabled={isProcessing}
                    className="flex-1 bg-white text-[#FF4F8B] py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Procesando...' : 'Pagar con Mercado Pago'}
                  </button>
                  <a
                    href="https://wa.me/5493855196364?text=Hola!%20Quiero%20reservar%20la%20Promo%20Mini%20Escenográfica%20de%20$500.000%20en%20efectivo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-transparent border-2 border-white text-white py-4 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center justify-center text-center"
                  >
                    Efectivo (WhatsApp)
                  </a>
                </div>
              </div>

              {/* Promo Image */}
              <div className="w-full md:w-1/2 lg:w-2/5">
                <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/promo.jpg"
                    alt="Promo Decoración"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
          ====================================================================
          SUSCRIPCIONES VIP (Eye-catching)
          ====================================================================
        */}
        <section className="relative w-full py-20 bg-[#FFF0F5] border-b border-pink-100">
          <div className="container px-4 md:px-8 mx-auto text-center">
            <h2 className="font-['var(--font-just-hello)'] text-6xl text-[#E11D62] mb-4">
              Membresías Exclusivas
            </h2>
            <p className="max-w-2xl mx-auto text-neutral-600 font-light mb-12">
              Únete a nuestros planes mensuales y obtén decoraciones increíbles garantizadas para tus eventos del año, a un precio preferencial y con Mercado Pago.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">

              {/* Bronce */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-pink-100 hover:shadow-xl transition-shadow flex flex-col">
                <h3 className="text-2xl font-bold text-neutral-800 mb-2">Bronce</h3>
                <div className="text-[#FF4F8B] font-extrabold text-3xl mb-4">$50.000 <span className="text-sm font-normal text-neutral-400">/ mes</span></div>
                <p className="text-neutral-500 mb-6 flex-1">Acceso a decoraciones base para eventos pequeños. Ideal para reuniones íntimas.</p>
                <Link href="/memberships" className="block text-center w-full py-3 bg-pink-50 text-[#FF4F8B] font-bold rounded-full hover:bg-pink-100 transition-colors">
                  Ver Detalles
                </Link>
              </div>

              {/* Oro */}
              <div className="bg-[#FF4F8B] rounded-[2rem] p-8 shadow-xl transform md:-translate-y-4 flex flex-col relative text-white">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Más Elegido
                </div>
                <h3 className="text-2xl font-bold mb-2">Oro</h3>
                <div className="font-extrabold text-3xl mb-4">$100.000 <span className="text-sm font-normal text-pink-200">/ mes</span></div>
                <p className="text-pink-100 mb-6 flex-1">Nivel intermedio con mobiliario completo y temáticas estandarizadas de alta calidad.</p>
                <Link href="/memberships" className="block text-center w-full py-3 bg-white text-[#FF4F8B] font-bold rounded-full hover:bg-pink-50 transition-colors shadow-md">
                  Suscribirse
                </Link>
              </div>

              {/* Diamante */}
              <div className="bg-[#111] text-white rounded-[2rem] p-8 shadow-lg flex flex-col border border-neutral-800">
                <h3 className="text-2xl font-bold mb-2">Diamante</h3>
                <div className="font-extrabold text-3xl mb-4">$150.000 <span className="text-sm font-normal text-neutral-400">/ mes</span></div>
                <p className="text-neutral-400 mb-6 flex-1">Decoración Premium y Escenográfica. Haz que tu evento sea completamente inolvidable.</p>
                <Link href="/memberships" className="block text-center w-full py-3 bg-neutral-800 text-white font-bold rounded-full hover:bg-neutral-700 transition-colors">
                  Descubrir
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* 
          ====================================================================
          BENTO GRID / SERVICES (Reference Image Style + Photos)
          ====================================================================
        */}
        <section className="relative w-full py-20 bg-white">
          <div className="container px-4 md:px-8 mx-auto text-center flex flex-col items-center">

            <h1 className="font-['var(--font-just-hello)'] text-6xl md:text-8xl text-[#E11D62] mb-6">
              Mis servicios
            </h1>

            <p className="max-w-3xl mx-auto text-neutral-700 text-lg md:text-xl font-light mb-16 leading-relaxed">
              Cada servicio está diseñado con amor, creatividad y atención al detalle, acompañándote en cada paso para que tu fiesta soñada se haga realidad.
            </p>

            {/* 
              ====================================================================
              BENTO GRID / SERVICES (Reference Image Style + Photos)
              ====================================================================
            */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">

              {/* Servicio Integral (Large Pink Card) */}
              <div className="lg:col-span-2 relative bg-[#FF4F8B] rounded-[2rem] overflow-hidden shadow-lg flex flex-col md:flex-row group">
                <div className="absolute right-0 top-0 w-64 h-full">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-[60px]"></div>
                </div>

                <div className="p-10 md:p-12 flex-1 relative z-10 flex flex-col justify-center text-white">
                  <h2 className="font-['var(--font-just-hello)'] text-5xl mb-4">Servicio integral</h2>
                  <p className="text-pink-100 text-lg mb-8 max-w-[280px]">
                    Nos encargamos de todo para que solo te ocupes de disfrutar.
                  </p>
                  <Link href="/memberships" className="inline-flex w-fit items-center gap-2 bg-white text-[#FF4F8B] px-6 py-2.5 rounded-full font-semibold hover:bg-pink-50 transition-colors shadow-sm">
                    ver más <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                <div className="w-full md:w-2/5 md:min-h-[350px] relative overflow-hidden">
                  <Image src="/decoraciones/1.jpg" alt="Servicio Integral" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF4F8B] to-transparent md:w-24"></div>
                </div>
              </div>

              {/* Mesas Temáticas (Light Pink Card) */}
              <div className="relative bg-[#FDE2EC] rounded-[2rem] overflow-hidden shadow-sm flex flex-col group">
                {/* Decorative wave border on the right (simulated with shapes) */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-20">
                  <div className="w-16 h-16 bg-[#E11D62] rounded-full"></div>
                  <div className="w-16 h-16 bg-[#E11D62] rounded-full"></div>
                  <div className="w-16 h-16 bg-[#E11D62] rounded-full"></div>
                </div>

                <div className="h-48 relative overflow-hidden">
                  <Image src="/decoraciones/2.jpg" alt="Mesas Temáticas" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-10">
                  <h2 className="font-['var(--font-just-hello)'] text-4xl text-[#E11D62] mb-3 leading-none">Mesas<br />temáticas</h2>
                  <p className="text-neutral-700 mb-6 flex-1">
                    Estandar, intermedias, premium y escenografias.
                  </p>
                  <Link href="#galeria" className="inline-flex w-fit items-center gap-2 bg-white border border-neutral-200 text-neutral-800 px-6 py-2 rounded-full font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                    ver más <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Mobiliario (Light Pink Card) */}
              <div className="relative bg-[#FDE2EC] rounded-[2rem] overflow-hidden shadow-sm flex flex-col group">
                {/* Decorative background cross pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="absolute inset-0 border-[16px] border-white rounded-xl rotate-45 scale-150 transform origin-center"></div>
                </div>

                <div className="h-48 relative overflow-hidden">
                  <Image src="/decoraciones/3.jpg" alt="Mobiliario" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                <div className="p-8 flex flex-col flex-1 relative z-10">
                  <h2 className="font-['var(--font-just-hello)'] text-4xl text-[#E11D62] mb-4">Mobiliario</h2>
                  <p className="text-neutral-700 mb-6 flex-1">
                    Paneles, mesas, bases, bandejas, centro de mesas, etc.
                  </p>
                  <Link href="#tienda" className="inline-flex w-fit items-center gap-2 bg-white border border-neutral-200 text-neutral-800 px-6 py-2 rounded-full font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                    ver más <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Capacitaciones & Asesorías (Wide Light Pink Card) */}
              <div className="lg:col-span-2 relative bg-[#FDE2EC] rounded-[2rem] overflow-hidden shadow-sm flex flex-col md:flex-row-reverse group">
                {/* Decorative background circles */}
                <div className="absolute bottom-0 right-0 w-64 h-64 grid grid-cols-2 grid-rows-2 gap-2 opacity-10 rotate-12 translate-x-12 translate-y-12">
                  <div className="bg-white rounded-full"></div><div className="bg-white rounded-full"></div>
                  <div className="bg-white rounded-full"></div><div className="bg-white rounded-full"></div>
                </div>

                <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden">
                  <Image src="/decoraciones/4.jpg" alt="Capacitaciones" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#FDE2EC] to-transparent md:w-16 left-0 right-auto h-full"></div>
                </div>

                <div className="p-10 md:p-12 flex-1 relative z-10 flex flex-col justify-center">
                  <h2 className="font-['var(--font-just-hello)'] text-5xl text-[#E11D62] mb-4">Capacitaciones & Asesorías</h2>
                  <p className="text-neutral-700 text-lg mb-8 max-w-sm">
                    Compartimos nuestra experiencia con quienes quieren crecer en el mundo de los eventos.
                  </p>
                  <Link href="#contacto" className="inline-flex w-fit items-center gap-2 bg-white border border-neutral-200 text-neutral-800 px-6 py-2.5 rounded-full font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
                    ver más <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 
          ====================================================================
          MÁS IMÁGENES / GALERÍA INSPIRACIONAL (Doble Slider Pink Theme)
          ====================================================================
        */}
        <section id="galeria" className="w-full py-20 bg-white overflow-hidden border-t border-pink-50">
          <div className="container px-4 mx-auto text-center mb-12">
            <h2 className="font-['var(--font-just-hello)'] text-6xl text-[#E11D62] mb-4">
              Nuestra Magia
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Explora una pequeña muestra de las decoraciones de ensueño que hemos creado.
            </p>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes slide-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
            @keyframes slide-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
            .animate-slide-left { animation: slide-left 40s linear infinite; }
            .animate-slide-right { animation: slide-right 40s linear infinite; }
            .pause-hover:hover { animation-play-state: paused; }
          `}} />

          {/* Slider Arriba */}
          <div className="relative flex w-full overflow-hidden py-4 mb-4">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-[200%] animate-slide-left pause-hover items-center">
              {[5, 6, 7, 8, 9, 5, 6, 7, 8, 9].map((num, idx) => (
                <div key={`top-${idx}`} className="relative w-72 md:w-[24rem] h-64 md:h-72 mx-3 rounded-[2rem] overflow-hidden shadow-md flex-shrink-0 group cursor-pointer border-[4px] border-[#FFF0F5]">
                  <Image
                    src={`/decoraciones/${num}.jpg`}
                    alt={`Decoración ${num}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#FF4F8B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Abajo */}
          <div className="relative flex w-full overflow-hidden py-4 -translate-x-12">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-[200%] animate-slide-right pause-hover items-center">
              {[10, 1, 2, 3, 4, 10, 1, 2, 3, 4].map((num, idx) => (
                <div key={`bottom-${idx}`} className="relative w-72 md:w-[24rem] h-64 md:h-72 mx-3 rounded-[2rem] overflow-hidden shadow-md flex-shrink-0 group cursor-pointer border-[4px] border-[#FFF0F5]">
                  <Image
                    src={`/decoraciones/${num}.jpg`}
                    alt={`Decoración ${num}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#FF4F8B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/5493855196364" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50">
        <WhatsAppIcon className="h-8 w-8" />
      </a>

      {/* 
        ====================================================================
        FOOTER (Pink Theme)
        ====================================================================
      */}
      <footer className="w-full py-12 px-6 bg-[#FFF0F5] border-t border-pink-100 text-neutral-600">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative h-20 w-48">
              <Image
                src="/logo.png"
                alt="Floripondio Logo"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
            <p className="text-sm max-w-xs">
              Decoraciones y ambientaciones únicas llenas de amor y detalles para tus celebraciones.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-[#FF4F8B] mb-4 uppercase tracking-wider text-sm">Navegación</h4>
            <ul className="space-y-3">
              <li><Link href="#nosotros" className="hover:text-[#E11D62] transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="#servicios" className="hover:text-[#E11D62] transition-colors">Servicios</Link></li>
              <li><Link href="#galeria" className="hover:text-[#E11D62] transition-colors">Galería</Link></li>
              <li><Link href="/memberships" className="hover:text-[#E11D62] transition-colors">Suscripciones VIP</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-[#FF4F8B] mb-4 uppercase tracking-wider text-sm">Contacto</h4>
            <ul className="space-y-3">
              <li>+54 9 3855-196364</li>
              <li>info@floripondio.com</li>
              <li>Moreno Norte 285 esquina Formosa<br />Santiago del Estero</li>
            </ul>
          </div>

        </div>

        <div className="container mx-auto mt-12 pt-6 border-t border-pink-200 text-center text-sm">
          © {new Date().getFullYear()} Floripondio. Todos los derechos reservados.
        </div>
      </footer>
    </div >
  );
}

// Hero Slider Component
function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/decoraciones/10.jpg',
      title: 'Ambientaciones Mágicas',
      subtitle: 'Transformamos tu visión en una realidad sorprendente.',
      buttonText: 'Ver Servicios',
      buttonLink: '#servicios'
    },
    {
      image: '/decoraciones/8.jpg',
      title: 'Suscripciones VIP',
      subtitle: 'Planes mensuales para tener beneficios exclusivos en decoraciones todo el año.',
      buttonText: 'Elegir Plan',
      buttonLink: '/memberships'
    },
    {
      image: '/decoraciones/5.jpg',
      title: 'Momentos Únicos',
      subtitle: 'El límite es la imaginación. Creamos celebraciones que quedarán para siempre.',
      buttonText: 'Nuestra Galería',
      buttonLink: '#galeria'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // changes every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover brightness-[0.65]"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF4F8B]/40 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-['var(--font-just-hello)'] text-white mb-4 drop-shadow-xl transform transition-transform duration-700 translate-y-0">
              {slide.title}
            </h2>
            <p className="text-white md:text-2xl font-light mb-8 max-w-2xl drop-shadow-md">
              {slide.subtitle}
            </p>
            <Link
              href={slide.buttonLink}
              className="px-8 py-3 bg-[#FF4F8B] text-white rounded-full font-bold uppercase tracking-wider shadow-lg hover:bg-pink-600 hover:scale-105 transition-all"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Icons
function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function WhatsAppIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
