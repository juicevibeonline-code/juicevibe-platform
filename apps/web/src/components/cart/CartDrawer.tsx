"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Minus, Plus, Trash2, ShoppingBag, ArrowRight,
  CheckCircle2, Phone, User, Loader2, ChevronLeft, MessageSquare
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Step = "cart" | "checkout" | "success";

interface CheckoutForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  type: "pickup" | "dine_in";
  paymentMethod: "cash" | "card";
  notes: string;
}

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotals, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    type: "pickup",
    paymentMethod: "cash",
    notes: "",
  });

  const { subtotal, count } = getTotals();
  const tax = subtotal * 0.05; // API uses 5%
  const total = subtotal + tax;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) {
      // Reset step when drawer closes (small delay for animation)
      const t = setTimeout(() => setStep("cart"), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!mounted) return null;

  const handleCheckout = async () => {
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError("Name and phone number are required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        type: form.type,
        paymentMethod: form.paymentMethod,
        notes: form.notes || undefined,
        items: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      setOrderNumber(order.orderNumber);
      clearCart();
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                {step === "checkout" && (
                  <button onClick={() => setStep("cart")} className="mr-1 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading font-extrabold text-dark-green">
                  {step === "cart" ? "Your Order" : step === "checkout" ? "Checkout" : "Order Placed!"}
                </h2>
                {step === "cart" && count > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold">{count}</span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* === STEP: CART === */}
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-dark-green">Your cart is empty</h3>
                        <p className="text-gray-500 text-sm max-w-[220px]">Add some fresh vibes from the menu!</p>
                        <Button variant="primary" className="mt-2" onClick={() => setIsOpen(false)}>Browse Menu</Button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {items.map((item) => (
                          <motion.div key={item.cartItemId} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden">
                              {item.thumbnail || (item.images && item.images[0]) ? (
                                <Image src={encodeURI(item.thumbnail || item.images[0])} alt={item.name} fill className="object-contain p-2 drop-shadow-md" sizes="80px" />
                              ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-3xl">🥤</span>
                              )}
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-dark-green text-sm leading-tight pr-2">{item.name}</h4>
                                <button onClick={() => removeItem(item.cartItemId)} className="text-gray-300 hover:text-rose-400 transition-colors shrink-0">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <span className="text-primary font-black text-sm">{formatPrice(item.price * item.quantity)}</span>
                              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 w-fit mt-1">
                                <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-dark-green disabled:opacity-30 transition-colors">
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-sm font-bold text-dark-green">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-dark-green transition-colors">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="p-6 bg-gray-50/80 border-t border-gray-100 shrink-0">
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between text-gray-500 font-medium"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                        <div className="flex justify-between text-gray-500 font-medium"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
                        <div className="flex justify-between text-dark-green text-base font-black pt-2 border-t border-gray-200">
                          <span>Total</span><span className="text-primary-dark">{formatPrice(total)}</span>
                        </div>
                      </div>
                      <Button className="w-full h-12 text-base rounded-2xl shadow-md" onClick={() => setStep("checkout")}>
                        Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* === STEP: CHECKOUT === */}
              {step === "checkout" && (
                <motion.div key="checkout" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Order Summary (mini) */}
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{count} item{count !== 1 ? "s" : ""}</p>
                      <div className="space-y-1">
                        {items.map(item => (
                          <div key={item.cartItemId} className="flex justify-between text-sm font-medium text-dark-green">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-base font-black text-dark-green mt-3 pt-3 border-t border-gray-200">
                        <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-dark-green text-sm">Your Details</h3>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text" placeholder="Full Name *" value={form.customerName}
                          onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                          className="w-full h-12 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel" placeholder="Phone Number *" value={form.customerPhone}
                          onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                          className="w-full h-12 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <input
                        type="email" placeholder="Email (optional)" value={form.customerEmail}
                        onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>

                    {/* Order Type */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-dark-green text-sm">Order Type</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {(["pickup", "dine_in"] as const).map(t => (
                          <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                            className={`h-12 rounded-xl border text-sm font-bold transition-all ${form.type === t ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white text-gray-500 border-gray-200 hover:border-primary/50"}`}
                          >
                            {t === "pickup" ? "🥡 Pickup" : "🍽️ Dine In"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-dark-green text-sm">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {(["cash", "card"] as const).map(m => (
                          <button key={m} onClick={() => setForm(f => ({ ...f, paymentMethod: m }))}
                            className={`h-12 rounded-xl border text-sm font-bold transition-all ${form.paymentMethod === m ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white text-gray-500 border-gray-200 hover:border-primary/50"}`}
                          >
                            {m === "cash" ? "💵 Cash" : "💳 Card"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        placeholder="Special instructions (optional)" value={form.notes} rows={3}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        className="w-full pl-9 pr-4 pt-3 pb-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-500 text-sm font-medium bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                        ⚠️ {error}
                      </motion.p>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100 shrink-0">
                    <Button className="w-full h-12 text-base rounded-2xl shadow-md" onClick={handleCheckout} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing Order...</>
                      ) : (
                        <>Place Order · {formatPrice(total)} <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* === STEP: SUCCESS === */}
              {step === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}>
                    <CheckCircle2 className="w-24 h-24 text-primary drop-shadow-lg" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-heading font-black text-dark-green">Order Placed! 🎉</h3>
                    {orderNumber && (
                      <p className="text-sm text-gray-500">Order <span className="font-bold text-dark-green">{orderNumber}</span> received</p>
                    )}
                    <p className="text-gray-500 text-sm max-w-[260px] mx-auto">We've received your order and the team is on it. Sit tight!</p>
                  </div>
                  <div className="mt-4 w-full space-y-2">
                    <Button variant="primary" className="w-full h-12 rounded-2xl" onClick={() => setIsOpen(false)}>
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
