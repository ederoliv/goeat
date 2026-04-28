import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#19766D] text-white pt-12 pb-6 px-6 mt-auto w-full z-10 relative">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center font-bold text-2xl tracking-tight mb-4">
              <img src="/assets/icon.svg" alt="GoEat Logo" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              O melhor aplicativo para encontrar seus restaurantes favoritos, com as melhores promoções e entregas mais rápidas da região.
            </p>
          </div>

          {/* Links Section 1 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">GoEat</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Imprensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Descubra</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Restaurantes Parceiros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seja um Entregador</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cidades Atendidas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cupons e Ofertas</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Siga-nos</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:-translate-y-1 transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/80 text-sm text-center md:text-left">
            © {new Date().getFullYear()} GoEat. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
