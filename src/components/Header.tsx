import React from 'react';
import { ShoppingBag, Settings, ArrowLeft } from 'lucide-react';

const logoUrl = '/pastelarica.png';

interface HeaderProps {
  cartItemCount: number;
  cartTotal?: number;
  onOpenCart: () => void;
  onNavigate: (view: 'home' | 'admin') => void;
  currentView?: 'home' | 'admin';
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({
  cartItemCount,
  cartTotal = 0,
  onOpenCart,
  onNavigate,
  currentView = 'home',
}: HeaderProps) {
  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-[#070709]/90 backdrop-blur-xl px-3.5 sm:px-6 h-16 sm:h-20 sticky top-0 z-40 border-b border-white/[0.07] flex items-center">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Logo & Wordmark (Seamless, no square cutout box) */}
        <button
          type="button"
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none min-w-0 shrink-0"
        >
          <img
            src={logoUrl}
            alt="Pastelarica Logo"
            referrerPolicy="no-referrer"
            className="h-11 w-11 sm:h-14 sm:w-14 object-contain mix-blend-lighten transition-transform duration-200 group-hover:scale-105 shrink-0"
          />
          <span className="font-display text-xl sm:text-3xl font-black italic tracking-tighter uppercase text-white whitespace-nowrap">
            PASTELA<span className="text-[#FF7A00]">RICA</span>
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-zinc-400">
          <button
            type="button"
            onClick={() => scrollToSection('cardapio-section')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cardápio
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cat-1')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Salgados
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cat-2')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Doces
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cat-3')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Adicionais
          </button>
          <button
            type="button"
            onClick={() => onNavigate(currentView === 'admin' ? 'home' : 'admin')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' ? 'text-[#FF7A00]' : 'hover:text-white'
            }`}
          >
            {currentView === 'admin' ? 'Voltar à Loja' : 'Painel Admin'}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(currentView === 'admin' ? 'home' : 'admin')}
            className="md:hidden min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white active:scale-95 transition-all"
            title={currentView === 'admin' ? 'Voltar ao Cardápio' : 'Área do Administrador'}
            aria-label={currentView === 'admin' ? 'Voltar ao Cardápio' : 'Área do Administrador'}
          >
            {currentView === 'admin' ? <ArrowLeft size={19} /> : <Settings size={19} />}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative min-h-[42px] sm:min-h-[44px] px-3 sm:px-4 py-2 bg-[#FF7A00] hover:bg-[#FF8C1A] text-black rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_8px_24px_rgba(255,122,0,0.28)] active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag size={18} strokeWidth={2.4} className="shrink-0" />
            <span className="font-extrabold tracking-tight">
              {cartItemCount > 0 ? (
                <span className="tabular-nums">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              ) : (
                <span>Sacola</span>
              )}
            </span>
            {cartItemCount > 0 && (
              <span className="bg-black text-[#FF7A00] text-[11px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-lg tabular-nums">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

