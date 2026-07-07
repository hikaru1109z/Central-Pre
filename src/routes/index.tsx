import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Search,
  BookOpen,
  BookMarked,
  Zap,
  FileText,
  Sparkles,
  Download,
  Bookmark,
  GraduationCap,
  Building2,
  NotebookPen,
  Users,
  Clock,
  ArrowRight,
  Check,
  Play,
  RefreshCw,
  Video,
  ScrollText,
  ClipboardList,
  FileQuestion,
  Send,
  Atom,
  Calculator,
  FlaskConical,
  Compass,
  TrendingUp,
  Globe,
  Landmark,
  Feather,
  BrainCircuit,
  Leaf,
  Library,
  Youtube,
  ChevronLeft,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ─────────────────────────── DATA ─────────────────────────── */

type ExamBlock = {
  id: string;
  name: string;
  examLink: string;
  solutionLink: string;
};

type UniExam = {
  id: string;
  title: string;
  description: string;
  university: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  blocks: ExamBlock[];
};

const UNI_EXAM: UniExam = {
  id: "uni-2026-i",
  title: "Examen de Admisión UNI 2026-I",
  description: "Pruebas oficiales del último proceso de admisión, divididas por días según el formato real de la UNI. Ideal para medir tu nivel.",
  university: "Universidad Nacional de Ingeniería",
  icon: GraduationCap,
  color: "from-blue-600 to-indigo-700",
  blocks: [
    {
      id: "block-a",
      name: "Bloque A: Aptitud Académica y Humanidades",
      examLink: "https://drive.google.com/file/d/1thbOyN2Vi3AK1-8_XPFq9IlNN1SGwCwX/view?usp=sharing",
      solutionLink: "https://drive.google.com/file/d/1x8mbuAqu10S1K9BlZYHTSq_9Ab5KPXAS/view?usp=drive_link",
    },
    {
      id: "block-b",
      name: "Bloque B: Matemáticas",
      examLink: "https://drive.google.com/file/d/17bIUGZzVufarb2SYBXVeBG2188IMYzqQ/view?usp=sharing",
      solutionLink: "https://drive.google.com/file/d/1OPJAfmWL6wkuGVxQNFZSR-RDlM4yR1Jc/view?usp=drive_link",
    },
    {
      id: "block-c",
      name: "Bloque C: Física y Química",
      examLink: "https://drive.google.com/file/d/1ila5CefjNhPCAY9jXKbcfzRq79_eE7z-/view?usp=sharing",
      solutionLink: "https://drive.google.com/file/d/1g6C4wTdXblqSgNxVnrW24TuHBnf14QMh/view?usp=drive_link",
    },
  ],
};

/* ─────────────────────────── ACADEMIA DATA ─────────────────────────── */

type Course = {
  id: string;
  name: string;
  level: "Básico" | "Intermedio" | "Avanzado";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  blackboardCount: number;
};

type Academy = {
  id: string;
  name: string;
  logo?: string;
  color: string;
  courses: Course[];
};

const ACADEMIES: Academy[] = [
  {
    id: "cepre-uni",
    name: "CEPRE-UNI",
    color: "from-blue-600 to-indigo-700",
    courses: [
      { id: "c-algebra", name: "Álgebra", level: "Intermedio", icon: Calculator, color: "from-blue-500 to-indigo-600", blackboardCount: 24 },
      { id: "c-fisica", name: "Física", level: "Básico", icon: Zap, color: "from-cyan-500 to-blue-600", blackboardCount: 18 },
      { id: "c-quimica", name: "Química", level: "Intermedio", icon: FlaskConical, color: "from-emerald-500 to-teal-600", blackboardCount: 20 },
      { id: "c-geometria", name: "Geometría", level: "Intermedio", icon: Compass, color: "from-violet-500 to-purple-600", blackboardCount: 15 },
      { id: "c-trigo", name: "Trigonometría", level: "Avanzado", icon: Atom, color: "from-fuchsia-500 to-pink-600", blackboardCount: 12 },
    ],
  },
  {
    id: "cesar-vallejo",
    name: "Academia César Vallejo",
    color: "from-orange-600 to-red-700",
    courses: [
      { id: "cv-algebra", name: "Álgebra", level: "Básico", icon: Calculator, color: "from-orange-500 to-amber-600", blackboardCount: 20 },
      { id: "cv-fisica", name: "Física", level: "Intermedio", icon: Zap, color: "from-red-500 to-orange-600", blackboardCount: 16 },
      { id: "cv-quimica", name: "Química", level: "Avanzado", icon: FlaskConical, color: "from-yellow-500 to-orange-600", blackboardCount: 14 },
    ],
  },
  {
    id: "aduni",
    name: "Academia ADUNI",
    color: "from-green-600 to-teal-700",
    courses: [
      { id: "a-algebra", name: "Álgebra", level: "Intermedio", icon: Calculator, color: "from-green-500 to-emerald-600", blackboardCount: 18 },
      { id: "a-fisica", name: "Física", level: "Básico", icon: Zap, color: "from-teal-500 to-cyan-600", blackboardCount: 15 },
      { id: "a-quimica", name: "Química", level: "Intermedio", icon: FlaskConical, color: "from-lime-500 to-green-600", blackboardCount: 12 },
    ],
  },
];

