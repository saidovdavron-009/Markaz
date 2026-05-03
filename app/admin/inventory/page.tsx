"use client";
import React from "react";
import { Plus, Package, AlertTriangle, ArrowUp, ArrowDown, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Item { id: number; name: string; sku: string; quantity: number; minLevel: number; }
interface Log { id: number; itemName: string; type: "IN" | "OUT"; quantity: number; reason: string; date: string; }
interface Sale { id: number; studentName: string; itemName: string; amount: number; date: string; }

const initialItems: Item[] = [
  { id: 1, name: "Ingliz tili darsligi", sku: "BK-ENG-001", quantity: 45, minLevel: 10 },
  { id: 2, name: "Matematik masalalar to'plami", sku: "BK-MAT-001", quantity: 8, minLevel: 10 },
  { id: 3, name: "Daftar (katta)", sku: "ST-NOT-001", quantity: 120, minLevel: 30 },
  { id: 4, name: "Qalam to'plami", sku: "ST-PEN-001", quantity: 5, minLevel: 20 },
  { id: 5, name: "Flash karta", sku: "ST-FLC-001", quantity: 60, minLevel: 15 },
];

const initialLogs: Log[] = [
  { id: 1, itemName: "Ingliz tili darsligi", type: "IN", quantity: 50, reason: "Yetkazib berish", date: "2025-01-25" },
  { id: 2, itemName: "Ingliz tili darsligi", type: "OUT", quantity: 5, reason: "Savdo", date: "2025-01-27" },
  { id: 3, itemName: "Daftar (katta)", type: "OUT", quantity: 10, reason: "Sinf uchun", date: "2025-01-26" },
  { id: 4, itemName: "Qalam to'plami", type: "OUT", quantity: 15, reason: "Savdo", date: "2025-01-24" },
];

const initialSales: Sale[] = [
  { id: 1, studentName: "Alibek Karimov", itemName: "Ingliz tili darsligi", amount: 35000, date: "2025-01-27" },
  { id: 2, studentName: "Zulfiya Rahimova", itemName: "Daftar (katta)", amount: 8000, date: "2025-01-26" },
];

const emptyItem = { name: "", sku: "", quantity: "", minLevel: "" };
const emptyLog = { itemId: "", type: "IN" as "IN" | "OUT", quantity: "", reason: "" };
const emptySale = { studentName: "", itemId: "", amount: "" };

export default function InventoryPage() {
  const [items, setItems] = React.useState(initialItems);
  const [logs, setLogs] = React.useState(initialLogs);
  const [sales, setSales] = React.useState(initialSales);
  const [tab, setTab] = React.useState<"items" | "logs" | "sales">("items");
  const [itemModal, setItemModal] = React.useState(false);
  const [logModal, setLogModal] = React.useState(false);
  const [saleModal, setSaleModal] = React.useState(false);
  const [itemForm, setItemForm] = React.useState(emptyItem);
  const [logForm, setLogForm] = React.useState(emptyLog);
  const [saleForm, setSaleForm] = React.useState(emptySale);

  const lowStockItems = items.filter(i => i.quantity <= i.minLevel);

  const handleSaveItem = () => {
    if (!itemForm.name || !itemForm.sku || !itemForm.quantity) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setItems(prev => [...prev, { id: Date.now(), name: itemForm.name, sku: itemForm.sku, quantity: Number(itemForm.quantity), minLevel: Number(itemForm.minLevel) || 10 }]);
    toast.success("Mahsulot qo'shildi");
    setItemModal(false);
    setItemForm(emptyItem);
  };

  const handleSaveLog = () => {
    if (!logForm.itemId || !logForm.quantity) { toast.error("Mahsulot va miqdorni kiriting"); return; }
    const item = items.find(i => i.id === Number(logForm.itemId));
    if (!item) return;
    const qty = Number(logForm.quantity);
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (logForm.type === "IN" ? qty : -qty) } : i));
    setLogs(prev => [{ id: Date.now(), itemName: item.name, type: logForm.type, quantity: qty, reason: logForm.reason || "—", date: new Date().toISOString().split("T")[0] }, ...prev]);
    toast.success(logForm.type === "IN" ? "Kirim qilindi" : "Chiqim qilindi");
    setLogModal(false);
    setLogForm(emptyLog);
  };

  const handleSaveSale = () => {
    if (!saleForm.studentName || !saleForm.itemId || !saleForm.amount) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    const item = items.find(i => i.id === Number(saleForm.itemId));
    if (!item) return;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
    setSales(prev => [{ id: Date.now(), studentName: saleForm.studentName, itemName: item.name, amount: Number(saleForm.amount), date: new Date().toISOString().split("T")[0] }, ...prev]);
    toast.success("Savdo amalga oshirildi");
    setSaleModal(false);
    setSaleForm(emptySale);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Ombor</h1>
          {lowStockItems.length > 0 && <p className="text-sm text-amber-500 mt-1 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" />{lowStockItems.length} ta mahsulot kam</p>}
        </div>
        <div className="flex gap-2">
          {tab === "items" && <Button onClick={() => setItemModal(true)}><Plus className="h-4 w-4" />Mahsulot</Button>}
          {tab === "logs" && <Button onClick={() => setLogModal(true)}><Plus className="h-4 w-4" />Kirim/Chiqim</Button>}
          {tab === "sales" && <Button onClick={() => setSaleModal(true)}><Plus className="h-4 w-4" />Savdo</Button>}
        </div>
      </div>

      <div className="flex gap-2">
        {([["items", "Mahsulotlar"], ["logs", "Harakat"], ["sales", "Savdolar"]] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-[#1E3A5F] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const isLow = item.quantity <= item.minLevel;
            return (
              <Card key={item.id} className={isLow ? "border-amber-300" : ""}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${isLow ? "bg-amber-100" : "bg-[#1E3A5F]/10"}`}>
                        <Package className={`h-4 w-4 ${isLow ? "text-amber-600" : "text-[#1E3A5F]"}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{item.sku}</p>
                      </div>
                    </div>
                    {isLow && <Badge variant="warning">Kam</Badge>}
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-[var(--muted-foreground)]">Qoldiq</span>
                    <span className={`font-bold ${isLow ? "text-amber-500" : "text-[#1E3A5F]"}`}>{item.quantity} ta</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isLow ? "bg-amber-400" : "bg-green-500"}`} style={{ width: `${Math.min((item.quantity / (item.minLevel * 3)) * 100, 100)}%` }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {tab === "logs" && (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${log.type === "IN" ? "bg-green-100" : "bg-red-100"}`}>
                {log.type === "IN" ? <ArrowDown className="h-4 w-4 text-green-600" /> : <ArrowUp className="h-4 w-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{log.itemName}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{log.reason} • {log.date}</p>
              </div>
              <span className={`font-bold text-sm shrink-0 ${log.type === "IN" ? "text-green-600" : "text-red-500"}`}>
                {log.type === "IN" ? "+" : "-"}{log.quantity}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "sales" && (
        <div className="space-y-2">
          {sales.map(sale => (
            <div key={sale.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
              <div className="h-9 w-9 rounded-lg bg-[#1E3A5F]/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-4 w-4 text-[#1E3A5F]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{sale.studentName}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{sale.itemName} • {sale.date}</p>
              </div>
              <span className="font-bold text-sm shrink-0 text-green-600">{sale.amount.toLocaleString()} so'm</span>
            </div>
          ))}
        </div>
      )}

      <Modal open={itemModal} onOpenChange={setItemModal} size="sm">
        <ModalHeader><ModalTitle>Yangi mahsulot</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="Nomi *" value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))} placeholder="Darslik nomi" />
          <Input label="SKU *" value={itemForm.sku} onChange={e => setItemForm(f => ({ ...f, sku: e.target.value }))} placeholder="BK-001" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Miqdor *" type="number" value={itemForm.quantity} onChange={e => setItemForm(f => ({ ...f, quantity: e.target.value }))} placeholder="50" />
            <Input label="Min. daraja" type="number" value={itemForm.minLevel} onChange={e => setItemForm(f => ({ ...f, minLevel: e.target.value }))} placeholder="10" />
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setItemModal(false)}>Bekor</Button>
          <Button onClick={handleSaveItem}>Saqlash</Button>
        </ModalFooter>
      </Modal>

      <Modal open={logModal} onOpenChange={setLogModal} size="sm">
        <ModalHeader><ModalTitle>Kirim / Chiqim</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Mahsulot *</label>
            <select value={logForm.itemId} onChange={e => setLogForm(f => ({ ...f, itemId: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              <option value="">Tanlang</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            {(["IN", "OUT"] as const).map(t => (
              <button key={t} onClick={() => setLogForm(f => ({ ...f, type: t }))}
                className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-colors ${logForm.type === t ? "bg-[#1E3A5F] text-white border-[#1E3A5F]" : "border-[var(--border)] text-[var(--muted-foreground)]"}`}>
                {t === "IN" ? "Kirim" : "Chiqim"}
              </button>
            ))}
          </div>
          <Input label="Miqdor *" type="number" value={logForm.quantity} onChange={e => setLogForm(f => ({ ...f, quantity: e.target.value }))} placeholder="10" />
          <Input label="Sabab" value={logForm.reason} onChange={e => setLogForm(f => ({ ...f, reason: e.target.value }))} placeholder="Yetkazib berish / Savdo..." />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setLogModal(false)}>Bekor</Button>
          <Button onClick={handleSaveLog}>Saqlash</Button>
        </ModalFooter>
      </Modal>

      <Modal open={saleModal} onOpenChange={setSaleModal} size="sm">
        <ModalHeader><ModalTitle>Kitob savdosi</ModalTitle></ModalHeader>
        <div className="p-6 space-y-3">
          <Input label="O'quvchi ismi *" value={saleForm.studentName} onChange={e => setSaleForm(f => ({ ...f, studentName: e.target.value }))} placeholder="To'liq ism" />
          <div>
            <label className="text-sm font-medium mb-1.5 block">Mahsulot *</label>
            <select value={saleForm.itemId} onChange={e => setSaleForm(f => ({ ...f, itemId: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]">
              <option value="">Tanlang</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.quantity} ta)</option>)}
            </select>
          </div>
          <Input label="Narxi (so'm) *" type="number" value={saleForm.amount} onChange={e => setSaleForm(f => ({ ...f, amount: e.target.value }))} placeholder="35000" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setSaleModal(false)}>Bekor</Button>
          <Button onClick={handleSaveSale}>Saqlash</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
