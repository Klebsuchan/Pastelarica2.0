import React, { useState } from 'react';
import { X, Plus, Minus, Send, Trash2, ShoppingBag, Sparkles, MapPin, User, CreditCard } from 'lucide-react';
import { CartItem, Product, StoreSettings } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onAddToCart?: (product: Product) => void;
  addons?: Product[];
  settings: StoreSettings;
}

const PAYMENT_OPTIONS = [
  { id: 'Pix', label: 'Pix', detail: 'Rápido' },
  { id: 'Cartão de Crédito - Maquininha', label: 'Crédito', detail: 'Maquininha' },
  { id: 'Cartão de Débito - Maquininha', label: 'Débito', detail: 'Maquininha' },
  { id: 'Dinheiro', label: 'Dinheiro', detail: 'Na entrega' },
];

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onAddToCart,
  addons = [],
  settings,
}: CartDrawerProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reference, setReference] = useState('');
  const [payment, setPayment] = useState('Pix');

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    let message = `*Novo Pedido - Pastelarica* 🥟\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Telefone:* ${phone}\n\n`;
    message += `*Endereço de Entrega:*\n`;
    message += `*Rua/Número:* ${street}\n`;
    message += `*Bairro:* ${neighborhood}\n`;
    if (reference) {
      message += `*Ponto de Referência:* ${reference}\n`;
    }
    message += `\n*Pagamento:* ${payment}\n\n`;
    message += `*Pedido:*\n`;

    cartItems.forEach(item => {
      message += `${item.quantity}x ${item.product.name} - R$ ${(item.product.price * item.quantity)
        .toFixed(2)
        .replace('.', ',')}\n`;
    });

    message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')} + taxa de entrega\n`;
    message += `_(A taxa de entrega será combinada com o entregador)_`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0B0B0F] z-50 shadow-2xl flex flex-col border-l border-white/[0.08] overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-[#070709] px-5 py-4 flex justify-between items-center shrink-0 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-black uppercase tracking-tight text-white">
                Sua Sacola
              </h2>
              <p className="text-xs text-zinc-400 tabular-nums">
                {totalCount === 0
                  ? 'Nenhum item selecionado'
                  : `${totalCount} ${totalCount === 1 ? 'item adicionado' : 'itens adicionados'}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/[0.06] rounded-xl transition-colors text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Fechar sacola"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-6 custom-scroll">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-zinc-400 flex-col gap-4 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-white mb-1">
                  Sua sacola está vazia
                </p>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Escolha seus pastéis nos tamanhos P, M ou G e adicione à sacola para fazer seu pedido.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#FF7A00] text-black font-display font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Ver Cardápio
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-[#121218] p-3.5 rounded-2xl border border-white/[0.07] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/25 flex items-center justify-center text-[#FF7A00] shrink-0">
                          <Sparkles size={18} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-sm text-white leading-snug break-words">
                          {item.product.name}
                        </h4>
                        <p className="font-display font-black text-[#FF7A00] text-sm mt-0.5 tabular-nums">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    {/* Touch-friendly Quantity Stepper */}
                    <div className="flex items-center gap-1 bg-[#08080B] rounded-xl p-1 border border-white/[0.07] shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                        aria-label="Diminuir quantidade"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={15} className="text-red-400" />
                        ) : (
                          <Minus size={15} />
                        )}
                      </button>
                      <span className="font-display font-bold text-sm w-6 text-center text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center text-[#FF7A00] hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Upsell: Adicionais Strip (Wrapped so nothing is clipped on mobile) */}
              {addons.length > 0 && onAddToCart && (
                <div className="bg-[#111116] border border-white/[0.07] rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-display font-bold uppercase tracking-wider text-[#FF7A00]">
                      Turbine seu pastel (Adicionais)
                    </span>
                    <span className="text-[11px] text-zinc-500">Toque para incluir</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {addons.map(addon => (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => onAddToCart(addon)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#181820] hover:bg-[#FF7A00] text-zinc-200 hover:text-black border border-white/[0.07] transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                      >
                        <Plus size={14} className="text-[#FF7A00] shrink-0" />
                        <span>{addon.name}</span>
                        <span className="font-bold tabular-nums opacity-80">
                          R$ {addon.price.toFixed(2).replace('.', ',')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checkout Form */}
              <form
                onSubmit={handleCheckout}
                className="bg-[#111116] p-5 rounded-3xl border border-white/[0.08] space-y-5"
              >
                <div className="border-b border-white/[0.07] pb-3">
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-white">
                    Dados para Entrega
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Preencha para enviar o pedido pronto no WhatsApp
                  </p>
                </div>

                {/* Personal Info */}
                <div className="space-y-3.5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
                      <User size={13} className="text-[#FF7A00]" />
                      <span>Seu Nome</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full min-h-[46px] bg-[#09090C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      placeholder="Ex: João Silva"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Telefone / WhatsApp
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full min-h-[46px] bg-[#09090C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      placeholder="(54) 99999-9999"
                    />
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-3.5 pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
                      <MapPin size={13} className="text-[#FF7A00]" />
                      <span>Rua e Número</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full min-h-[46px] bg-[#09090C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                      placeholder="Ex: Rua Morom, 1230 - Apto 201"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Bairro
                      </label>
                      <input
                        required
                        type="text"
                        value={neighborhood}
                        onChange={e => setNeighborhood(e.target.value)}
                        className="w-full min-h-[46px] bg-[#09090C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                        placeholder="Ex: Centro / Boqueirão"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Referência (Opcional)
                      </label>
                      <input
                        type="text"
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                        className="w-full min-h-[46px] bg-[#09090C] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
                        placeholder="Próximo a..."
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Payment Selector */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-2">
                    <CreditCard size={13} className="text-[#FF7A00]" />
                    <span>Forma de Pagamento</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_OPTIONS.map(opt => {
                      const active = payment === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPayment(opt.id)}
                          className={`min-h-[46px] p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                            active
                              ? 'bg-[#FF7A00]/15 border-[#FF7A00] text-white'
                              : 'bg-[#09090C] border-white/[0.08] text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold leading-tight">{opt.label}</span>
                          <span className="text-[10px] text-zinc-400">{opt.detail}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary & Submit CTA */}
                <div className="pt-4 border-t border-white/[0.08] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>Taxa de Entrega</span>
                      <span>Combinada no WhatsApp</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-display font-bold text-sm uppercase text-zinc-200">
                        Total dos Itens
                      </span>
                      <span className="font-display text-2xl font-black text-[#FF7A00] tabular-nums">
                        R$ {total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[52px] bg-[#FF7A00] hover:bg-[#FF8C1A] text-black px-5 py-3.5 rounded-2xl font-display font-black flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all uppercase tracking-wider text-sm shadow-[0_10px_28px_rgba(255,122,0,0.3)] cursor-pointer"
                  >
                    <Send size={18} strokeWidth={2.5} />
                    <span>Enviar Pedido no WhatsApp</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