/* ─────────────────────────── VIDEO DATA ─────────────────────────── */

type VideoCourse = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  videoCount: number;
  academies: string[];
  playlistUrl: string;
};

const VIDEO_COURSES: VideoCourse[] = [
  {
    id: "v-algebra",
    name: "Álgebra",
    icon: Calculator,
    color: "from-blue-500 to-indigo-600",
    videoCount: 24,
    academies: ["CEPRE-UNI", "César Vallejo"],
    playlistUrl: "https://youtube.com/playlist?list=example1",
  },
  {
    id: "v-fisica",
    name: "Física",
    icon: Zap,
    color: "from-cyan-500 to-blue-600",
    videoCount: 18,
    academies: ["CEPRE-UNI", "ADUNI"],
    playlistUrl: "https://youtube.com/playlist?list=example2",
  },
  {
    id: "v-quimica",
    name: "Química",
    icon: FlaskConical,
    color: "from-emerald-500 to-teal-600",
    videoCount: 20,
    academies: ["César Vallejo", "ADUNI"],
    playlistUrl: "https://youtube.com/playlist?list=example3",
  },
  {
    id: "v-trigo",
    name: "Trigonometría",
    icon: Atom,
    color: "from-fuchsia-500 to-pink-600",
    videoCount: 15,
    academies: ["CEPRE-UNI"],
    playlistUrl: "https://youtube.com/playlist?list=example4",
  },
];

/* ─────────────────────────── LIBRARY DATA ─────────────────────────── */

type Book = {
  id: string;
  title: string;
  collection: string;
  year: string;
  coverUrl?: string;
  pdfUrl: string;
};

type Editorial = {
  id: string;
  name: string;
  logo?: string;
  color: string;
  books: Book[];
};

const EDITORIALES: Editorial[] = [
  {
    id: "lumbreras",
    name: "Editorial Lumbreras",
    color: "from-red-600 to-orange-700",
    books: [
      { id: "l1", title: "Álgebra Básico", collection: "Colección Esencial", year: "2024", pdfUrl: "#" },
      { id: "l2", title: "Física General", collection: "Colección Esencial", year: "2024", pdfUrl: "#" },
      { id: "l3", title: "Historia del Perú", collection: "Ciencias y Humanidades", year: "2023", pdfUrl: "#" },
      { id: "l4", title: "Problemas de Álgebra", collection: "Problemas Resueltos", year: "2024", pdfUrl: "#" },
    ],
  },
  {
    id: "cuzcano",
    name: "Editorial Cuzcano",
    color: "from-purple-600 to-indigo-700",
    books: [
      { id: "c1", title: "Folleto de Exponentes", collection: "Folletos por Temas", year: "2024", pdfUrl: "#" },
      { id: "c2", title: "Folleto de Trigonometría", collection: "Folletos por Temas", year: "2024", pdfUrl: "#" },
      { id: "c3", title: "Química Completo", collection: "Libros Completos", year: "2023", pdfUrl: "#" },
    ],
  },
  {
    id: "otras",
    name: "Otras Editoriales",
    color: "from-teal-600 to-cyan-700",
    books: [
      { id: "o1", title: "Matemática San Marcos", collection: "San Marcos", year: "2024", pdfUrl: "#" },
      { id: "o2", title: "Física Racso", collection: "Racso", year: "2023", pdfUrl: "#" },
      { id: "o3", title: "Química Moshero", collection: "Moshero", year: "2024", pdfUrl: "#" },
    ],
  },
];

type Flashcard = { id: string; course: string; topic: string; front: string; formula: string; example: string; icon: React.ComponentType<{ className?: string }> };

