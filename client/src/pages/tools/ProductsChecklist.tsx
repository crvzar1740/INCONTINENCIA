import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  criteria: string;
  tags: string[];
  selected: boolean;
  notes: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Protectores diarios absorbentes",
    category: "Protección ligera",
    criteria: "Ideal si las pérdidas son gotas ocasionales al toser o reírte, no un flujo constante. No reemplaza protección para ejercicio intenso.",
    tags: ["actividad-poca", "momento-dia"],
    selected: false,
    notes: "",
  },
  {
    id: 2,
    name: "Pants absorbentes de cintura alta",
    category: "Protección moderada",
    criteria: "El punto medio: más cobertura que un protector diario, más discreto que una compresa nocturna. Buena opción de uso diario general.",
    tags: ["actividad-moderada", "momento-dia"],
    selected: false,
    notes: "",
  },
  {
    id: 3,
    name: "Ropa interior absorbente reutilizable",
    category: "Sostenible",
    criteria: "Misma protección que un descartable, pero se lava y reusa. Conviene si ya identificaste qué nivel de protección necesitás — no es ideal para las primeras semanas de prueba y error.",
    tags: ["preferencia-reutilizable"],
    selected: false,
    notes: "",
  },
  {
    id: 4,
    name: "Compresas nocturnas de larga duración",
    category: "Protección nocturna",
    criteria: "Pensadas para 6-8 horas sin cambio. Buscá una con capa antideslizante — de nada sirve la absorción si se mueve mientras dormís.",
    tags: ["momento-noche"],
    selected: false,
    notes: "",
  },
  {
    id: 5,
    name: "Protectores para ejercicio",
    category: "Actividad física",
    criteria: "Diseñados para no marcarse bajo ropa deportiva ajustada y no perder forma con el movimiento. Priorizá este tipo antes que un protector común si volvés a entrenar.",
    tags: ["actividad-intensa", "momento-ejercicio"],
    selected: false,
    notes: "",
  },
  {
    id: 6,
    name: "Toallitas de higiene íntima",
    category: "Higiene",
    criteria: "Útiles para uso fuera de casa, después de cambiar de protector. Buscá versiones sin alcohol ni perfume para evitar irritación.",
    tags: [],
    selected: false,
    notes: "",
  },
  {
    id: 7,
    name: "Desodorizante íntimo",
    category: "Higiene",
    criteria: "Complemento, no solución — si sentís que necesitás desodorizante todo el tiempo, puede ser señal de que el nivel de protección no es el correcto y conviene revisarlo.",
    tags: [],
    selected: false,
    notes: "",
  },
  {
    id: 8,
    name: "Gel lubricante para comodidad",
    category: "Comodidad",
    criteria: "Puede ayudar con la sequedad o irritación que a veces genera el uso prolongado de protectores. No está directamente relacionado al control de pérdidas.",
    tags: [],
    selected: false,
    notes: "",
  },
];

type QuizAnswers = {
  actividad: "poca" | "moderada" | "intensa" | null;
  momento: "dia" | "noche" | "ejercicio" | null;
  preferencia: "descartable" | "reutilizable" | null;
};

