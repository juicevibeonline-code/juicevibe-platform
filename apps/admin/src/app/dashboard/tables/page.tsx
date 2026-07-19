"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tableService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { QrCode, Plus, Trash2, Printer, Loader2, RefreshCw, Smartphone, Utensils, BookOpen, ShoppingBag, ChefHat, Heart } from "lucide-react";
import React, { useState } from "react";
import { Button, Modal } from "@juice-vibe/ui";

export default function TablesManagement() {
  const queryClient = useQueryClient();
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  // Fetch Tables
  const { data: tables = [], isLoading } = useQuery<any[]>({
    queryKey: ["tables"],
    queryFn: () => tableService.getTables(),
    retry: 1,
  });

  // Create Table Mutation
  const createTableMutation = useMutation({
    mutationFn: (number: number) => tableService.createTable({ number }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setNewTableNumber("");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to create table");
    },
  });

  // Regenerate All QR Codes Mutation
  const regenerateMutation = useMutation({
    mutationFn: () => tableService.regenerateQRCodes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      alert("All table QR codes successfully updated with the active production domain!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to regenerate QR codes");
    },
  });

  // Delete Table Mutation
  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => tableService.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || "Failed to delete table");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(newTableNumber, 10);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid table number");
      return;
    }
    createTableMutation.mutate(num);
  };

  const handleDelete = (id: string, num: number) => {
    if (confirm(`Are you sure you want to delete Table ${num}?`)) {
      deleteTableMutation.mutate(id);
    }
  };

  const handleOpenPrintModal = (table: any) => {
    setSelectedTable(table);
    setIsPrintModalOpen(true);
  };

  const formattedTableNumber = (num: number) => String(num).padStart(2, "0");

  const printStandee = (table: any) => {
    const win = window.open("", "_blank");
    if (!win) return;

    const tableNumStr = formattedTableNumber(table.number);
    const qrUrl = table.qrCodeUrl;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Juice Vibe - Table ${tableNumStr} Standee</title>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@700&display=swap');
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', sans-serif;
              background-color: #f1f5f9;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @page {
              size: A5 portrait;
              margin: 0;
            }

            .standee-card {
              width: 420px;
              background: #ffffff;
              border: 12px solid #ffffff;
              border-radius: 28px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.12);
              overflow: hidden;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 24px 20px 0 20px;
              border: 3px solid #e2e8f0;
            }

            /* Tropical Leaves Corners */
            .leaf-left {
              position: absolute;
              top: 0;
              left: 0;
              width: 80px;
              height: 80px;
              opacity: 0.85;
              pointer-events: none;
            }

            .leaf-right {
              position: absolute;
              top: 0;
              right: 0;
              width: 85px;
              height: 85px;
              opacity: 0.85;
              pointer-events: none;
            }

            /* Brand Header */
            .header {
              text-align: center;
              margin-top: 10px;
              position: relative;
              z-index: 2;
            }

            .logo-text {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 38px;
              font-weight: 800;
              line-height: 1;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .logo-orange { color: #f97316; }
            .logo-green { color: #16a34a; }

            .sub-subtitle {
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 3px;
              color: #334155;
              text-transform: uppercase;
              margin-top: 4px;
            }

            .headline {
              font-size: 26px;
              font-weight: 800;
              color: #15803d;
              margin-top: 14px;
              font-style: italic;
            }

            .badges-row {
              display: flex;
              justify-content: center;
              gap: 12px;
              margin-top: 8px;
              font-size: 9px;
              font-weight: 800;
              color: #0f172a;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }

            .badge-item {
              display: flex;
              align-items: center;
              gap: 3px;
            }

            .leaf-icon { color: #16a34a; font-size: 11px; }

            /* Center Green Section */
            .qr-container {
              background: #15803d;
              border-radius: 20px;
              padding: 20px 14px;
              margin-top: 18px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              box-shadow: inset 0 2px 8px rgba(0,0,0,0.15);
            }

            .side-col {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              text-align: center;
            }

            .icon-circle {
              width: 42px;
              height: 42px;
              border: 2px solid rgba(255,255,255,0.4);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 6px;
              background: rgba(255,255,255,0.1);
            }

            .side-text {
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.5px;
              line-height: 1.2;
              text-transform: uppercase;
            }

            .qr-wrapper {
              width: 170px;
              height: 170px;
              background: #ffffff;
              border-radius: 16px;
              padding: 8px;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }

            .qr-img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 8px;
            }

            .center-badge {
              position: absolute;
              width: 44px;
              height: 44px;
              background: #ffffff;
              border: 2px solid #16a34a;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            }

            .badge-brand-text {
              font-size: 8px;
              font-weight: 800;
              line-height: 1;
            }

            /* Table Number Display */
            .table-card {
              background: #ffffff;
              border: 2px solid #15803d;
              border-radius: 14px;
              width: 180px;
              margin: -14px auto 0 auto;
              position: relative;
              z-index: 10;
              text-align: center;
              padding: 6px 12px 10px 12px;
              box-shadow: 0 6px 16px rgba(0,0,0,0.08);
            }

            .table-label {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 4px;
              color: #15803d;
              text-transform: uppercase;
            }

            .table-num {
              font-family: monospace, sans-serif;
              font-size: 42px;
              font-weight: 900;
              color: #0f172a;
              line-height: 1;
              margin-top: 2px;
            }

            /* Process Flow Bar */
            .steps-row {
              display: flex;
              justify-content: space-around;
              margin-top: 18px;
              padding: 0 10px;
            }

            .step-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            .step-icon-bg {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 1.5px solid #f97316;
              color: #f97316;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              margin-bottom: 4px;
              background: #fff7ed;
            }

            .step-label {
              font-size: 8px;
              font-weight: 800;
              color: #334155;
              letter-spacing: 0.3px;
              text-transform: uppercase;
            }

            /* Bottom Footer Bar */
            .footer-bar {
              background: #15803d;
              margin: 20px -20px 0 -20px;
              padding: 10px 0;
              text-align: center;
              color: #ffffff;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.5px;
            }

            @media print {
              body { background: transparent; padding: 0; }
              .standee-card { box-shadow: none; border-color: #cbd5e1; }
            }
          </style>
        </head>
        <body onload="window.print();">
          <div class="standee-card">
            <!-- Tropical Palm Leaves Top Corners SVG -->
            <svg class="leaf-left" viewBox="0 0 100 100" fill="none">
              <path d="M0 0C30 10 50 40 40 80C30 50 10 30 0 0Z" fill="#16a34a" opacity="0.4"/>
              <path d="M0 0C40 20 70 20 80 50C50 40 20 20 0 0Z" fill="#15803d" opacity="0.5"/>
            </svg>
            <svg class="leaf-right" viewBox="0 0 100 100" fill="none">
              <path d="M100 0C70 10 50 40 60 80C70 50 90 30 100 0Z" fill="#16a34a" opacity="0.4"/>
              <path d="M100 0C60 20 30 20 20 50C50 40 80 20 100 0Z" fill="#15803d" opacity="0.5"/>
            </svg>

            <!-- Brand Header -->
            <div class="header">
              <div class="logo-text">
                <span class="logo-orange">Juice</span>
                <span class="logo-green">Vibe</span>
              </div>
              <div class="sub-subtitle">— JUICE BAR & CAFE —</div>
              <div class="headline">Scan. Order. Enjoy!</div>
              <div class="badges-row">
                <div class="badge-item"><span class="leaf-icon">🌿</span> NO WAITING</div>
                <div>|</div>
                <div class="badge-item"><span class="leaf-icon">🌿</span> EASY ORDERING</div>
                <div>|</div>
                <div class="badge-item"><span class="leaf-icon">🌿</span> MORE TIME FOR YOU</div>
              </div>
            </div>

            <!-- Center Green Section with QR -->
            <div class="qr-container">
              <div class="side-col">
                <div class="icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                </div>
                <div class="side-text">SCAN<br/>THE QR</div>
              </div>

              <div class="qr-wrapper">
                <img src="${qrUrl}" class="qr-img" alt="Table QR Code" />
                <div class="center-badge">
                  <span class="badge-brand-text logo-orange">Juice</span>
                  <span class="badge-brand-text logo-green">Vibe</span>
                </div>
              </div>

              <div class="side-col">
                <div class="icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a10 10 0 0 0-10-10Z"/><path d="M12 2v2"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>
                </div>
                <div class="side-text">ORDER<br/>& ENJOY</div>
              </div>
            </div>

            <!-- Table Number Card -->
            <div class="table-card">
              <div class="table-label">TABLE</div>
              <div class="table-num">${tableNumStr}</div>
            </div>

            <!-- Process Steps Row -->
            <div class="steps-row">
              <div class="step-item">
                <div class="step-icon-bg">📄</div>
                <div class="step-label">DIGITAL MENU</div>
              </div>
              <div class="step-item">
                <div class="step-icon-bg">🛒</div>
                <div class="step-label">PLACE ORDER</div>
              </div>
              <div class="step-item">
                <div class="step-icon-bg">👨‍🍳</div>
                <div class="step-label">WE PREPARE</div>
              </div>
              <div class="step-item">
                <div class="step-icon-bg">🍹</div>
                <div class="step-label">WE SERVE</div>
              </div>
            </div>

            <!-- Footer Bar -->
            <div class="footer-bar">
              Thank you! — Have a great time ♡
            </div>
          </div>
        </body>
      </html>
    `;

    win.document.write(htmlContent);
    win.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Tables & Dine-In QR Standees
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            REGISTER TABLES, GENERATE TROPICAL STANDEES & REGENERATE DOMAIN QR CODES
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => regenerateMutation.mutate()}
          disabled={regenerateMutation.isPending}
          className="border-border hover:bg-ink-dark text-xs font-mono uppercase h-9"
        >
          {regenerateMutation.isPending ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-3.5 w-3.5 text-primary" />
          )}
          Regenerate Production QR Codes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Table Card */}
        <div className="terminal-card bg-card border border-border p-5 h-fit">
          <h3 className="text-sm font-bold text-foreground font-heading mb-4">Register New Table</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                Table Number
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                className="w-full bg-ink-dark border border-border text-foreground font-mono text-xs px-3 py-2 rounded-lg outline-none focus:border-primary/50"
                min="1"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={createTableMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase tracking-wider h-10"
            >
              {createTableMutation.isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-3.5 w-3.5" />
              )}
              Register Table
            </Button>
          </form>
        </div>

        {/* Tables Directory */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 font-mono text-xs text-muted-foreground uppercase">
              Fetching table register indices...
            </div>
          ) : tables.length === 0 ? (
            <div className="terminal-card p-12 text-center border border-border bg-card">
              <QrCode className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-bold text-foreground font-heading">No Tables Registered</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Add your first table using the registration panel.
              </p>
            </div>
          ) : (
            <div className="terminal-card bg-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-[10px] text-muted-foreground uppercase tracking-wider bg-ink-dark/30">
                      <th className="py-3 px-4 font-semibold">Table ID</th>
                      <th className="py-3 px-4 font-semibold">Table Number</th>
                      <th className="py-3 px-4 font-semibold">Created Timestamp</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {tables.map((table: any) => (
                      <tr key={table.id} className="hover:bg-ink-dark/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-muted-foreground select-all text-[11px]">{table.id}</td>
                        <td className="py-3.5 px-4 font-bold text-primary text-sm font-mono">
                          Table {formattedTableNumber(table.number)}
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px]">{formatDate(table.createdAt)}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPrintModal(table)}
                            className="h-8 px-2.5 border-border hover:bg-ink-dark hover:text-primary font-mono text-[10px]"
                          >
                            <QrCode className="h-3.5 w-3.5 mr-1.5" />
                            View Standee
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(table.id, table.number)}
                            className="h-8 px-2 text-pink hover:bg-pink/10 hover:text-pink font-mono text-[10px]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Standee Preview & Print Modal */}
      <Modal
        open={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={`Tropical Standee Preview — Table ${selectedTable ? formattedTableNumber(selectedTable.number) : ""}`}
        className="bg-card border border-border text-foreground max-w-xl"
      >
        <div className="flex flex-col items-center justify-center p-4 bg-ink-dark/40 rounded-xl border border-border/60 overflow-y-auto max-h-[75vh]">
          {selectedTable?.qrCodeUrl ? (
            /* Live Standee Card Graphic */
            <div className="w-[360px] bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-5 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
              
              {/* Header */}
              <div className="text-center relative z-10 pt-1">
                <div className="text-2xl font-black font-heading tracking-tight leading-none">
                  <span className="text-amber-500">Juice</span>{" "}
                  <span className="text-emerald-600">Vibe</span>
                </div>
                <div className="text-[8px] font-extrabold uppercase tracking-[2.5px] text-slate-600 mt-1">
                  — JUICE BAR & CAFE —
                </div>
                <div className="text-lg font-black italic text-emerald-700 mt-2 font-heading">
                  Scan. Order. Enjoy!
                </div>
                <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase text-slate-700 mt-1 tracking-wider">
                  <span>🌿 NO WAITING</span>
                  <span>|</span>
                  <span>🌿 EASY ORDERING</span>
                  <span>|</span>
                  <span>🌿 MORE TIME</span>
                </div>
              </div>

              {/* Center Box */}
              <div className="bg-emerald-700 rounded-xl p-3.5 mt-3 flex items-center justify-between shadow-inner">
                <div className="flex-1 flex flex-col items-center text-white text-center">
                  <div className="w-8 h-8 rounded-lg border border-white/40 bg-white/10 flex items-center justify-center mb-1">
                    <Smartphone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider leading-tight">SCAN<br/>THE QR</span>
                </div>

                <div className="w-36 h-36 bg-white rounded-xl p-1.5 relative flex items-center justify-center shadow-lg">
                  <img
                    src={selectedTable.qrCodeUrl}
                    alt={`Table ${selectedTable.number} QR Code`}
                    className="w-full h-full object-contain rounded"
                  />
                  <div className="absolute w-8 h-8 bg-white border border-emerald-600 rounded-full flex flex-col items-center justify-center shadow-md">
                    <span className="text-[6px] font-black text-amber-500 leading-none">Juice</span>
                    <span className="text-[6px] font-black text-emerald-600 leading-none">Vibe</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center text-white text-center">
                  <div className="w-8 h-8 rounded-lg border border-white/40 bg-white/10 flex items-center justify-center mb-1">
                    <Utensils className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-wider leading-tight">ORDER<br/>& ENJOY</span>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-white border-2 border-emerald-600 rounded-xl w-36 mx-auto -mt-3 relative z-10 text-center py-1 px-3 shadow-md">
                <div className="text-[9px] font-black tracking-[3px] text-emerald-700 uppercase">TABLE</div>
                <div className="font-mono text-3xl font-black text-slate-900 leading-none mt-0.5">
                  {formattedTableNumber(selectedTable.number)}
                </div>
              </div>

              {/* Process Bar */}
              <div className="flex items-center justify-around mt-3 px-1 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5">
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[7px] font-black uppercase text-slate-700">DIGITAL MENU</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[7px] font-black uppercase text-slate-700">PLACE ORDER</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5">
                    <ChefHat className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[7px] font-black uppercase text-slate-700">WE PREPARE</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full border border-amber-500 bg-amber-50 text-amber-600 flex items-center justify-center mb-0.5">
                    <Utensils className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[7px] font-black uppercase text-slate-700">WE SERVE</span>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="bg-emerald-700 -mx-5 -mb-5 mt-4 py-2 text-center text-white text-[10px] font-bold tracking-wide">
                Thank you! — Have a great time ♡
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center font-mono text-xs text-muted-foreground">
              NO QR CODE GENERATED
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsPrintModalOpen(false)}
            className="font-mono text-xs uppercase border-border"
          >
            Close
          </Button>
          <Button
            onClick={() => printStandee(selectedTable)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Standee (A5 / Card)
          </Button>
        </div>
      </Modal>
    </div>
  );
}
