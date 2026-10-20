import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, Clock, MessageCircle } from 'lucide-react';

export function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById('cardapio-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-white/[0.06] bg-[#070709]">
      {/* Subtle Ambient Warm Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[320px] bg-[#FF7A00]/12 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-7 sm:py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left Column: Brand Story & Primary Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left min-w-0">
            {/* Unboxed Clean Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-[#FF7A00] tracking-wide mb-2.5">
              <span>Passo Fundo, RS</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-300">Massa crocante frita na hora</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400">Tamanhos P, M e G</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight uppercase text-white leading-[1.03] mb-3.5 sm:mb-4 break-words"
              style={{ textWrap: 'balance' }}
            >
              O Pastel Mais <span className="text-[#FF7A00]">Recheado e Crocante</span> na Sua Casa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
              className="text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-5 sm:mb-6"
            >
              Escolha seu sabor favorito nos tamanhos <strong className="text-white font-semibold">P, M ou G</strong>, adicione ingredientes extras e envie seu pedido direto para nosso WhatsApp em segundos.
            </motion.p>

            {/* Primary CTA & Quick Highlights */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={scrollToMenu}
                className="min-h-[48px] px-6 py-3.5 bg-[#FF7A00] hover:bg-[#FF8C1A] text-black font-display font-black uppercase tracking-wider text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(255,122,0,0.3)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Fazer Meu Pedido</span>
                <ArrowDown size={18} strokeWidth={2.5} className="shrink-0" />
              </button>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-xs text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Flame size={14} className="text-[#FF7A00] shrink-0" />
                  <span>Frito na hora</span>
                </span>
                <span className="text-zinc-700" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FF7A00] shrink-0" />
                  <span>30–50 min</span>
                </span>
                <span className="text-zinc-700" aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-[#FF7A00] shrink-0" />
                  <span>WhatsApp</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Appetizing Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div
              onClick={scrollToMenu}
              className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#111115] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] shadow-2xl cursor-pointer"
            >
              <img
                src="/frangocalabresaqueijo.jpg"
                alt="Pastel dourado e super recheado da Pastelarica"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Measured Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Bottom Caption Inside Showcase */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#FF7A00] tracking-wide mb-0.5">
                    14 Sabores Artesanais + Adicionais
                  </p>
                  <p className="font-display text-lg sm:text-xl font-black text-white leading-tight">
                    A partir de <span className="text-[#FF7A00] tabular-nums">R$ 15,00</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