export default function ProductsChecklist() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [saving, setSaving] = useState(false);
  const [showQuiz, setShowQuiz] = useState(true);
  const [answers, setAnswers] = useState<QuizAnswers>({ actividad: null, momento: null, preferencia: null });

  useEffect(() => {
    const saved = localStorage.getItem("suelo-firme-products-checklist");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  const persist = (next: Product[]) => {
    setProducts(next);
    localStorage.setItem("suelo-firme-products-checklist", JSON.stringify(next));
  };

  const toggleProduct = (id: number) => {
    persist(products.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  };

  const updateNotes = (id: number, notes: string) => {
    persist(products.map((p) => (p.id === id ? { ...p, notes } : p)));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("✓ Tu checklist ha sido guardado");
    } finally {
      setSaving(false);
    }
  };

  const quizComplete = answers.actividad && answers.momento && answers.preferencia;

  const recommendedIds = (() => {
    if (!quizComplete) return [];
    const wanted = [
      `actividad-${answers.actividad}`,
      `momento-${answers.momento}`,
      `preferencia-${answers.preferencia}`,
    ];
    return products
      .map((p) => ({ p, score: p.tags.filter((t) => wanted.includes(t)).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((x) => x.p.id);
  })();

  const selectedCount = products.filter((p) => p.selected).length;
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-2xl font-bold text-primary">Suelo Firme</div>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Encontrá el producto correcto para vos
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              3 preguntas rápidas para recomendarte por dónde empezar — después explorá el resto
              del catálogo con criterios reales, no solo nombres de categoría.
            </p>
          </div>

          {/* Mini quiz */}
          {showQuiz && (
            <Card className="p-6 md:p-8 mb-8 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Tu recomendación personalizada</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">¿Cuánta actividad física hacés por semana?</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { v: "poca", label: "Poca o ninguna" },
                      { v: "moderada", label: "Moderada" },
                      { v: "intensa", label: "Intensa / entreno seguido" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setAnswers((a) => ({ ...a, actividad: opt.v as QuizAnswers["actividad"] }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          answers.actividad === opt.v
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-white text-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">¿Cuándo notás más pérdidas?</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { v: "dia", label: "Durante el día" },
                      { v: "noche", label: "De noche" },
                      { v: "ejercicio", label: "Durante el ejercicio" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setAnswers((a) => ({ ...a, momento: opt.v as QuizAnswers["momento"] }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          answers.momento === opt.v
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-white text-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">¿Preferís descartable o reutilizable?</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { v: "descartable", label: "Descartable" },
                      { v: "reutilizable", label: "Reutilizable" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setAnswers((a) => ({ ...a, preferencia: opt.v as QuizAnswers["preferencia"] }))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          answers.preferencia === opt.v
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-white text-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {quizComplete && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">Te recomendamos empezar por:</p>
                  <div className="space-y-2">
                    {recommendedIds.map((id) => {
                      const prod = products.find((p) => p.id === id)!;
                      return (
                        <div key={id} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-primary/30">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-foreground text-sm">{prod.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{prod.criteria}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowQuiz(false)}
                  >
                    Ver todo el catálogo
                  </Button>
                </div>
              )}
            </Card>
          )}

          {!showQuiz && (
            <>
              {/* Summary Card */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Productos seleccionados</h2>
                    <p className="text-muted-foreground">Tenés {selectedCount} productos marcados</p>
                  </div>
                  <div className="text-5xl font-bold text-primary">{selectedCount}</div>
                </div>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="text-sm text-secondary font-semibold mt-4 hover:underline"
                >
                  ← Volver a la recomendación personalizada
                </button>
              </Card>

              {/* Products by Category */}
              <div className="space-y-8">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded" />
                      {category}
                    </h3>
                    <div className="space-y-4">
                      {products
                        .filter((p) => p.category === category)
                        .map((product) => (
                          <Card
                            key={product.id}
                            className={`p-6 border-l-4 ${
                              product.selected ? "border-l-primary bg-primary/5" : "border-l-muted"
                            } hover:shadow-lg transition-shadow`}
                          >
                            <div className="flex gap-4 mb-3">
                              <Checkbox
                                checked={product.selected}
                                onCheckedChange={() => toggleProduct(product.id)}
                                className="w-6 h-6 mt-1"
                              />
                              <div className="flex-1">
                                <h4
                                  className={`text-lg font-semibold flex items-center gap-2 ${
                                    product.selected ? "text-primary" : "text-foreground"
                                  }`}
                                >
                                  {product.selected && <CheckCircle2 className="w-5 h-5" />}
                                  {product.name}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{product.criteria}</p>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Agrega notas: precio, dónde comprarlo, comentarios personales, etc."
                              value={product.notes}
                              onChange={(e) => updateNotes(product.id, e.target.value)}
                              className="text-sm"
                            />
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-12 flex gap-4">
                <Button onClick={saveProgress} disabled={saving} className="btn-primary flex-1 text-lg">
                  {saving ? "Guardando..." : "Guardar mi checklist"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
