"use client";

import { useMemo } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
  ChevronRight,
  Copy,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DeepCXHome() {
  // --- Mock de sessão/tenant (substituir depois por Supabase/Auth) ---
  const tenantName = "Demo S.A.";
  const plan = "Gratis"; // sem checkout no MVP
  const quota = 500; // respostas/mês por conta (MVP)
  const used = 145; // total usado neste mês
  const remaining = quota - used; // restantes
  const usedPct = Math.min(100, Math.round((used / quota) * 100));

  // --- Dados mockados para gráficos/cards ---
  const dataRespuestas = [
    { d: "01", r: 12 },
    { d: "02", r: 10 },
    { d: "03", r: 15 },
    { d: "04", r: 9 },
    { d: "05", r: 18 },
    { d: "06", r: 22 },
    { d: "07", r: 19 },
  ];
  const dataNps = [
    { label: "Detractores", value: 21 },
    { label: "Neutros", value: 33 },
    { label: "Promotores", value: 46 },
  ];
  const npsScore = useMemo(() => {
    // cálculo ilustrativo
    const total = dataNps.reduce((a, b) => a + b.value, 0);
    const prom = (dataNps[2].value / total) * 100;
    const det = (dataNps[0].value / total) * 100;
    return Math.round(prom - det);
  }, [dataNps]);

  const recentSurveys = [
    {
      title: "NPS — Tienda Palermo",
      code: "A1B2C3",
      status: "Activa",
      groupBy: "Tienda",
      responses: 87,
      last: "hoy 13:21",
    },
    {
      title: "CSAT — Post-venta",
      code: "H7K9Q2",
      status: "Activa",
      groupBy: "Canal",
      responses: 41,
      last: "ayer 18:04",
    },
    {
      title: "Estrellas — Black Friday",
      code: "Z3X8L1",
      status: "Pausada",
      groupBy: "Campaña",
      responses: 120,
      last: "08/21 10:12",
    },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"]; // vermelho, âmbar, verde (daltônico-friendly)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/15" />
            <span className="text-lg font-semibold">DeepCX</span>
            <Badge variant="secondary" className="ml-2">{tenantName}</Badge>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <Input className="pl-8 w-72" placeholder="Buscar encuestas, códigos, atributos…" />
            </div>
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <Settings className="mr-2 h-4 w-4" /> Preferencias
            </Button>
            <Button size="sm" className="">
              <Plus className="mr-2 h-4 w-4" /> Crear encuesta
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
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold">{plan} — 500 respuestas/mes</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sin límite de encuestas, agrupaciones o visualizaciones. Sólo cuentan las respuestas.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Respuestas restantes</div>
                <div className="text-2xl font-semibold">{remaining}</div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-3">
              <Progress value={usedPct} className="h-2" />
              <span className="text-xs text-muted-foreground">{used} / {quota} usadas</span>
              <div className="ml-auto">
                <Button variant="outline" size="sm">Contactar Ventas</Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center"><TrendingUp className="mr-2 h-4 w-4" /> Respuestas (7d)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{dataRespuestas.reduce((a,b)=>a+b.r,0)}</div>
              <p className="text-xs text-muted-foreground">Total recopiladas en la última semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center"><Users className="mr-2 h-4 w-4" /> NPS promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{npsScore}</div>
              <p className="text-xs text-muted-foreground">Cálculo rápido: promotores − detractores</p>
            </CardContent>
          </Card>
        </section>

        {/* Gráficos */}
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Respuestas por día</CardTitle>
                <Tabs defaultValue="7d" className="w-auto">
                  <TabsList>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                    <TabsTrigger value="90d">90d</TabsTrigger>
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
                  <Tooltip cursor={{ opacity: 0.2 }} />
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Lista de encuestas recentes */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold">Últimas encuestas</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Nueva encuesta
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Título</th>
                  <th className="px-4 py-2 text-left font-medium">Código</th>
                  <th className="px-4 py-2 text-left font-medium">Agrupación</th>
                  <th className="px-4 py-2 text-left font-medium">Estado</th>
                  <th className="px-4 py-2 text-left font-medium">Respuestas</th>
                  <th className="px-4 py-2 text-left font-medium">Última respuesta</th>
                  <th className="px-4 py-2 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentSurveys.map((s) => (
                  <tr key={s.code} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{s.title}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-2 py-1">{s.code}</code>
                    </td>
                    <td className="px-4 py-3">{s.groupBy}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.status === "Activa" ? "default" : "secondary"}>{s.status}</Badge>
                    </td>
                    <td className="px-4 py-3">{s.responses}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.last}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <LinkIcon className="h-4 w-4" /> Compartir
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <QrCode className="h-4 w-4" /> QR
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2"><Copy className="h-4 w-4" /> Copiar enlace</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><Download className="h-4 w-4" /> Exportar respuestas</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4" /> Configurar</DropdownMenuItem>
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
              <Button className="w-full"><Plus className="mr-2 h-4 w-4" /> Crear encuesta</Button>
              <Button variant="outline" className="w-full"><LinkIcon className="mr-2 h-4 w-4" /> Generar enlace</Button>
              <Button variant="outline" className="w-full"><QrCode className="mr-2 h-4 w-4" /> Descargar QR</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Respuestas & export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Exportar CSV</Button>
              <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Exportar Parquet</Button>
              <Button variant="outline" className="w-full"><TrendingUp className="mr-2 h-4 w-4" /> Ver dashboards</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Soporte & límites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Respuestas usadas (mes)</span>
                <span className="font-medium">{used} / {quota}</span>
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
  );
}