const FLASHCARDS: Flashcard[] = [
  { id: "f1", course: "Física", topic: "MRU", front: "Movimiento Rectilíneo Uniforme", formula: "d = v · t", example: "v=10 m/s, t=5s → d=50 m", icon: Zap },
  { id: "f2", course: "Física", topic: "MRUV", front: "Velocidad final", formula: "vf = vi + a · t", example: "vi=0, a=2, t=3 → vf=6 m/s", icon: Zap },
  { id: "f3", course: "Física", topic: "Ley de Ohm", front: "Voltaje-Corriente", formula: "V = I · R", example: "I=2A, R=5Ω → V=10V", icon: Atom },
  { id: "f4", course: "Álgebra", topic: "Binomio al cuadrado", front: "Producto notable", formula: "(a+b)² = a² + 2ab + b²", example: "(x+3)² = x²+6x+9", icon: Calculator },
  { id: "f5", course: "Trigonometría", topic: "Identidad Pitagórica", front: "Fundamental", formula: "sen²x + cos²x = 1", example: "Válida para todo x∈ℝ", icon: Compass },
  { id: "f6", course: "Química", topic: "Concentración molar", front: "Molaridad", formula: "M = n / V", example: "2 mol / 1L → M=2", icon: FlaskConical },
  { id: "f7", course: "Geometría", topic: "Área del círculo", front: "Circunferencia", formula: "A = π · r²", example: "r=3 → A=9π", icon: Compass },
];

type MockExam = { id: string; university: string; questions: number; duration: string; level: string };
const MOCK_EXAMS: MockExam[] = [
  { id: "m1", university: "UNI", questions: 100, duration: "3h 00min", level: "Avanzado" },
  { id: "m2", university: "UNMSM", questions: 100, duration: "3h 00min", level: "Intermedio" },
  { id: "m3", university: "PUCP", questions: 80, duration: "2h 30min", level: "Intermedio" },
  { id: "m4", university: "UNFV", questions: 100, duration: "3h 00min", level: "Intermedio" },
  { id: "m5", university: "UNAC", questions: 90, duration: "2h 45min", level: "Básico" },
  { id: "m6", university: "La Agraria", questions: 100, duration: "3h 00min", level: "Avanzado" },
];

type CommunityPost = { id: string; name: string; course: string; title: string; description: string; category: string; date: string };
const INITIAL_POSTS: CommunityPost[] = [
  { id: "c1", name: "María Fernández", course: "Álgebra", title: "Resumen de Ecuaciones Cuadráticas", description: "Compilado de fórmulas y 20 ejercicios resueltos paso a paso.", category: "PDF", date: "Hace 2 horas" },
  { id: "c2", name: "Diego Ramírez", course: "Historia", title: "Línea de tiempo — Perú Republicano", description: "Infografía con los principales hitos desde 1821 hasta 1980.", category: "Resumen", date: "Ayer" },
  { id: "c3", name: "Ana Torres", course: "Química", title: "Tabla periódica anotada", description: "Configuración electrónica y propiedades destacadas.", category: "PDF", date: "Hace 3 días" },
];

const RESOURCE_TABS = [
  { key: "pdf", label: "PDFs", icon: FileText, items: ["Compendio Álgebra UNI", "Prácticas Química PUCP", "Manual Biología UNMSM", "Cuaderno Trigonometría"] },
  { key: "video", label: "Videos", icon: Video, items: ["Clases MRUV — 45 min", "Enlace Químico visual", "Historia del Perú resumida", "Trigonometría desde cero"] },
  { key: "resumen", label: "Resúmenes", icon: ScrollText, items: ["Fórmulas físicas esenciales", "Literatura peruana clave", "Economía en 20 páginas", "Filosofía en mapas"] },
  { key: "simulacros", label: "Simulacros", icon: ClipboardList, items: ["Simulacro UNI 2025", "Simulacro UNMSM", "Simulacro PUCP", "Test rápido 30 min"] },
  { key: "examenes", label: "Exámenes", icon: FileQuestion, items: ["UNI 2024-I", "UNMSM 2024", "PUCP 2024-II", "UNFV 2023"] },
] as const;

/* ─────────────────────────── SEARCH INDEX ─────────────────────────── */

function useDebounced<T>(value: T, delay = 200): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function matches(query: string, ...fields: string[]) {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  return fields.some((f) => f.toLowerCase().includes(q));
}

/* ─────────────────────────── COMPONENTS ─────────────────────────── */

