"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  menuService,
  posService,
  shiftService,
  tableService,
  useAuthStore,
} from "@juice-vibe/services";
import type {
  MenuItem,
  MenuCategory,
  Table,
  CashierShift,
  Order,
  PaymentMethod,
} from "@juice-vibe/types";
import { Button, Input, Badge, Modal, LoadingSpinner } from "@juice-vibe/ui";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  Clock,
  User,
  Coffee,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

interface TicketItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  addOnIds?: string[];
  addOnsText?: string[];
  notes?: string;
}

export default function PosTerminalPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Selected state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderType, setOrderType] = useState<"dine_in" | "pickup" | "delivery">("dine_in");
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
  const [heldTickets, setHeldTickets] = useState<{ id: string; items: TicketItem[]; tableId?: string; time: string }[]>([]);

  // Modals state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [itemNotes, setItemNotes] = useState<string>("");

  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [splitCashAmount, setSplitCashAmount] = useState<number>(0);
  const [splitCardAmount, setSplitCardAmount] = useState<number>(0);
  const [cardLast4, setCardLast4] = useState<string>("");
  const [cashTendered, setCashTendered] = useState<number>(0);

  // Shift & Receipt Modals
  const [openShiftModal, setOpenShiftModal] = useState(false);
  const [closeShiftModal, setCloseShiftModal] = useState(false);
  const [openingFloatInput, setOpeningFloatInput] = useState<number>(5000);
  const [closingCashInput, setClosingCashInput] = useState<number>(0);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [zReportData, setZReportData] = useState<any>(null);

  // 1. Fetch Menu & Categories
  const { data: menuData, isLoading: isMenuLoading } = useQuery({
    queryKey: ["pos-menu"],
    queryFn: async () => {
      return await menuService.getMenuItems();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["pos-categories"],
    queryFn: async () => {
      return await menuService.getCategories();
    },
  });

  // 2. Fetch Tables
  const { data: tables } = useQuery({
    queryKey: ["pos-tables"],
    queryFn: async () => {
      return await tableService.getTables();
    },
  });

  // 3. Fetch Active Shift
  const { data: activeShift, isLoading: isShiftLoading } = useQuery({
    queryKey: ["pos-active-shift"],
    queryFn: async () => {
      return await shiftService.getActiveShift();
    },
  });

  // Financial calculations
  const subtotal = useMemo(() => {
    return ticketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [ticketItems]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.05 * 100) / 100;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  // Set default split amounts when opening pay modal
  useEffect(() => {
    if (payModalOpen) {
      setSplitCashAmount(total);
      setSplitCardAmount(0);
      setCashTendered(total);
    }
  }, [payModalOpen, total]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    if (!menuData) return [];
    return menuData.filter((item: MenuItem) => {
      const matchesCategory =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuData, selectedCategory, searchQuery]);

  // Mutations
  const openShiftMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await shiftService.openShift({ openingFloat: amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos-active-shift"] });
      setOpenShiftModal(false);
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: async (countedCash: number) => {
      if (!activeShift) return;
      return await shiftService.closeShift(activeShift.id, { closingCash: countedCash });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pos-active-shift"] });
      setCloseShiftModal(false);
      if (data?.zReport) {
        setZReportData(data.zReport);
      }
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (paymentPayload: any) => {
      return await posService.createPosOrder({
        type: orderType,
        tableId: orderType === "dine_in" && selectedTableId ? selectedTableId : undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        items: ticketItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          variant: item.variant,
          addOnIds: item.addOnIds,
          notes: item.notes,
        })),
        payment: paymentPayload,
      });
    },
    onSuccess: (order) => {
      setLastOrder(order);
      setTicketItems([]);
      setPayModalOpen(false);
      setReceiptModalOpen(true);
      queryClient.invalidateQueries({ queryKey: ["pos-active-shift"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // Ticket Item Handlers
  const handleItemClick = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0 || (item.addOns && item.addOns.length > 0)) {
      setActiveItem(item);
      setSelectedVariant(item.variants?.[0]?.name || "");
      setSelectedAddOnIds([]);
      setItemNotes("");
      setItemModalOpen(true);
    } else {
      // Add directly
      addItemToTicket({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      });
    }
  };

  const handleAddConfiguredItem = () => {
    if (!activeItem) return;
    let finalPrice = activeItem.price;

    if (selectedVariant && activeItem.variants) {
      const v = activeItem.variants.find((v) => v.name === selectedVariant);
      if (v) finalPrice += v.priceAdjustment;
    }

    const addOnsText: string[] = [];
    if (selectedAddOnIds.length > 0 && activeItem.addOns) {
      for (const aId of selectedAddOnIds) {
        const a = activeItem.addOns.find((addon) => addon.id === aId);
        if (a) {
          finalPrice += a.price;
          addOnsText.push(a.name);
        }
      }
    }

    addItemToTicket({
      menuItemId: activeItem.id,
      name: activeItem.name,
      price: finalPrice,
      quantity: 1,
      variant: selectedVariant || undefined,
      addOnIds: selectedAddOnIds.length > 0 ? selectedAddOnIds : undefined,
      addOnsText: addOnsText.length > 0 ? addOnsText : undefined,
      notes: itemNotes || undefined,
    });

    setItemModalOpen(false);
    setActiveItem(null);
  };

  const addItemToTicket = (newItem: TicketItem) => {
    setTicketItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          i.variant === newItem.variant &&
          JSON.stringify(i.addOnIds) === JSON.stringify(newItem.addOnIds) &&
          i.notes === newItem.notes
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setTicketItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setTicketItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Hold & Resume
  const handleHoldTicket = () => {
    if (ticketItems.length === 0) return;
    setHeldTickets((prev) => [
      ...prev,
      {
        id: `HOLD-${Date.now().toString().slice(-4)}`,
        items: ticketItems,
        tableId: selectedTableId,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setTicketItems([]);
  };

  const handleResumeTicket = (heldIndex: number) => {
    const target = heldTickets[heldIndex];
    if (!target) return;
    setTicketItems(target.items);
    if (target.tableId) setSelectedTableId(target.tableId);
    setHeldTickets((prev) => prev.filter((_, i) => i !== heldIndex));
  };

  // Payment Execution
  const handleFastCashPay = (amount: number) => {
    if (!activeShift) {
      setOpenShiftModal(true);
      return;
    }
    createOrderMutation.mutate({
      method: "cash",
      cashTendered: amount,
    });
  };

  const handleSplitPaySubmit = () => {
    if (!activeShift) {
      setOpenShiftModal(true);
      return;
    }

    const splitTransactions: any[] = [];
    if (splitCashAmount > 0) {
      splitTransactions.push({
        method: "cash",
        amount: splitCashAmount,
        cashTendered: cashTendered,
      });
    }
    if (splitCardAmount > 0) {
      splitTransactions.push({
        method: "card",
        amount: splitCardAmount,
        cardLast4: cardLast4 || "0000",
      });
    }

    createOrderMutation.mutate({
      method: splitCardAmount > 0 && splitCashAmount === 0 ? "card" : "cash",
      splitTransactions,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden font-body select-none">
      {/* 1. TOP CASHIER TOOLBAR */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <User className="h-4 w-4" />
            <span className="text-xs font-semibold">{user?.name || "Cashier"}</span>
          </div>

          {activeShift ? (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 flex items-center gap-1.5 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Shift Active (Float: LKR {activeShift.openingFloat.toLocaleString()})
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                onClick={() => setCloseShiftModal(true)}
              >
                Close Shift & Z-Report
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={() => setOpenShiftModal(true)}
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              Open Cashier Shift
            </Button>
          )}
        </div>

        {/* Order Type & Table Controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-muted/60 p-1 rounded-lg border border-border">
            {(["dine_in", "pickup", "delivery"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
                  orderType === type
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>

          {orderType === "dine_in" && (
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="h-8 px-2 text-xs rounded-lg border border-border bg-card text-foreground font-mono"
            >
              <option value="">Select Table...</option>
              {tables?.map((table: Table) => (
                <option key={table.id} value={table.id}>
                  Table #{table.number} ({table.status || "available"})
                </option>
              ))}
            </select>
          )}

          {heldTickets.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg text-xs text-amber-500 font-mono">
              <PauseCircle className="h-3.5 w-3.5" />
              <span>{heldTickets.length} Held</span>
              {heldTickets.map((ht, idx) => (
                <button
                  key={ht.id}
                  onClick={() => handleResumeTicket(idx)}
                  className="ml-1 bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold hover:bg-amber-400"
                >
                  {ht.id}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 2. MAIN POS WORKSPACE: LEFT (CATALOG) + RIGHT (TICKET) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: PRODUCT CATALOG */}
        <div className="flex-1 flex flex-col border-r border-border overflow-hidden bg-background">
          {/* Search & Category Tabs */}
          <div className="p-3 border-b border-border bg-card/40 flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-background"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                All Items
              </button>
              {categories?.map((cat: MenuCategory) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-max">
            {isMenuLoading ? (
              <div className="col-span-full h-64 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Coffee className="h-10 w-10 mb-2 stroke-1" />
                <p className="text-sm font-semibold">No items match your filter</p>
              </div>
            ) : (
              filteredItems.map((item: MenuItem) => {
                const isOutOfStock = item.availability === "out_of_stock";
                return (
                  <button
                    key={item.id}
                    disabled={isOutOfStock}
                    onClick={() => handleItemClick(item)}
                    className={`relative flex flex-col text-left p-3 rounded-xl border transition-all active:scale-[0.98] ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed bg-muted/40 border-border"
                        : "bg-card hover:bg-muted/50 border-border hover:border-primary/50 shadow-sm"
                    }`}
                  >
                    {item.images?.[0] ? (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-muted/50 relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-lg mb-2 bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        <Coffee className="h-8 w-8 stroke-1" />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-foreground line-clamp-1">
                      {item.name}
                    </span>
                    <span className="font-mono text-sm font-bold text-primary mt-1">
                      LKR {item.price.toLocaleString()}
                    </span>

                    {item.variants && item.variants.length > 0 && (
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {item.variants.length} Variants
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: ACTIVE TICKET LEDGER */}
        <div className="w-96 border-l border-border bg-card flex flex-col justify-between shrink-0 shadow-lg">
          {/* Ticket Header */}
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Ticket
              </span>
              <span className="font-mono text-xs font-bold text-primary">
                {ticketItems.length} {ticketItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Quick Guest Name Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Guest Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-8 text-xs bg-background"
              />
              <Input
                placeholder="Phone (Optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="h-8 text-xs bg-background"
              />
            </div>
          </div>

          {/* Ticket Items Scroll Area */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
            {ticketItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 text-center p-4">
                <Receipt className="h-10 w-10 mb-2 stroke-1" />
                <p className="text-sm font-semibold">Ticket is Empty</p>
                <p className="text-xs">Tap menu items to start building order</p>
              </div>
            ) : (
              ticketItems.map((item, idx) => (
                <div
                  key={`${item.menuItemId}-${idx}`}
                  className="p-2.5 rounded-lg border border-border bg-background/50 flex flex-col gap-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-foreground">
                        {item.name}
                      </span>
                      {item.variant && (
                        <Badge variant="primary" className="ml-1.5 text-[10px] py-0 px-1 border-primary/30 text-primary">
                          {item.variant}
                        </Badge>
                      )}
                      {item.addOnsText && item.addOnsText.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          + {item.addOnsText.join(", ")}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-amber-500 italic mt-0.5">
                          * {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">
                      LKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      @ LKR {item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="h-6 w-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="h-6 w-6 rounded bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(idx)}
                        className="h-6 w-6 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Financial Summary & Actions */}
          <div className="p-3 border-t border-border bg-card space-y-3">
            {/* Totals Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Govt Tax (5%)</span>
                <span className="font-mono">LKR {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-1 border-t border-border">
                <span>Grand Total</span>
                <span className="font-mono text-primary text-lg">
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Actions (Hold / Clear) */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={ticketItems.length === 0}
                onClick={handleHoldTicket}
                className="text-xs h-8"
              >
                <PauseCircle className="h-3.5 w-3.5 mr-1" />
                Hold Ticket
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={ticketItems.length === 0}
                onClick={() => setTicketItems([])}
                className="text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>

            {/* Fast Pay Cash Buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[total, 1000, 2000, 5000].map((amt, i) => (
                <button
                  key={i}
                  disabled={ticketItems.length === 0 || createOrderMutation.isPending}
                  onClick={() => handleFastCashPay(amt)}
                  className="h-8 rounded bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-mono text-[11px] font-bold disabled:opacity-40 transition-all"
                >
                  {i === 0 ? "Exact" : `LKR ${amt}`}
                </button>
              ))}
            </div>

            {/* Pay / Split Tender Button */}
            <Button
              disabled={ticketItems.length === 0 || createOrderMutation.isPending}
              onClick={() => setPayModalOpen(true)}
              className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pay & Settle (LKR {total.toLocaleString()})
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ITEM MODIFIER CUSTOMIZER */}
      {itemModalOpen && activeItem && (
        <Modal
          open={itemModalOpen}
          onClose={() => setItemModalOpen(false)}
          title={`Customize ${activeItem.name}`}
        >
          <div className="space-y-4 font-body">
            {/* Variants */}
            {activeItem.variants && activeItem.variants.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Select Size / Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeItem.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex justify-between items-center ${
                        selectedVariant === v.name
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="font-mono">
                        {v.priceAdjustment > 0 ? `+LKR ${v.priceAdjustment}` : "Standard"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {activeItem.addOns && activeItem.addOns.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Optional Add-ons
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeItem.addOns.map((a) => {
                    const isSelected = selectedAddOnIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() =>
                          setSelectedAddOnIds((prev) =>
                            isSelected ? prev.filter((id) => id !== a.id) : [...prev, a.id]
                          )
                        }
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex justify-between items-center ${
                          isSelected
                            ? "bg-primary/20 text-primary border-primary"
                            : "bg-card border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{a.name}</span>
                        <span className="font-mono">+LKR {a.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Notes */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Special Kitchen Note
              </label>
              <Input
                placeholder="e.g. No Sugar, Extra Lime, Well Done"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              onClick={handleAddConfiguredItem}
              className="w-full bg-primary text-primary-foreground font-bold"
            >
              Add to Ticket
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 2: SPLIT PAYMENT / MULTI-TENDER */}
      {payModalOpen && (
        <Modal
          open={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title="Payment Settlement"
        >
          <div className="space-y-4 font-body">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex justify-between items-center">
              <span className="text-xs font-bold text-foreground">Total Bill Due:</span>
              <span className="font-mono text-lg font-bold text-primary">
                LKR {total.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {/* Cash Portion */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground flex justify-between">
                  <span>Cash Amount (LKR)</span>
                  <span className="font-mono text-[11px]">Tendered: LKR {cashTendered}</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={splitCashAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSplitCashAmount(val);
                      setSplitCardAmount(Math.max(0, total - val));
                      setCashTendered(val);
                    }}
                    className="font-mono text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Cash Given"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="font-mono text-sm w-32"
                  />
                </div>
              </div>

              {/* Card Portion */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Card / POS Machine Amount (LKR)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={splitCardAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSplitCardAmount(val);
                      setSplitCashAmount(Math.max(0, total - val));
                    }}
                    className="font-mono text-sm"
                  />
                  <Input
                    placeholder="Card Last 4 Digits"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    className="font-mono text-sm w-32"
                  />
                </div>
              </div>
            </div>

            {/* Change Due Indicator */}
            {splitCashAmount > 0 && cashTendered > splitCashAmount && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center text-emerald-500">
                <span className="text-xs font-bold">Change Due to Guest:</span>
                <span className="font-mono text-sm font-bold">
                  LKR {(cashTendered - splitCashAmount).toLocaleString()}
                </span>
              </div>
            )}

            <Button
              disabled={createOrderMutation.isPending || splitCashAmount + splitCardAmount < total}
              onClick={handleSplitPaySubmit}
              className="w-full bg-primary text-primary-foreground font-bold h-11"
            >
              {createOrderMutation.isPending ? "Processing..." : "Complete & Print Receipt"}
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 3: 58mm / 80mm ESC/POS THERMAL RECEIPT */}
      {receiptModalOpen && lastOrder && (
        <Modal
          open={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          title="Print Customer Receipt"
        >
          <div className="space-y-4">
            {/* Printable Receipt Paper Canvas */}
            <div
              id="thermal-receipt"
              className="p-4 bg-white text-black font-mono text-xs rounded border border-gray-300 shadow-sm leading-tight max-w-[320px] mx-auto"
            >
              <div className="text-center pb-2 border-b border-dashed border-gray-400">
                <h2 className="text-sm font-bold tracking-wider">JUICE VIBE WASKADUWA</h2>
                <p className="text-[10px] text-gray-600">Fresh Tropical Juices & Cafe</p>
                <p className="text-[10px] text-gray-600">Galle Road, Waskaduwa, Kalutara</p>
                <p className="text-[10px] text-gray-600">Tel: +94 71 843 5876</p>
              </div>

              <div className="py-2 border-b border-dashed border-gray-400 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Order: #{lastOrder.orderNumber}</span>
                  <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type: {lastOrder.type.toUpperCase()}</span>
                  <span>Cashier: {user?.name || "Cashier"}</span>
                </div>
              </div>

              {/* Items */}
              <div className="py-2 border-b border-dashed border-gray-400 space-y-1.5">
                {lastOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <div>
                      <span>{item.quantity}x {item.name}</span>
                      {item.variant && <span className="text-[10px] block text-gray-600">({item.variant})</span>}
                    </div>
                    <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="py-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>LKR {lastOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Govt Tax (5%):</span>
                  <span>LKR {lastOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
                  <span>TOTAL:</span>
                  <span>LKR {lastOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-600 pt-1">
                  <span>Payment Status:</span>
                  <span>PAID ({lastOrder.paymentMethod.toUpperCase()})</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-gray-400 text-[10px] text-gray-600">
                <p>Thank You For Sipping Good Vibes!</p>
                <p>Visit again: juicevibe.lk</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-primary text-primary-foreground font-bold gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print (Browser / ESC-POS)
              </Button>
              <Button
                variant="outline"
                onClick={() => setReceiptModalOpen(false)}
                className="flex-1"
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: OPEN SHIFT MODAL */}
      {openShiftModal && (
        <Modal
          open={openShiftModal}
          onClose={() => setOpenShiftModal(false)}
          title="Open Cashier Shift"
        >
          <div className="space-y-4 font-body">
            <p className="text-xs text-muted-foreground">
              Enter the starting cash drawer float to activate this terminal session.
            </p>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Opening Cash Float (LKR)
              </label>
              <Input
                type="number"
                value={openingFloatInput}
                onChange={(e) => setOpeningFloatInput(Number(e.target.value))}
                className="font-mono text-base font-bold"
              />
            </div>
            <Button
              disabled={openShiftMutation.isPending}
              onClick={() => openShiftMutation.mutate(openingFloatInput)}
              className="w-full bg-primary text-primary-foreground font-bold"
            >
              {openShiftMutation.isPending ? "Opening..." : "Confirm & Open Shift"}
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 5: CLOSE SHIFT & Z-REPORT */}
      {closeShiftModal && activeShift && (
        <Modal
          open={closeShiftModal}
          onClose={() => setCloseShiftModal(false)}
          title="Close Shift & Z-Report"
        >
          <div className="space-y-4 font-body">
            <p className="text-xs text-muted-foreground">
              Count the physical cash notes in your cash drawer and enter the total below.
            </p>
            <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Opening Float:</span>
                <span className="font-mono">LKR {activeShift.openingFloat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shift Started:</span>
                <span className="font-mono">{new Date(activeShift.openedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Counted Cash in Drawer (LKR)
              </label>
              <Input
                type="number"
                placeholder="Enter physical cash count"
                value={closingCashInput}
                onChange={(e) => setClosingCashInput(Number(e.target.value))}
                className="font-mono text-base font-bold"
              />
            </div>

            <Button
              disabled={closeShiftMutation.isPending}
              onClick={() => closeShiftMutation.mutate(closingCashInput)}
              className="w-full bg-destructive text-destructive-foreground font-bold"
            >
              {closeShiftMutation.isPending ? "Closing..." : "Close Shift & Generate Z-Report"}
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL 6: Z-REPORT DISPLAY */}
      {zReportData && (
        <Modal
          open={!!zReportData}
          onClose={() => setZReportData(null)}
          title="End-of-Day Z-Report Summary"
        >
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-muted/40 rounded-lg space-y-1.5 border border-border">
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span className="font-bold">{zReportData.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Opening Float:</span>
                <span>LKR {zReportData.openingFloat?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Sales:</span>
                <span className="font-bold text-primary">LKR {zReportData.grossSales?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Sales:</span>
                <span>LKR {zReportData.cashSales?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Card Sales:</span>
                <span>LKR {zReportData.cardSales?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Drawer Cash:</span>
                <span>LKR {zReportData.expectedDrawerCash?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Counted Cash:</span>
                <span>LKR {zReportData.actualCountedCash?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-1">
                <span>Cash Variance:</span>
                <span className={zReportData.variance < 0 ? "text-destructive" : "text-emerald-500"}>
                  LKR {zReportData.variance?.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              onClick={() => window.print()}
              className="w-full bg-primary text-primary-foreground font-bold gap-1.5"
            >
              <Printer className="h-4 w-4" />
              Print Z-Report
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
