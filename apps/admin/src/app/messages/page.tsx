"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Table } from "@/components/table";

const initialMessages = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", subject: "Catering Inquiry", message: "Hi, I'm interested in catering for a corporate event...", status: "unread", date: "2 hours ago" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", subject: "Feedback", message: "Loved the smoothies! Just wanted to say...", status: "unread", date: "5 hours ago" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", subject: "Booking Request", message: "I'd like to reserve a table for 6 people...", status: "read", date: "Yesterday" },
  { id: "4", name: "John Smith", email: "john@example.com", subject: "Partnership Proposal", message: "We'd love to collaborate with Juice Vibe...", status: "read", date: "2 days ago" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  { key: "message", label: "Message" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        item.status === "unread" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
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
    render: () => (
      <button className="p-1.5 rounded-lg hover:bg-pink/10 text-pink transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    ),
  },
];

export default function MessagesPage() {
  const [messages] = useState(initialMessages);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted mt-1">View and manage contact form submissions</p>
      </div>
      <Table columns={columns} data={messages} searchable />
    </div>
  );
}
