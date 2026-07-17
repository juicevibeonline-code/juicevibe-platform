"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, User, Phone, Mail, MapPin, Banknote,
  Tag, Trash2, ChevronLeft, CheckCircle2,
  QrCode, Loader2, AlertCircle, Info, Smartphone
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/store/cart";
import { orderService, couponService } from "@juice-vibe/services";

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z
    .string()
    .regex(/^[0-9+\- ]{7,15}$/, "Enter a valid phone number"),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  paymentMethod: z.enum(["cash", "online"]),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  deliveryAddress: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const paymentMethods = [
  { id: "cash" as const, label: "Cash on Delivery", icon: Banknote, color: "text-emerald-600" },
  { id: "online" as const, label: "Online Transfer", icon: Smartphone, color: "text-purple-600" },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, tableId, clearCart, updateQuantity, removeItem, getTotals } = useCartStore();
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successPaymentMethod, setSuccessPaymentMethod] = useState<"cash" | "online">("cash");

  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [discountVal, setDiscountVal] = useState(0);

  const { subtotal, count } = getTotals();
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + tax - discountVal);

  const isDineIn = Boolean(tableId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  const selectedPayment = watch("paymentMethod");
  const couponCodeValue = watch("couponCode");

  const handleApplyCoupon = async () => {
    if (!couponCodeValue) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const result = await couponService.validateCoupon(couponCodeValue.toUpperCase(), subtotal);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setDiscountVal(result.discount);
      } else {
        setCouponError("Invalid coupon");
        setAppliedCoupon(null);
        setDiscountVal(0);
      }
    } catch (err: any) {
      setCouponError(err.response?.data?.message || err.message || "Invalid coupon");
      setAppliedCoupon(null);
      setDiscountVal(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setLoading(true);
    setApiError(null);

    try {
      const order = await orderService.createOrder({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || undefined,
        type: isDineIn ? "dine_in" : "pickup",
        paymentMethod: data.paymentMethod as any,
        notes: data.notes,
        couponCode: data.couponCode || undefined,
        tableId: tableId || undefined,
        deliveryAddress: data.deliveryAddress ? ({ address: data.deliveryAddress } as any) : undefined,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      });
      setOrderNumber((order as any).orderNumber || "JV-XXXX");
      setSuccessPaymentMethod(data.paymentMethod);
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-dark-green">
            Order Placed! 🎉
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Your fresh juices are on their way!
          </p>
          <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/10 p-4 text-center">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Order Number</p>
            <p className="mt-1 text-2xl font-bold font-mono text-primary">{orderNumber}</p>
            {isDineIn && tableId && (
              <p className="mt-2 text-xs text-gray-500">
                Dine-in order — table delivery incoming!
              </p>
            )}
          </div>
          {successPaymentMethod === "online" && (
            <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-100 p-4 text-left space-y-3 font-sans">
              <p className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Bank Transfer Required
              </p>
              <p className="text-[11px] text-gray-600 leading-normal">
                Please transfer **LKR {total.toLocaleString()}** to the account below and send a receipt screenshot via WhatsApp:
              </p>
              <div className="text-[10px] space-y-1 text-gray-700 bg-white p-2.5 rounded-lg border border-purple-100/50">
                <div><span className="text-gray-400 font-medium">Bank:</span> Commercial Bank of Ceylon</div>
                <div><span className="text-gray-400 font-medium">Account Name:</span> Juice Vibe Bentota</div>
                <div><span className="text-gray-400 font-medium">Account Number:</span> 8010156942</div>
                <div><span className="text-gray-400 font-medium">Branch:</span> Bentota</div>
              </div>
              <a
                href={`https://wa.me/94718435876?text=Hi%20Juice%20Vibe!%20Here%20is%20the%20payment%20receipt%20for%20my%20order%20%23${orderNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center gap-1.5 text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Send WhatsApp Receipt
              </a>
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/menu"
              className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90"
            >
              Back to Menu
            </Link>
            <Link
              href="/"
              className="w-full rounded-2xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-heading text-2xl font-bold text-dark-green">Your cart is empty</h2>
          <p className="mt-2 text-gray-500 text-sm">Add some items before checking out.</p>
          <Link
            href="/menu"
            className="mt-6 inline-block rounded-2xl bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-all"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // ─── Checkout form ──────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-light-bg pt-28 pb-20">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/menu"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Menu
            </Link>
            {isDineIn && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <QrCode className="h-3.5 w-3.5" />
                Dine-in — Table scan active
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-dark-green mb-8">
            Complete your order
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* ─── Left: Form ─────────────────────────────────────────────── */}
              <div className="lg:col-span-3 space-y-5">
                {/* API Error */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {apiError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contact Info */}
                <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h2 className="font-heading text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Your Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          {...register("customerName")}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      {errors.customerName && (
                        <p className="text-xs text-red-500">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          {...register("customerPhone")}
                          placeholder="+94 71 234 5678"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="text-xs text-red-500">{errors.customerPhone.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Email (optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          {...register("customerEmail")}
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    {!isDineIn && (
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Delivery Address (optional)
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            {...register("deliveryAddress")}
                            placeholder="123 Main St, Waskaduwa"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Payment Methods */}
                <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-heading text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-primary" /> Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map(({ id, label, icon: Icon, color }) => (
                      <label
                        key={id}
                        className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                          selectedPayment === id
                            ? "border-primary bg-primary/5"
                            : "border-gray-100 hover:border-primary/30"
                        }`}
                      >
                        <input
                          {...register("paymentMethod")}
                          type="radio"
                          value={id}
                          className="sr-only"
                        />
                        <Icon className={`h-6 w-6 ${selectedPayment === id ? "text-primary" : color}`} />
                        <span className="text-xs font-semibold text-gray-700">{label}</span>
                        {selectedPayment === id && (
                          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Bank Transfer details if 'online' is selected */}
                  {selectedPayment === "online" && (
                    <div className="mt-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3 font-sans">
                      <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                        <Info className="h-4 w-4" />
                        <span>Online Bank Transfer Instructions</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Please transfer the order total to our bank account. Once transferred, send a screenshot of the receipt via WhatsApp. We will process your order as soon as payment is confirmed.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-purple-100/50">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block">Bank</span>
                          <span className="font-bold text-dark-green">Commercial Bank of Ceylon</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block">Branch</span>
                          <span className="font-bold text-dark-green">Bentota</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block">Account Name</span>
                          <span className="font-bold text-dark-green">Juice Vibe Bentota</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block">Account Number</span>
                          <span className="font-bold text-dark-green font-mono">8010156942</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Extra Notes & Coupon */}
                <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" /> Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        {...register("couponCode")}
                        placeholder="Enter code (if any)"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCodeValue}
                        className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-mono font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                      >
                        {validatingCoupon ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-pink font-mono">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-xs text-primary font-mono">
                        Coupon Applied! Discount: LKR {discountVal.toLocaleString()} ({appliedCoupon.code})
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Special Notes
                    </label>
                    <textarea
                      {...register("notes")}
                      rows={3}
                      placeholder="Allergies, special requests..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </section>
              </div>

              {/* ─── Right: Order Summary ────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-5">
                <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sticky top-28">
                  <h2 className="font-heading text-lg font-bold text-dark-green mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" /> Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.cartItemId} className="flex items-center gap-3">
                        {item.images?.[0] && (
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            LKR {item.price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="h-5 w-5 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="h-5 w-5 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="ml-1 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal ({count} items)</span>
                      <span>LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax (5%)</span>
                      <span>LKR {tax.toFixed(0)}</span>
                    </div>
                    {discountVal > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold font-mono text-xs">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>- LKR {discountVal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-dark-green text-base pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-primary">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {isDineIn && tableId && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 px-3 py-2 text-xs text-primary font-semibold">
                      <QrCode className="h-4 w-4" />
                      Dine-in — Order will be brought to your table
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order…
                      </>
                    ) : (
                      `Place Order · LKR ${total.toLocaleString()}`
                    )}
                  </button>
                </section>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
