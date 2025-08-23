"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  QrCode,
  Link as LinkIcon,
  Download,
  Settings,
  TrendingUp,
  Users,
  Search,
  MoreVertical,
  Copy,
  Filter,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * DeepCX — Home (Usuario logueado)
 * - Idioma: es-AR
 * - Foco: qualidade visual, acessibilidade, DX e robustez
 * - Pronto para conectar Supabase (tenants, quota, usage)
 */

// --------- Tipos ---------
interface NpsBucket { label: "Detractores" | "Neutros" | "Promotores"; value: number }
interface RespuestasDia { d: string; r: number }
interface SurveyRow {
  title: string;
  code: string; // surveyCode (base36)
  status: "Activa" | "Pausada" | "Finalizada";
  groupBy: string;
  responses: number;
  last: string; // human readable
}

// --------- Constantes/util ---------
const QUOTA_DEFAULT = 500 as const;
const COLORS = ["#ef4444", "#f59e0b", "#22c55e"] as const; // rojo / ámbar / verde
const nf = new Intl.NumberFormat("es-AR");
const NL = String.fromCharCode(10); // \n seguro, evita quebras acidentais em build
const BOM = "\uFEFF" as const; // BOM para Excel reconhecer UTF-8

const getTenantHost = () => {
  if (typeof window !== "undefined" && window.location?.host) return window.location.host;
  return "empresateste.deepcx.tech"; // fallback
};

const getAriaSort = (sortBy: string, column: string): "ascending" | "descending" | "none" => {
  if (sortBy !== column) return "none";
  // Só ordenação descendente por padrão (mais úteis no topo)
  return "descending";
};

