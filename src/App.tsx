import React, { useState } from 'react';
import { useStore } from './store';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { PolicyModal } from './components/PolicyModal';
import { CartItem, Product } from './types';
import toast, { Toaster } from 'react-hot-toast';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function App() {
  const {
    products,
    categories,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings,
  } = useStore();

  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePolicy, setActivePolicy] = useState<'cookies' | 'privacy' | 'delivery' | null>(null);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    toast.success(`${product.name} adicionado à sacola!`, {
      style: {
        background: '#121218',
        color: '#fff',
        border: '1px solid rgba(255,122,0,0.35)',
        borderRadius: '16px',
        fontWeight: 700,
        fontSize: '13px',
      },
      iconTheme: {
        primary: '#FF7A00',
        secondary: '#000',
      },
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const addonProducts = products.filter(p => !p.prices);

  return (
    <div className="min-h-screen bg-[#070709] text-white font-sans flex flex-col relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          cartItemCount={totalCartItems}
          cartTotal={totalCartPrice}
          onOpenCart={() => setIsCartOpen(true)}
          onNavigate={setView}
          currentView={view}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSearch={view === 'home'}
        />

        <main className="flex-1">
          {view === 'home' ? (
            <ProductList
              categories={categories}
              products={products.filter(
                p =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (p.description &&
                    p.description.toLowerCase().includes(searchQuery.toLowerCase()))
              )}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          ) : (
            <AdminPanel
              products={products}
              categories={categories}
              settings={settings}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onUpdateSettings={updateSettings}
            />
          )}
        </main>

        {/* Mobile Floating Bottom Cart Bar (Thumb-Zone Ergonomics) */}
        {view === 'home' && totalCartItems > 0 && !isCartOpen && (
          <div className="fixed bottom-3 inset-x-3 z-30 md:hidden">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full min-h-[56px] px-3.5 py-2.5 rounded-2xl bg-[#FF7A00] text-black shadow-[0_12px_32px_rgba(255,122,0,0.4)] flex items-center justify-between gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-black text-[#FF7A00] font-display font-black text-sm flex items-center justify-center tabular-nums shrink-0">
                  {totalCartItems}
                </div>
                <div className="text-left min-w-0">
                  <span className="block font-display font-black text-xs sm:text-sm uppercase tracking-wide leading-tight">
                    Ver Sacola e Pedir
                  </span>
                  <span className="block text-[11px] font-bold text-black/75 leading-tight">
                    Concluir no WhatsApp
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-display font-black text-sm sm:text-base tabular-nums whitespace-nowrap shrink-0">
                <span>R$ {totalCartPrice.toFixed(2).replace('.', ',')}</span>
                <ChevronRight size={18} strokeWidth={2.8} />
              </div>
            </button>
          </div>
        )}

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onAddToCart={handleAddToCart}
          addons={addonProducts}
          settings={settings}
        />

        <footer className="bg-[#050507] pt-12 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-14 border-t border-white/[0.06] mt-auto relative z-20">
          <div className="max-w-6xl mx-auto px-5 flex flex-col items-center">
            {/* Branding & Logo (Seamless without square cutout) */}
            <div className="flex flex-col items-center text-center mb-8">
              <img
                src="/pastelarica.png"
                alt="Pastelarica Logo"
                referrerPolicy="no-referrer"
                className="h-20 w-20 object-contain mix-blend-lighten mb-2"
              />
              <p className="font-display text-white font-black text-xl italic tracking-tight uppercase mb-1">
                Pastela<span className="text-[#FF7A00]">rica</span>
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto">
                O melhor pastel de Passo Fundo. Crocante por fora, incrivelmente recheado por dentro.
              </p>
            </div>

            {/* Policies Selection */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-zinc-400 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActivePolicy('cookies')}
                className="hover:text-[#FF7A00] transition-colors cursor-pointer"
              >
                Política de Cookies
              </button>
              <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-[#FF7A00] transition-colors cursor-pointer"
              >
                Política de Privacidade
              </button>
              <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setActivePolicy('delivery')}
                className="hover:text-[#FF7A00] transition-colors cursor-pointer"
              >
                Política de Delivery
              </button>
            </div>

            {/* Hairline Divider */}
            <div className="w-full max-w-lg h-[1px] bg-white/[0.06] mb-8" />

            {/* Credits and Admin Link */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-4 text-center md:text-left text-xs text-zinc-500">
              <div>
                <p>© {new Date().getFullYear()} Pastelarica Delivery. Todos os direitos reservados.</p>
                <p className="mt-1 text-zinc-500">
                  Desenvolvedor{' '}
                  <a
                    href="https://portfolio-braian-three.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF7A00] hover:underline font-bold transition-colors"
                  >
                    Braian Kmdc
                  </a>
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="min-h-[40px] px-4 py-2 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-[#FF7A00] transition-all font-semibold text-xs rounded-xl border border-white/[0.07] cursor-pointer"
                >
                  Área do Administrador
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} />

      <Toaster position="top-center" toastOptions={{ duration: 2200 }} />
    </div>
  );
}

