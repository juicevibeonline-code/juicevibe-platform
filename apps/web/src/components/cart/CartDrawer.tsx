"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotals, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { subtotal } = getTotals();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-extrabold text-dark-green flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Order
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-green">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-[250px]">Looks like you haven't added any fresh vibes to your cart yet.</p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div 
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4"
                    >
                      {/* Item Image */}
                      <div className="relative w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <Image
                            src={encodeURI(item.image)}
                            alt={item.name}
                            fill
                            className="object-contain p-2 drop-shadow-md"
                          />
                        ) : (
                          <span className="text-3xl">🥤</span>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-dark-green text-sm leading-tight pr-4">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-gray-400 hover:text-pink-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-primary font-black mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dark-green disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dark-green"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm font-medium">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(subtotal * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-dark-green text-lg font-black pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary-dark">{formatPrice(subtotal * 1.1)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
                  onClick={() => {
                    alert("Proceeding to checkout with " + items.length + " items!");
                    // Here you would redirect to a real checkout or handle the API call
                    clearCart();
                    setIsOpen(false);
                  }}
                >
                  Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