export default function DeepCXHome() {
  const { toast } = useToast();

  // Sessão/tenant (stub) — trocar por Supabase/Auth
  const tenantName = "Demo S.A.";
  const planLabel = "Gratis";
  const quota = QUOTA_DEFAULT; // respostas/mês por conta (MVP)
  const used = 145; // mock — virá de aggregated usage
  const remaining = Math.max(0, quota - used);
  const usedPct = Math.min(100, Math.round((used / quota) * 100));

  // Estado de UI
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"responses" | "last" | "title">("responses");

  // Dados mockados — substituir pelas consultas reais
  const baseRespuestas: RespuestasDia[] = [
    { d: "01", r: 12 },
    { d: "02", r: 10 },
    { d: "03", r: 15 },
    { d: "04", r: 9 },
    { d: "05", r: 18 },
    { d: "06", r: 22 },
    { d: "07", r: 19 },
  ];

  const dataRespuestas = useMemo<RespuestasDia[]>(() => {
    // pequena variação fake por range (placeholder)
    if (range === "30d") return baseRespuestas.map((x, i) => ({ ...x, r: x.r + ((i % 3) - 1) * 2 }));
    if (range === "90d") return baseRespuestas.map((x, i) => ({ ...x, r: x.r + ((i % 2) ? 3 : -1) }));
    return baseRespuestas;
  }, [range]);

  const dataNps: NpsBucket[] = [
    { label: "Detractores", value: 21 },
    { label: "Neutros", value: 33 },
    { label: "Promotores", value: 46 },
  ];

  const npsScore = useMemo(() => {
    const total = dataNps.reduce((a, b) => a + b.value, 0) || 1;
    const prom = (dataNps.find(d => d.label === "Promotores")!.value / total) * 100;
    const det = (dataNps.find(d => d.label === "Detractores")!.value / total) * 100;
    return Math.round(prom - det);
  }, [dataNps]);

  const surveys: SurveyRow[] = [
    { title: "NPS — Tienda Palermo", code: "A1B2C3", status: "Activa", groupBy: "Tienda", responses: 87, last: "hoy 13:21" },
    { title: "CSAT — Post-venta", code: "H7K9Q2", status: "Activa", groupBy: "Canal", responses: 41, last: "ayer 18:04" },
    { title: "Estrellas — Black Friday", code: "Z3X8L1", status: "Pausada", groupBy: "Campaña", responses: 120, last: "08/21 10:12" },
  ];

  const filteredSorted = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    const base = qLower
      ? surveys.filter((s) => `${s.title} ${s.code} ${s.groupBy}`.toLowerCase().includes(qLower))
      : surveys;
    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case "responses":
          return b.responses - a.responses;
        case "title":
          return a.title.localeCompare(b.title);
        case "last":
          return b.last.localeCompare(a.last);
        default:
          return 0;
      }
    });
    return sorted;
  }, [q, sortBy, surveys]);

  // --------- Utils ---------
  const shareUrl = (code: string) => `https://${getTenantHost()}/${code}`;

  const copyToClipboard = async (text: string, successMsg = "Copiado al portapapeles") => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      toast({ description: successMsg });
    } catch (e) {
      toast({ description: "No se pudo copiar", variant: "destructive" });
    }
  };

  const makeCSV = (rows: SurveyRow[]) => {
    const header = ["Título", "Código", "Agrupación", "Estado", "Respuestas", "Última respuesta"];
    const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
    const lines = [header, ...rows.map(r => [r.title, r.code, r.groupBy, r.status, String(r.responses), r.last])]
      .map(cols => cols.map(esc).join(","));
    return BOM + lines.join(NL);
  };

  const downloadCSV = (rows: SurveyRow[]) => {
    const csv = makeCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepcx-encuestas-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tryWebShare = async (url: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: "Encuesta DeepCX", url }); return true; } catch { /* usuário cancelou */ }
    }
    return false;
  };

  // --------- Render ---------
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/15" aria-hidden />
              <span className="text-lg font-semibold">DeepCX</span>
              <Badge variant="secondary" className="ml-2" aria-label={`Tenant ${tenantName}`}>{tenantName}</Badge>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block" role="search">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                <Input
                  className="pl-8 w-72"
                  placeholder="Buscar encuestas, códigos, atributos…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Buscar"
                />
              </div>
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                <Settings className="mr-2 h-4 w-4" aria-hidden /> Preferencias
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" aria-hidden /> Crear encuesta
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="mx-auto max-w-7xl px-4 py-6">
          {/* Resumo/Estado da conta */}
          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Plan actual</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-2xl font-semibold">{planLabel} — {QUOTA_DEFAULT} respuestas/mes</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sin límite de encuestas, agrupaciones o visualizaciones. Sólo cuentan las respuestas.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Respuestas restantes</div>
                  <div className="text-2xl font-semibold" aria-live="polite">{nf.format(remaining)}</div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center gap-3">
                <Progress value={usedPct} className="h-2" aria-label={`Uso de cuota: ${used} de ${quota}`} />
                <span className="text-xs text-muted-foreground">{nf.format(used)} / {nf.format(quota)} usadas</span>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">Contactar Ventas</Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center"><TrendingUp className="mr-2 h-4 w-4" aria-hidden /> Respuestas ({range})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{nf.format(dataRespuestas.reduce((a,b)=>a+b.r,0))}</div>
                <p className="text-xs text-muted-foreground">Total recopiladas en el periodo seleccionado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center"><Users className="mr-2 h-4 w-4" aria-hidden /> NPS promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{npsScore}</div>
                <p className="text-xs text-muted-foreground">Promotores − Detractores (en %)</p>
              </CardContent>
            </Card>
          </section>

          {/* Gráficos */}
          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Respuestas por día</CardTitle>
                  <Tabs value={range} className="w-auto">
                    <TabsList>
                      <TabsTrigger value="7d" onClick={() => setRange("7d")} aria-label="7 días">7d</TabsTrigger>
                      <TabsTrigger value="30d" onClick={() => setRange("30d")} aria-label="30 días">30d</TabsTrigger>
                      <TabsTrigger value="90d" onClick={() => setRange("90d")} aria-label="90 días">90d</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataRespuestas} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="d" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                    <RTooltip cursor={{ opacity: 0.2 }} />
                    <Line type="monotone" dataKey="r" stroke="currentColor" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Distribución NPS</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dataNps} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {dataNps.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Lista de encuestas recentes */}
          <section className="mb-6">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold">Últimas encuestas</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadCSV(filteredSorted)}>
                  <Download className="mr-2 h-4 w-4" aria-hidden /> Exportar CSV
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" aria-hidden /> Nueva encuesta
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border">
              <div className="flex items-center justify-between gap-2 border-b p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" aria-hidden /> Ordenar por
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        {sortBy === "responses" ? "Respuestas" : sortBy === "title" ? "Título" : "Última respuesta"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setSortBy("responses")}>Respuestas</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("title")}>Título</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("last")}>Última respuesta</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th scope="col" aria-sort={getAriaSort(sortBy, "title")} className="px-4 py-2 text-left font-medium">Título</th>
                    <th scope="col" className="px-4 py-2 text-left font-medium">Código</th>
                    <th scope="col" className="px-4 py-2 text-left font-medium">Agrupación</th>
                    <th scope="col" className="px-4 py-2 text-left font-medium">Estado</th>
                    <th scope="col" aria-sort={getAriaSort(sortBy, "responses")} className="px-4 py-2 text-left font-medium">Respuestas</th>
                    <th scope="col" aria-sort={getAriaSort(sortBy, "last")} className="px-4 py-2 text-left font-medium">Última respuesta</th>
                    <th scope="col" className="px-4 py-2 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                        No encontramos encuestas para "{q}". Intentá cambiar el término de búsqueda.
                      </td>
                    </tr>
                  )}
                  {filteredSorted.map((s) => (
                    <tr key={s.code} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{s.title}</td>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-2 py-1">{s.code}</code>
                      </td>
                      <td className="px-4 py-3">{s.groupBy}</td>
                      <td className="px-4 py-3">
                        <Badge variant={s.status === "Activa" ? "default" : s.status === "Pausada" ? "secondary" : "outline"}>{s.status}</Badge>
                      </td>
                      <td className="px-4 py-3">{nf.format(s.responses)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.last}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => copyToClipboard(shareUrl(s.code), "Enlace copiado")}
                                aria-label="Copiar enlace"
                              >
                                <Copy className="h-4 w-4" aria-hidden />
                                <span className="hidden sm:inline">Copiar</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copiar enlace</TooltipContent>
                          </Tooltip>

                          <Dialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="gap-2" aria-label="Mostrar QR">
                                    <QrCode className="h-4 w-4" aria-hidden />
                                    <span className="hidden sm:inline">QR</span>
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Ver QR</TooltipContent>
                            </Tooltip>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>QR de la encuesta</DialogTitle>
                                <DialogDescription>{shareUrl(s.code)}</DialogDescription>
                              </DialogHeader>
                              <div className="flex items-center justify-center p-4">
                                {/* QR via serviço público — trocar por geração local/Edge até o GA */}
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl(s.code))}`}
                                  alt={`Código QR para ${s.title}`}
                                  className="rounded-lg border"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => copyToClipboard(shareUrl(s.code), "Enlace copiado")}>Copiar enlace</Button>
                                <Button onClick={() => window.open(shareUrl(s.code), "_blank", "noopener,noreferrer")}>Abrir</Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Sheet>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                    aria-label="Compartir"
                                    onClick={async () => {
                                      const url = shareUrl(s.code);
                                      const shared = await tryWebShare(url);
                                      if (!shared) toast({ description: "Usá el panel para copiar el enlace" });
                                    }}
                                  >
                                    <LinkIcon className="h-4 w-4" aria-hidden />
                                    <span className="hidden sm:inline">Compartir</span>
                                  </Button>
                                </SheetTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Compartir</TooltipContent>
                            </Tooltip>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Compartir encuesta</SheetTitle>
                                <SheetDescription>
                                  Enviá este enlace por email, WhatsApp o pegalo en tu sitio.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="mt-4 space-y-3">
                                <div className="text-sm">Enlace</div>
                                <div className="flex items-center gap-2">
                                  <Input readOnly value={shareUrl(s.code)} />
                                  <Button variant="outline" onClick={() => copyToClipboard(shareUrl(s.code))}><Copy className="h-4 w-4" /></Button>
                                </div>
                                <Separator />
                                <div className="text-sm">HTML (botón)</div>
                                <pre className="overflow-auto rounded-md border bg-muted p-3 text-xs">
{`<a href="${shareUrl(s.code)}" target="_blank" rel="noopener noreferrer" class="btn">Responder encuesta</a>`}
                                </pre>
                              </div>
                            </SheetContent>
                          </Sheet>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Más acciones">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(shareUrl(s.code), "_blank", "noopener,noreferrer")} className="gap-2">
                                <LinkIcon className="h-4 w-4" /> Abrir enlace
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(s.code, "Código copiado")} className="gap-2">
                                <Copy className="h-4 w-4" /> Copiar código
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Settings className="h-4 w-4" /> Configurar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast({ description: "Exportación en camino" })} className="gap-2">
                                <Download className="h-4 w-4" /> Exportar respuestas
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Atajos rápidos */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Crear y compartir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full"><Plus className="mr-2 h-4 w-4" aria-hidden /> Crear encuesta</Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => copyToClipboard(shareUrl("A1B2C3"))}
                >
                  <LinkIcon className="mr-2 h-4 w-4" aria-hidden /> Copiar enlace
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full"><QrCode className="mr-2 h-4 w-4" aria-hidden /> Descargar QR</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>QR de ejemplo</DialogTitle>
                      <DialogDescription>{shareUrl("A1B2C3")}</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl("A1B2C3"))}`}
                        alt="Código QR de ejemplo"
                        className="rounded-lg border"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Respuestas & export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => downloadCSV(filteredSorted)}><Download className="mr-2 h-4 w-4" aria-hidden /> Exportar CSV</Button>
                <Button variant="outline" className="w-full" onClick={() => toast({ description: "Exportar Parquet (próximamente)" })}><Download className="mr-2 h-4 w-4" aria-hidden /> Exportar Parquet</Button>
                <Button variant="outline" className="w-full"><TrendingUp className="mr-2 h-4 w-4" aria-hidden /> Ver dashboards</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Soporte & límites</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Respuestas usadas (mes)</span>
                  <span className="font-medium">{nf.format(used)} / {nf.format(quota)}</span>
                </div>
                <Progress value={usedPct} className="h-2" />
                <Button variant="outline" className="w-full">Contactar Ventas</Button>
                <p className="text-xs text-muted-foreground">
                  ¿Necesitás más respuestas? Nuestro equipo puede habilitar límites personalizados.
                </p>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-4 py-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} DeepCX. Ley 25.326 — AAIP. Privacidad • Términos.
        </footer>
      </div>
    </TooltipProvider>
  );
}