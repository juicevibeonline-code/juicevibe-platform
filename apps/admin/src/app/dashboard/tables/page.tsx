"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tableService } from "@juice-vibe/services";
import { formatDate } from "@juice-vibe/utils";
import { QrCode, Plus, Trash2, Printer, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button, Modal } from "@juice-vibe/ui";

export default function TablesManagement() {
  const queryClient = useQueryClient();
  const [newTableNumber, setNewTableNumber] = useState<string>("");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  // Fetch Tables
  const { data: tables = [], isLoading, refetch } = useQuery<any[]>({
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

  const printQR = (qrUrl: string, tableNumber: number) => {
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Table ${tableNumber} QR Code</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; }
              img { width: 350px; height: 350px; }
              h1 { margin-top: 24px; font-size: 28px; color: #0F2A1E; }
              p { font-size: 14px; color: #666; margin-top: 8px; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <img src="${qrUrl}" />
            <h1>JUICE VIBE</h1>
            <p>Scan to view menu & order at Table ${tableNumber}</p>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-heading">
            Tables & QR Codes
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            DINE-IN SERVICE TABLE REGISTER & GENERATED QR CODES
          </p>
        </div>
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
                        <td className="py-3.5 px-4 font-bold text-primary text-sm font-mono">Table {table.number}</td>
                        <td className="py-3.5 px-4 text-muted-foreground text-[11px]">{formatDate(table.createdAt)}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPrintModal(table)}
                            className="h-8 px-2 border-border hover:bg-ink-dark hover:text-primary font-mono text-[10px]"
                          >
                            <QrCode className="h-3.5 w-3.5 mr-1" />
                            View QR
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

      {/* View/Print QR Modal */}
      <Modal
        open={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={`Table QR Code - Table ${selectedTable?.number}`}
        className="bg-card border border-border text-foreground"
      >
        <div className="flex flex-col items-center justify-center p-6 bg-ink-dark/30 rounded-lg border border-border/50">
          {selectedTable?.qrCodeUrl ? (
            <img
              src={selectedTable.qrCodeUrl}
              alt={`Table ${selectedTable.number} QR Code`}
              className="w-64 h-64 border border-border rounded bg-white p-2"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center font-mono text-xs text-muted-foreground">
              NO QR CODE GENERATED
            </div>
          )}
          <p className="mt-4 font-mono text-xs text-center text-muted-foreground">
            Scan to view the menu & place dine-in orders directly from Table {selectedTable?.number}.
          </p>
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
            onClick={() => printQR(selectedTable.qrCodeUrl, selectedTable.number)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs uppercase"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print QR Code
          </Button>
        </div>
      </Modal>
    </div>
  );
}
