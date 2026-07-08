import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  selected: boolean;
  notes: string;
}

export default function ProductsChecklist() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Protectores diarios absorbentes", category: "Protección ligera", selected: false, notes: "" },
    { id: 2, name: "Pants absorbentes de cintura alta", category: "Protección moderada", selected: false, notes: "" },
    { id: 3, name: "Ropa interior absorbente reutilizable", category: "Sostenible", selected: false, notes: "" },
    { id: 4, name: "Compresas nocturnas de larga duración", category: "Protección nocturna", selected: false, notes: "" },
    { id: 5, name: "Protectores para ejercicio", category: "Actividad física", selected: false, notes: "" },
    { id: 6, name: "Toallitas de higiene íntima", category: "Higiene", selected: false, notes: "" },
    { id: 7, name: "Desodorizante íntimo", category: "Higiene", selected: false, notes: "" },
    { id: 8, name: "Gel lubricante para comodidad", category: "Comodidad", selected: false, notes: "" },
  ]);
  const [saving, setSaving] = useState(false);

  const toggleProduct = (id: number) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const updateNotes = (id: number, notes: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, notes } : p
    ));
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("✓ Tu checklist ha sido guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar el checklist");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = products.filter(p => p.selected).length;
  const categoriesSet = new Set(products.map(p => p.category));
  const categories = Array.from(categoriesSet);

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
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Checklist de Productos para Control de Incontinencia
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un recurso para seleccionar y etiquetar los mejores productos de incontinencia, ayudándote en la decisión de compra. Marca los productos que te interesan y agrega notas sobre cada uno.
            </p>
          </div>

          {/* Summary Card */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Productos Seleccionados</h2>
                <p className="text-muted-foreground">Tienes {selectedCount} productos marcados</p>
              </div>
              <div className="text-5xl font-bold text-primary">{selectedCount}</div>
            </div>
          </Card>

          {/* Products by Category */}
          <div className="space-y-8">
            {categories.map((category: string) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded" />
                  {category}
                </h3>
                <div className="space-y-4">
                  {products
                    .filter(p => p.category === category)
                    .map((product) => (
                      <Card key={product.id} className={`p-6 border-l-4 ${product.selected ? "border-l-primary bg-primary/5" : "border-l-muted"} hover:shadow-lg transition-shadow`}>
                        <div className="flex gap-4 mb-4">
                          <Checkbox
                            checked={product.selected}
                            onCheckedChange={() => toggleProduct(product.id)}
                            className="w-6 h-6 mt-1"
                          />
                          <div className="flex-1">
                            <h4 className={`text-lg font-semibold flex items-center gap-2 ${product.selected ? "text-primary" : "text-foreground"}`}>
                              {product.selected && <CheckCircle2 className="w-5 h-5" />}
                              {product.name}
                            </h4>
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
            <Button
              onClick={saveProgress}
              disabled={saving}
              className="btn-primary flex-1 text-lg"
            >
              {saving ? "Guardando..." : "Guardar Mi Checklist"}
            </Button>
          </div>

          {/* Info Section */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">📋 Cómo Usar Este Checklist</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">1.</span>
                <span>Marca los productos que te interesan probar</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">2.</span>
                <span>Agrega notas sobre precio, dónde encontrarlos y tus comentarios</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">3.</span>
                <span>Guarda tu checklist para consultarlo cuando hagas compras</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">4.</span>
                <span>Prueba diferentes productos para encontrar los que mejor se adapten a ti</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
