"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2, MessageSquare, Reply, AlertCircle } from "lucide-react";
import { Table } from "@/components/table";
import { PageHeader } from "@/components/PageHeader";
import { Drawer } from "@/components/ui/drawer";
import { ActionMenu } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorAlert, SectionCard, SectionTitle } from "@/components/shared";
import { contactService, type ContactMessage } from "@juice-vibe/services";
import { useToast } from "@/hooks/useToast";

function formatMessageDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await contactService.getMessages({ limit: 100 });
      setMessages(res.items || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load messages from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleDelete = async (id: string) => {
    const prevMessages = [...messages];
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
    try {
      await contactService.deleteMessage(id);
      toast({ type: "success", title: "Deleted", message: "Message deleted successfully." });
    } catch (err) {
      console.error("Failed to delete message:", err);
      setMessages(prevMessages);
      toast({ type: "error", title: "Error", message: "Failed to delete message from server." });
    }
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.isRead) return;

    const prevMessages = [...messages];
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
    );
    try {
      await contactService.markAsRead(msg.id);
    } catch (err) {
      console.error("Failed to mark message as read:", err);
      setMessages(prevMessages);
    }
  };

  // 1. Filter
  const filtered = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField as keyof ContactMessage];
    const valB = b[sortField as keyof ContactMessage];

    if (valA === undefined || valB === undefined) return 0;

    if (typeof valA === "boolean" && typeof valB === "boolean") {
      const numA = valA ? 1 : 0;
      const numB = valB ? 1 : 0;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    }

    if (typeof valA === "string" && typeof valB === "string") {
      const comp = valA.localeCompare(valB);
      return sortDirection === "asc" ? comp : -comp;
    }

    return 0;
  });

  // 3. Paginate
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    {
      key: "name",
      label: "From",
      sortable: true,
      render: (item: ContactMessage) => (
        <div className="flex items-center gap-2">
          {!item.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
          <div>
            <p className={`text-sm ${!item.isRead ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{item.name}</p>
            <p className="text-xs text-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    { key: "subject", label: "Subject", sortable: true },
    {
      key: "message",
      label: "Preview",
      render: (item: ContactMessage) => (
        <span className="text-sm text-muted truncate max-w-[200px] block">{item.message}</span>
      ),
    },
    {
      key: "isRead",
      label: "Status",
      sortable: true,
      render: (item: ContactMessage) => (
        <Badge variant={!item.isRead ? "warning" : "default"} className="capitalize">
          {!item.isRead ? "Unread" : "Read"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item: ContactMessage) => (
        <span className="text-xs text-muted">{formatMessageDate(item.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: ContactMessage) => {
        const actions = [
          {
            label: "View Message",
            onClick: () => handleMarkRead(item),
            icon: <MessageSquare className="w-3.5 h-3.5 text-primary" />,
          },
          {
            label: "Delete Message",
            onClick: () => handleDelete(item.id),
            icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
            destructive: true,
          },
        ];
        return <ActionMenu items={actions} />;
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader
        title={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        subtitle="View and manage contact form submissions"
      />

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <LoadingState label="Loading messages..." />
      ) : (
        <Table
          columns={columns}
          data={paginated}
          searchable
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onSort={(key, dir) => {
            setSortField(key);
            setSortDirection(dir);
          }}
          page={currentPage}
          totalPages={totalPages || 1}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {/* Message detail drawer */}
      <Drawer
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject ?? "Message"}
        position="right"
        size="md"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <SectionCard>
              <SectionTitle>Sender</SectionTitle>
              <p className="font-bold text-foreground">{selectedMessage.name}</p>
              <p className="text-sm text-muted mt-0.5">{selectedMessage.email}</p>
              <p className="text-xs text-muted mt-1">{formatMessageDate(selectedMessage.createdAt)}</p>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Message</SectionTitle>
              <p className="text-sm text-foreground leading-relaxed">{selectedMessage.message}</p>
            </SectionCard>

            <div className="flex gap-3 pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="flex-1"
              >
                <Button variant="primary" className="w-full text-xs">
                  <Reply className="w-4 h-4" />
                  Reply via Email
                </Button>
              </a>
              <Button variant="danger" className="text-xs" onClick={() => handleDelete(selectedMessage.id)}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
