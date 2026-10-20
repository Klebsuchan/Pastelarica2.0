import React, { useState } from 'react';
import { Product, Category, PastelSize } from '../types';
import { motion } from 'motion/react';
import { HeroSection } from './HeroSection';
import { Search, X, Plus, Sparkles, UtensilsCrossed } from 'lucide-react';

interface ProductListProps {
  categories: Category[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function ProductList({
  categories,
  products,
  onAddToCart,
  searchQuery = '',
  onSearchChange,
}: ProductListProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PastelSize>>({});
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const getSelectedSize = (productId: string): PastelSize => {
    return selectedSizes[productId] || 'P';
  };

  const handleSelectSize = (productId: string, size: PastelSize) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product: Product) => {
    if (product.prices) {
      const size = getSelectedSize(product.id);
      const sizePrice = product.prices[size] ?? product.price;
      onAddToCart({
        ...product,
        id: `${product.id}-${size}`,
        name: `${product.name} (Tam. ${size})`,
        price: sizePrice,
      });
    } else {
      onAddToCart(product);
    }
  };

  const visibleCategories =
    activeCategoryId === 'all'
      ? categories
      : categories.filter(c => c.id === activeCategoryId);

  return (
    <div className="w-full flex flex-col">
      <HeroSection />

      {/* Main Menu Container */}
      <div id="cardapio-section" className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-6 sm:pt-10 pb-28 w-full">
        {/* Search & Category Filter Bar */}
        <div className="mb-7 sm:mb-10 space-y-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Interactive Segmented Category Controls - 2x2 grid on mobile so zero tabs get cut off */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 p-1.5 bg-[#111115] border border-white/[0.07] rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                  activeCategoryId === 'all'
                    ? 'bg-[#FF7A00] text-black shadow-sm font-extrabold'
                    : 'text-zinc-300 hover:text-white bg-white/[0.02] sm:bg-transparent'
                }`}
              >
                Todos ({products.length})
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                const isActive = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`min-h-[42px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-[#FF7A00] text-black shadow-sm font-extrabold'
                        : 'text-zinc-300 hover:text-white bg-white/[0.02] sm:bg-transparent'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange?.(e.target.value)}
                placeholder="Buscar pastel ou ingrediente..."
                className="w-full min-h-[46px] bg-[#111115] border border-white/[0.08] rounded-2xl pl-11 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg text-zinc-400 hover:text-white"
                  aria-label="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty Search State */}
        {products.length === 0 && (
          <div className="py-16 px-4 text-center rounded-3xl bg-[#0D0D11] border border-white/[0.06] max-w-lg mx-auto my-6">
            <UtensilsCrossed className="w-10 h-10 text-[#FF7A00] mx-auto mb-3 opacity-80" />
            <h3 className="font-display text-xl font-bold text-white mb-1">
              Nenhum item encontrado
            </h3>
            <p className="text-sm text-zinc-400 mb-5">
              Não encontramos sabores para "{searchQuery}". Tente outro termo ou veja todo o cardápio.
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange?.('');
                  setActiveCategoryId('all');
                }}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#FF7A00] text-black font-bold text-sm cursor-pointer"
              >
                Limpar filtro
              </button>
            )}
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-10 sm:space-y-16">
          {visibleCategories.map(category => {
            const categoryProducts = products.filter(p => p.categoryId === category.id);
            if (categoryProducts.length === 0) return null;

            const isAddonsCategory =
              category.name.toLowerCase().includes('adicion') ||
              categoryProducts.every(p => !p.prices);

            return (
              <section
                key={category.id}
                id={`cat-${category.id}`}
                className="scroll-mt-20"
              >
                {/* Section Header */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 sm:mb-6 pb-3 border-b border-white/[0.07]">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                      {category.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      {isAddonsCategory
                        ? 'Deixe seu pastel ainda mais recheado com nossos adicionais'
                        : 'Toque no tamanho P, M ou G e adicione à sua sacola'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap shrink-0 tabular-nums">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'opção' : 'opções'}
                  </span>
                </div>

                {/* Addons Compact Touch Grid vs Main Pastel Grid */}
                {isAddonsCategory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {categoryProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.25, delay: 0.03 * (idx % 6) }}
                        className="bg-[#0E0E12] border border-white/[0.07] hover:border-[#FF7A00]/40 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all group"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00] shrink-0 mt-0.5 sm:mt-0">
                            <Sparkles size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-zinc-500 tabular-nums">
                                {String(idx + 1).padStart(2, '0')}.
                              </span>
                              <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug break-words">
                                {product.name}
                              </h3>
                            </div>
                            {product.description && (
                              <p className="text-xs text-zinc-400 mt-0.5 leading-snug break-words">
                                {product.description}
                              </p>
                            )}
                            <p className="font-display font-black text-sm sm:text-base text-[#FF7A00] tabular-nums mt-1">
                              + R$ {product.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FF7A00] sm:bg-white/[0.06] hover:bg-[#FF7A00] text-black sm:text-white hover:text-black font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                          <Plus size={15} strokeWidth={2.5} />
                          <span>Incluir</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categoryProducts.map((product, idx) => {
                      const activeSize = getSelectedSize(product.id);
                      const displayPrice = product.prices
                        ? product.prices[activeSize] ?? product.price
                        : product.price;
                      const hasValidImage = product.imageUrl && !failedImages[product.id];

                      return (
                        <motion.article
                          key={product.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 0.3, delay: 0.04 * (idx % 3) }}
                          className="bg-[#0D0D11] border border-white/[0.08] hover:border-[#FF7A00]/45 rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                        >
                          {/* Product Visual Header */}
                          <div className="relative aspect-[16/10] w-full bg-[#09090D] overflow-hidden">
                            {hasValidImage ? (
                              <>
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  onError={() =>
                                    setFailedImages(prev => ({ ...prev, [product.id]: true }))
                                  }
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-black/20 to-transparent" />
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#070709] to-[#0D0D11] p-4">
                                <img
                                  src="/pastelarica.png"
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-24 h-24 object-contain mix-blend-lighten opacity-90"
                                />
                              </div>
                            )}

                            {/* Editorial Flavor Number */}
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-display font-bold text-zinc-200 tabular-nums">
                              #{String(idx + 1).padStart(2, '0')}
                            </div>
                          </div>

                          {/* Card Content & Interactive Controls */}
                          <div className="p-4 sm:p-5 flex flex-col flex-1">
                            <div className="mb-3.5">
                              <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-[#FF7A00] transition-colors leading-snug break-words">
                                {product.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 leading-relaxed break-words">
                                {product.description ||
                                  'Massa crocante frita na hora e recheio generoso preparado com ingredientes selecionados.'}
                              </p>
                            </div>

                            {/* Interactive Size Selector (P / M / G) */}
                            {product.prices && (
                              <div className="mt-auto pt-1 mb-4">
                                <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                                  <span className="font-semibold">Escolha o tamanho:</span>
                                  <span className="text-[#FF7A00] font-bold whitespace-nowrap">
                                    Tam. {activeSize}
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#14141B] rounded-2xl border border-white/[0.06]">
                                  {(['P', 'M', 'G'] as PastelSize[]).map(size => {
                                    const isSelected = activeSize === size;
                                    const sizePrice = product.prices![size];
                                    return (
                                      <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSelectSize(product.id, size)}
                                        className={`min-h-[48px] py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                          isSelected
                                            ? 'bg-[#FF7A00] text-black font-black shadow-[0_4px_14px_rgba(255,122,0,0.3)]'
                                            : 'text-zinc-300 hover:text-white hover:bg-white/[0.04] font-semibold'
                                        }`}
                                      >
                                        <span className="text-[11px] sm:text-xs font-display uppercase tracking-wider whitespace-nowrap">
                                          Tam. {size}
                                        </span>
                                        <span
                                          className={`text-[11px] sm:text-xs tabular-nums whitespace-nowrap ${
                                            isSelected
                                              ? 'text-black font-extrabold'
                                              : 'text-[#FF7A00] font-bold'
                                          }`}
                                        >
                                          R$ {sizePrice.toFixed(2).replace('.', ',')}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Contiguous Purchase Bar */}
                            <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-white/[0.07] mt-auto">
                              <div className="min-w-0">
                                <span className="block text-[11px] text-zinc-400 font-medium">
                                  {product.prices ? `Valor (Tam. ${activeSize})` : 'Valor unitário'}
                                </span>
                                <span className="font-display font-black text-xl sm:text-2xl text-white tabular-nums whitespace-nowrap">
                                  R$ {displayPrice.toFixed(2).replace('.', ',')}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAdd(product)}
                                className="min-h-[46px] px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#FF8C1A] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(255,122,0,0.25)] active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <Plus size={17} strokeWidth={2.8} />
                                <span>Adicionar</span>
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}