function Navbar({ query, setQuery, activeSection, setActiveSection }: { 
  query: string; 
  setQuery: (v: string) => void;
  activeSection: string;
  setActiveSection: (v: string) => void;
}) {
  const sections = [
    { id: "examenes", label: "🎯 Exámenes", icon: FileText },
    { id: "recursos", label: "📚 Recursos", icon: BookOpen },
    { id: "biblioteca", label: "📖 Biblioteca", icon: Library },
    { id: "flashcards", label: "⚡ Flashcards", icon: Zap },
    { id: "comunidad", label: "👥 Comunidad", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Top row: Logo + Search */}
        <div className="flex items-center gap-3">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-accent)" }}>
              <span className="font-display text-base font-extrabold text-white">CP</span>
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="truncate font-display text-base font-bold leading-tight text-foreground">Central Pre</div>
              <div className="truncate text-xs text-muted-foreground">Plataforma Preuniversitaria</div>
            </div>
          </a>

          <div className="relative ml-auto w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cursos, apuntes, fórmulas..."
              aria-label="Buscar en Central Pre"
              className="h-11 rounded-full border-border bg-surface-2 pl-10 pr-4 text-sm shadow-sm focus-visible:ring-primary/40"
            />
          </div>
        </div>

        {/* Bottom row: Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 border-t border-border/40 pt-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-surface-2 text-foreground hover:bg-primary/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label.split(" ").slice(1).join(" ")}</span>
                <span className="sm:hidden">{section.label.split(" ").slice(1).join(" ")}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section
      id="top"
      className="relative overflow-hidden text-white"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="hero-pattern absolute inset-0 opacity-70" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,159,28,0.35), transparent 70%)" }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(30,107,184,0.5), transparent 70%)" }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge className="mb-6 inline-flex items-center gap-1.5 rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#FF9F1C]" />
            Plataforma preuniversitaria peruana
          </Badge>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Todo tu material preuniversitario{" "}
            <span className="bg-gradient-to-r from-[#FF9F1C] to-[#FFD27A] bg-clip-text text-transparent">en un solo lugar</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Organiza tus apuntes, encuentra recursos de calidad, repasa fórmulas y prepárate para ingresar a la universidad con una plataforma diseñada para maximizar tu rendimiento académico.
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            {[
              { icon: "🎯", label: "Exámenes", id: "examenes" },
              { icon: "�", label: "Recursos", id: "recursos" },
              { icon: "📖", label: "Biblioteca", id: "biblioteca" },
            ].map((b) => (
              <motion.button
                key={b.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => scrollTo(b.id)}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-lg shadow-black/20 transition-shadow hover:shadow-xl sm:text-base"
              >
                <span className="text-lg">{b.icon}</span>
                {b.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("es-PE")}
      {suffix}
    </span>
  );
}

export function Stats() {
  const stats = [
    { icon: "📚", label: "Materiales", value: 350, prefix: "+" },
    { icon: "📝", label: "Fórmulas", value: 120, prefix: "+" },
    { icon: "👨‍🎓", label: "Estudiantes", value: 2500, prefix: "+" },
    { icon: "🏛️", label: "Universidades", value: 8, prefix: "" },
  ];
  return (
    <section className="relative -mt-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-4 shadow-md sm:gap-4 sm:p-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-muted/50 p-4 text-center sm:p-6"
            >
              <div className="mb-2 text-3xl">{s.icon}</div>
              <div className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                {s.prefix}
                <Counter to={s.value} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>}
    </div>
  );
}

/* ─────────────────────────── DEFINICIÓN DE DATOS ─────────────────────────── */

interface Material {
  id: string;
  course: string;
  topic: string;
  description: string;
  level: string;
  university: string;
  time: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* ─────────────────────────── COMPONENTE ─────────────────────────── */

export function MaterialCard({ m, onOpen }: { m: Material; onOpen: (m: Material) => void }) {
  const Icon = m.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group flex flex-col"
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border bg-card p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md", m.color)}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="gap-1 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10">
            <FileText className="h-3 w-3" /> PDF
          </Badge>
        </div>

        <div className="mt-4 flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">{m.course}</div>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-foreground line-clamp-1">{m.topic}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{m.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full text-xs">{m.level}</Badge>
          <Badge variant="outline" className="gap-1 rounded-full text-xs">
            <GraduationCap className="h-3 w-3" /> {m.university}
          </Badge>
          <Badge variant="outline" className="gap-1 rounded-full text-xs">
            <Clock className="h-3 w-3" /> {m.time}
          </Badge>
        </div>

        <Button
          onClick={() => onOpen(m)}
          className="mt-5 w-full rounded-full bg-primary text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90"
        >
          Ver Material <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
}

export function MaterialDialog({ material, onClose }: { material: Material | null; onClose: () => void }) {
  return (
    <Dialog open={!!material} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl">
        {material && (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">{material.course}</Badge>
                <Badge variant="secondary" className="gap-1 rounded-full">
                  <FileText className="h-3 w-3" /> PDF
                </Badge>
              </div>
              <DialogTitle className="font-display text-2xl">{material.topic}</DialogTitle>
              <DialogDescription>{material.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted to-card shadow-inner">
                <div className="absolute inset-3 space-y-2 rounded-lg bg-card p-3 shadow-sm">
                  <div className="h-2 w-3/4 rounded bg-primary/30" />
                  <div className="h-2 w-1/2 rounded bg-muted" />
                  <div className="h-1.5 w-full rounded bg-muted" />
                  <div className="h-1.5 w-5/6 rounded bg-muted" />
                  <div className="h-1.5 w-4/6 rounded bg-muted" />
                  <div className="mt-3 h-16 rounded bg-primary/5" />
                  <div className="h-1.5 w-full rounded bg-muted" />
                  <div className="h-1.5 w-2/3 rounded bg-muted" />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
                  Vista previa
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <InfoRow label="Nivel" value={material.level} />
                <InfoRow label="Universidad" value={material.university} />
                <InfoRow label="Duración estimada" value={material.time} />
                <InfoRow label="Formato" value="PDF · 24 páginas" />
                <InfoRow label="Última actualización" value="Jun 2026" />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" className="rounded-full">
                <Bookmark className="mr-1 h-4 w-4" /> Guardar
              </Button>
              <Button className="rounded-full bg-primary hover:bg-primary/90">
                <Download className="mr-1 h-4 w-4" /> Descargar PDF
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UniExamCard({ exam }: { exam: UniExam }) {
  const Icon = exam.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group"
    >
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl">
        <div className="flex items-start gap-4 border-b border-border/60 p-6 sm:p-8">
          <div className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", exam.color)}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <Badge className="mb-2 inline-flex gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
              <GraduationCap className="h-3 w-3" /> {exam.university}
            </Badge>
            <h3 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">{exam.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{exam.description}</p>
          </div>
        </div>
        
        <div className="space-y-3 p-6 sm:p-8">
          {exam.blocks.map((block, index) => (
            <div
              key={block.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-surface-2/30 p-4 transition-colors hover:bg-surface-2/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3 sm:items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{block.name}</div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href={block.examLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-5 sm:py-2.5"
                >
                  <FileText className="h-4 w-4" />
                  Ver Examen
                </a>
                <a
                  href={block.solutionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:px-5 sm:py-2.5"
                >
                  <Check className="h-4 w-4" />
                  Ver Solucionario
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ─────────────────────────── ACADEMY SECTION ─────────────────────────── */

function AcademyCard({ academy, onSelect }: { academy: Academy; onSelect: (academy: Academy) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={() => onSelect(academy)}
      className="cursor-pointer"
    >
      <Card className="h-full overflow-hidden rounded-2xl border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl">
        <div className={cn("grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", academy.color)}>
          <Building2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">{academy.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{academy.courses.length} cursos disponibles</p>
        <Button className="mt-4 w-full rounded-full" variant="outline">
          Ver Cursos <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
}

function AcademySection({ query, selectedAcademy, setSelectedAcademy, selectedCourse, setSelectedCourse }: {
  query: string;
  selectedAcademy: Academy | null;
  setSelectedAcademy: (a: Academy | null) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (c: Course | null) => void;
}) {
  const filteredAcademies = useMemo(
    () => ACADEMIES.filter((a) => matches(query, a.name, ...a.courses.map((c) => c.name))),
    [query]
  );

  if (selectedCourse) {
    const Icon = selectedCourse.icon;
    return (
      <section id="recursos" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedCourse(null)}
            className="mb-6 gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Volver a {selectedAcademy?.name}
          </Button>
          <SectionHeader
            eyebrow="Pizarras Virtuales"
            title={selectedCourse.name}
            description={`${selectedCourse.blackboardCount} pizarras disponibles`}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: selectedCourse.blackboardCount }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden rounded-xl border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <div className={cn("aspect-video bg-gradient-to-br", selectedCourse.color)} />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Pizarra {i + 1}</span>
                      <Button size="sm" variant="outline" className="rounded-full">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (selectedAcademy) {
    return (
      <section id="recursos" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedAcademy(null)}
            className="mb-6 gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Volver a Academias
          </Button>
          <SectionHeader
            eyebrow="Material por Academia"
            title={selectedAcademy.name}
            description="Selecciona un curso para ver sus pizarras virtuales"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {selectedAcademy.courses.map((course) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer"
                >
                  <Card className="flex items-center gap-4 rounded-xl border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg">
                    <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white", course.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{course.name}</div>
                      <div className="text-sm text-muted-foreground">{course.blackboardCount} pizarras</div>
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="recursos" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Banco de Recursos"
          title="Material por Academia"
          description="Selecciona una academia para ver sus cursos y pizarras virtuales"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAcademies.map((academy) => (
            <AcademyCard key={academy.id} academy={academy} onSelect={setSelectedAcademy} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── VIDEO SECTION ─────────────────────────── */

function VideoBankSection({ query }: { query: string }) {
  const filtered = useMemo(
    () => VIDEO_COURSES.filter((c) => matches(query, c.name, ...c.academies)),
    [query]
  );

  return (
    <section id="recursos" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Banco de Videos"
          title="Videos organizados por curso"
          description="Playlists de YouTube filtradas por curso (sin mezclar universidades)"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((course) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
              >
                <Card className="flex items-center gap-4 rounded-xl border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg">
                  <div className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white", course.color)}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-lg font-bold text-foreground">{course.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {course.videoCount} videos • {course.academies.join(", ")}
                    </div>
                  </div>
                  <a
                    href={course.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Youtube className="h-4 w-4" /> Ver playlist
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── LIBRARY SECTION ─────────────────────────── */

function EditorialCard({ editorial, onSelect }: { editorial: Editorial; onSelect: (e: Editorial) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={() => onSelect(editorial)}
      className="cursor-pointer"
    >
      <Card className="h-full overflow-hidden rounded-2xl border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl">
        <div className={cn("grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg", editorial.color)}>
          <BookOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">{editorial.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{editorial.books.length} libros disponibles</p>
        <Button className="mt-4 w-full rounded-full" variant="outline">
          Ver Colección <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </motion.div>
  );
}

function LibrarySection({ query, selectedEditorial, setSelectedEditorial }: {
  query: string;
  selectedEditorial: Editorial | null;
  setSelectedEditorial: (e: Editorial | null) => void;
}) {
  const filtered = useMemo(
    () => EDITORIALES.filter((e) => matches(query, e.name, ...e.books.map((b) => b.title))),
    [query]
  );

  if (selectedEditorial) {
    const groupedBooks = selectedEditorial.books.reduce((acc, book) => {
      if (!acc[book.collection]) acc[book.collection] = [];
      acc[book.collection].push(book);
      return acc;
    }, {} as Record<string, Book[]>);

    return (
      <section id="biblioteca" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedEditorial(null)}
            className="mb-6 gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Volver a Editoriales
          </Button>
          <SectionHeader
            eyebrow="Biblioteca Digital"
            title={selectedEditorial.name}
            description="Libros organizados por colección"
          />
          <div className="mt-8 space-y-8">
            {Object.entries(groupedBooks).map(([collection, books]) => (
              <div key={collection}>
                <h3 className="mb-4 font-display text-lg font-semibold text-foreground">{collection} ({books.length})</h3>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface-2">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Título</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Año</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.id} className="border-t border-border/60">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{book.title}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{book.year}</td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" className="rounded-full">
                              <Download className="mr-1 h-3 w-3" /> PDF
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="biblioteca" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Biblioteca Digital"
          title="Libros por Editorial"
          description="Selecciona una editorial para ver sus colecciones y libros"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((editorial) => (
            <EditorialCard key={editorial.id} editorial={editorial} onSelect={setSelectedEditorial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);
  const Icon = card.icon;
  return (
    <div className="flip-perspective h-56">
      <button
        onClick={() => setFlipped((v) => !v)}
        aria-label={`Fórmula ${card.topic}. Toca para ${flipped ? "ocultar" : "revelar"}`}
        className={cn(
          "flip-inner relative h-full w-full rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
          flipped && "flipped"
        )}
      >
        {/* Front */}
        <div
          className="flip-face absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 p-5 text-white shadow-[var(--shadow-elevated)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="flex items-center justify-between">
            <div className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
              {card.course}
            </div>
            <Icon className="h-5 w-5 text-[#FFD27A]" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold leading-tight">{card.topic}</h3>
            <p className="mt-1 text-sm text-white/80">{card.front}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/70">
            <RefreshCw className="h-3 w-3" /> Toca para revelar
          </div>
        </div>
        {/* Back */}
        <div className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Fórmula</div>
          <div className="grid place-items-center py-3 text-center">
            <div className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">{card.formula}</div>
          </div>
          <div className="rounded-lg bg-surface-2 p-2.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Ej: </span>
            {card.example}
          </div>
        </div>
      </button>
    </div>
  );
}

function FlashcardsSection({ query }: { query: string }) {
  const filtered = useMemo(
    () => FLASHCARDS.filter((c) => matches(query, c.course, c.topic, c.formula, c.front)),
    [query]
  );
  const [visible, setVisible] = useState(4);
  useEffect(() => setVisible(4), [query]);
  const shown = filtered.slice(0, visible);

  return (
    <section id="formula-express" className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF9F1C]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <Zap className="h-3.5 w-3.5" /> Fórmula Express
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Repasa fórmulas con <span className="text-primary">flashcards 3D</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Toca cualquier tarjeta para revelar la fórmula. Ideal para repasar antes del examen.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((c) => (
            <FlipCard key={c.id} card={c} />
          ))}
        </div>

        {filtered.length > visible && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setVisible((v) => Math.min(v + 4, filtered.length))}
              variant="outline"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Mostrar otra fórmula
            </Button>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No hay fórmulas que coincidan.
          </div>
        )}
      </div>
    </section>
  );
}

function ResourcesTabsSection({ query }: { query: string }) {
  return (
    <section className="bg-surface-2/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Banco de Recursos"
          title="Todo el material que necesitas"
          description="PDFs, videos, resúmenes, simulacros y exámenes clasificados por tipo."
        />
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="mx-auto flex h-auto w-full max-w-3xl flex-wrap gap-1 rounded-2xl bg-card p-1.5 shadow-sm">
            {RESOURCE_TABS.map((t) => {
              const Icon = t.icon;
              return (
                <TabsTrigger
                  key={t.key}
                  value={t.key}
                  className="flex-1 gap-1.5 rounded-xl text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow sm:text-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {RESOURCE_TABS.map((t) => {
            const items = t.items.filter((it) => matches(query, it, t.label));
            const Icon = t.icon;
            return (
              <TabsContent key={t.key} value={t.key} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {items.map((it, i) => (
                    <motion.div
                      key={it}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-foreground">{it}</div>
                        <div className="text-xs text-muted-foreground">Recurso disponible</div>
                      </div>
                      <Button size="sm" variant="ghost" className="rounded-full text-primary hover:bg-primary/10">
                        <Download className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  {items.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                      Sin resultados en {t.label}.
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

function MockExamsSection({ query }: { query: string }) {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Simulacros"
          title="Practica con exámenes reales"
          description="Cronómetro, número de preguntas y nivel real de admisión."
        />
        <div className="mx-auto max-w-5xl">
          <UniExamCard exam={UNI_EXAM} />
        </div>
      </div>
    </section>
  );
}

const communitySchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(80),
  course: z.string().trim().min(2, "Indica el curso").max(60),
  title: z.string().trim().min(3, "Título muy corto").max(120),
  description: z.string().trim().min(10, "Describe con al menos 10 caracteres").max(500),
  category: z.enum(["PDF", "Resumen"], { message: "Selecciona una categoría" }),
});
type CommunityForm = z.infer<typeof communitySchema>;

function CommunitySection({ query }: { query: string }) {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);

  const form = useForm<CommunityForm>({
    resolver: zodResolver(communitySchema),
    defaultValues: { name: "", course: "", title: "", description: "", category: "PDF" },
  });

  const onSubmit = (data: CommunityForm) => {
    const newPost: CommunityPost = {
      id: `c-${Date.now()}`,
      ...data,
      date: "Justo ahora",
    };
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Material compartido correctamente.", { icon: <Check className="h-4 w-4" /> });
    form.reset({ name: "", course: "", title: "", description: "", category: "PDF" });
  };

  const filtered = useMemo(
    () => posts.filter((p) => matches(query, p.name, p.course, p.title, p.description, p.category)),
    [posts, query]
  );

  return (
    <section className="bg-surface-2/40 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Comunidad"
          title="Aportes de la Comunidad"
          description="Comparte tus mejores apuntes y aprende de otros preuniversitarios."
        />
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card className="rounded-3xl border-border bg-card p-6 shadow-[var(--shadow-elevated)] sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Comparte tu material</h3>
                <p className="text-xs text-muted-foreground">Ayuda a otros estudiantes con tus apuntes.</p>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrap label="Nombre" error={form.formState.errors.name?.message}>
                  <Input {...form.register("name")} placeholder="Tu nombre" aria-invalid={!!form.formState.errors.name} className="rounded-xl" />
                </FieldWrap>
                <FieldWrap label="Curso" error={form.formState.errors.course?.message}>
                  <Input {...form.register("course")} placeholder="Ej. Álgebra" className="rounded-xl" />
                </FieldWrap>
              </div>
              <FieldWrap label="Título" error={form.formState.errors.title?.message}>
                <Input {...form.register("title")} placeholder="Ej. Resumen de exponentes" className="rounded-xl" />
              </FieldWrap>
              <FieldWrap label="Descripción" error={form.formState.errors.description?.message}>
                <Textarea
                  {...form.register("description")}
                  placeholder="¿Qué contiene tu material?"
                  rows={4}
                  className="resize-none rounded-xl"
                />
              </FieldWrap>
              <FieldWrap label="Categoría" error={form.formState.errors.category?.message}>
                <Select
                  value={form.watch("category")}
                  onValueChange={(v) => form.setValue("category", v as "PDF" | "Resumen", { shouldValidate: true })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Resumen">Resumen</SelectItem>
                  </SelectContent>
                </Select>
              </FieldWrap>
              <Button
                type="submit"
                className="w-full rounded-full bg-primary text-primary-foreground transition-transform hover:scale-[1.01] hover:bg-primary/90"
              >
                <Send className="mr-1 h-4 w-4" /> Compartir Material
              </Button>
            </form>
          </Card>

          {/* Feed */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">
              Material compartido por estudiantes
            </h3>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <Card className="rounded-2xl border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white">
                            {p.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <div className="font-semibold text-foreground">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.date}</div>
                          </div>
                          <div className="text-xs font-medium text-primary">{p.course}</div>
                          <div className="mt-2 font-display font-bold text-foreground">{p.title}</div>
                          <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                          <Badge variant="secondary" className="mt-3 rounded-full">
                            {p.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  Aún no hay aportes que coincidan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FieldWrap({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--gradient-accent)" }}>
                <span className="font-display font-extrabold text-white">CP</span>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white">Central Pre</div>
                <div className="text-xs text-white/60">Aprende. Organiza. Ingresa.</div>
              </div>
            </div>
            <h4 className="mb-2 font-display font-semibold text-white">Sobre Central Pre</h4>
            <p className="text-sm leading-relaxed text-white/70">
              Central Pre es una plataforma digital diseñada para ayudar a estudiantes preuniversitarios a organizar su proceso de preparación académica en un solo lugar. Reúne apuntes, fórmulas, simulacros y recursos colaborativos para facilitar el estudio y mejorar el rendimiento en los exámenes de admisión a universidades peruanas.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-white">Universidades</h4>
            <ul className="space-y-2 text-sm">
              {["UNI", "UNMSM", "PUCP", "UNFV", "UNAC", "La Agraria"].map((u) => (
                <li key={u}>
                  <a href="#" className="text-white/70 transition-colors hover:text-[#FF9F1C]">
                    {u}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold text-white">Recursos</h4>
            <ul className="space-y-2 text-sm">
              {[
                { l: "Ciencias", h: "#ciencias" },
                { l: "Letras", h: "#letras" },
                { l: "Fórmulas", h: "#formula-express" },
                { l: "Simulacros", h: "#" },
                { l: "Comunidad", h: "#" },
              ].map((r) => (
                <li key={r.l}>
                  <a href={r.h} className="text-white/70 transition-colors hover:text-[#FF9F1C]">
                    {r.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row">
          <div>© 2026 Central Pre</div>
          <div className="font-medium tracking-wide text-white/80">Aprende. Organiza. Ingresa.</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

function Index() {
  const [rawQuery, setRawQuery] = useState("");
  const query = useDebounced(rawQuery, 180);
  const [activeSection, setActiveSection] = useState("examenes");
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedEditorial, setSelectedEditorial] = useState<Editorial | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        query={rawQuery} 
        setQuery={setRawQuery}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main>
        <Hero />
        <Stats />

        {/* Exámenes Section */}
        <section id="examenes" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Exámenes"
              title="Examen de Admisión UNI"
              description="Pruebas oficiales del último proceso de admisión"
            />
            <div className="mx-auto max-w-5xl">
              <UniExamCard exam={UNI_EXAM} />
            </div>
          </div>
        </section>

        {/* Recursos Section */}
        <AcademySection
          query={query}
          selectedAcademy={selectedAcademy}
          setSelectedAcademy={setSelectedAcademy}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />

        {/* Banco de Videos Section */}
        <VideoBankSection query={query} />

        {/* Biblioteca Section */}
        <LibrarySection
          query={query}
          selectedEditorial={selectedEditorial}
          setSelectedEditorial={setSelectedEditorial}
        />

        {/* Flashcards Section */}
        <FlashcardsSection query={query} />

        {/* Comunidad Section */}
        <CommunitySection query={query} />
      </main>
      <Footer />
    </div>
  );
}
