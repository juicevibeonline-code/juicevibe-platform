"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2, MessageSquare } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Drawer } from "@/components/ui/drawer";

const initialMessages = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", subject: "Catering Inquiry", message: "Hi, I'm interested in catering for a corporate event of about 50 people next month. Could you provide a quote for your fresh juice packages?", status: "unread", date: "2 hours ago" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", subject: "Feedback", message: "Loved the smoothies! Just wanted to say the Mango Detox was absolutely incredible. Will be back every week.", status: "unread", date: "5 hours ago" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", subject: "Booking Request", message: "I'd like to reserve a table for 6 people this Saturday evening around 7PM. Is that possible?", status: "read", date: "Yesterday" },
  { id: "4", name: "John Smith", email: "john@example.com", subject: "Partnership Proposal", message: "We'd love to collaborate with Juice Vibe on a wellness event we're organizing.", status: "read", date: "2 days ago" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<(typeof initialMessages)[0] | null>(null);

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleMarkRead = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
  };

  const columns = [
    {
      key: "name",
      label: "From",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          {item.status === "unread" && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          <div>
            <p className={`text-sm ${item.status === "unread" ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{item.name}</p>
            <p className="text-xs text-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "subject", label: "Subject" },
    {
      key: "message",
      label: "Preview",
      render: (item: any) => (
        <span className="text-sm text-muted truncate max-w-[200px] block">{item.message}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          item.status === "unread" ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-white/5 text-gray-500"
        }`}>
          {item.status === "unread" ? <Mail className="w-3 h-3" /> : <MailOpen className="w-3 h-3" />}
          {item.status}
        </span>
      ),
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setSelectedMessage(item); handleMarkRead(item.id); }}
            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
            title="View"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 animate-fade-in pb-12">
      <PageHeader
        title={`Messages ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        subtitle="View and manage contact form submissions"
        accentColor="primary"
      />
      <div className="px-2">
        <Table columns={columns} data={messages} searchable />
      </div>

      {/* Message detail drawer */}
      <Drawer
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject ?? "Message"}
        position="right"
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-5">
            <div className="glass-panel rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Sender</p>
              <p className="font-bold text-foreground">{selectedMessage.name}</p>
              <p className="text-sm text-muted mt-0.5">{selectedMessage.email}</p>
              <p className="text-xs text-muted mt-1">{selectedMessage.date}</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 bg-gray-50/50 dark:bg-white/5">
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Message</p>
              <p className="text-sm text-foreground leading-relaxed">{selectedMessage.message}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all">
                Reply via Email
              </button>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-4 py-3 rounded-xl bg-pink/10 text-pink font-bold text-sm hover:bg-pink hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
