import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles, MessageCircle, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Post {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  group: string;
}

interface SuccessStory {
  id: string;
  author: string;
  story: string;
  result: string;
  timeframe: string;
}

export default function ExclusiveCommunity() {
  const [, setLocation] = useLocation();
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "María C.",
      content: "¡Hoy pude hacer ejercicio sin preocuparme! Después de 3 semanas de práctica consistente, finalmente lo logré. ¡Gracias a todas!",
      date: "Hace 2 horas",
      likes: 24,
      group: "Historias de Éxito",
    },
    {
      id: "2",
      author: "Laura M.",
      content: "¿Alguien más tiene dificultad con los ejercicios de Kegel lento? Necesito consejos.",
      date: "Hace 5 horas",
      likes: 12,
      group: "Preguntas",
    },
    {
      id: "3",
      author: "Sofía R.",
      content: "Encontré estos protectores en Amazon y son increíbles. Muy cómodos y discretos. Los recomiendo 100%.",
      date: "Hace 1 día",
      likes: 18,
      group: "Recomendaciones",
    },
  ]);

  const [successStories] = useState<SuccessStory[]>([
    {
      id: "1",
      author: "Daniela P.",
      story: "Hace un año no podía ni caminar sin miedo. Ahora corro 5km cada semana sin problemas.",
      result: "Control total de la incontinencia",
      timeframe: "6 meses",
    },
    {
      id: "2",
      author: "Catalina L.",
      story: "Pensaba que nunca volvería a ir al gimnasio. Hoy completé mi clase de yoga sin preocupaciones.",
      result: "Recuperé mi confianza",
      timeframe: "3 meses",
    },
    {
      id: "3",
      author: "Valentina G.",
      story: "Mi vida social mejó tremendamente. Ahora salgo con amigas sin ansiedad.",
      result: "Vida social plena",
      timeframe: "4 meses",
    },
  ]);

  const submitPost = async () => {
    if (!newPost.trim()) {
      toast.error("Por favor escribe tu mensaje");
      return;
    }

    setPosting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPostObj: Post = {
        id: Date.now().toString(),
        author: "Tú",
        content: newPost,
        date: "Ahora",
        likes: 0,
        group: "General",
      };

      setPosts([newPostObj, ...posts]);
      setNewPost("");
      toast.success("✓ Tu mensaje ha sido publicado en la comunidad");
    } catch (error) {
      toast.error("Error al publicar el mensaje");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <button
            onClick={() => setLocation("/pack-premium")}
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
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Comunidad Exclusiva de Apoyo
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Foro privado con otras mujeres, historias de éxito inspiradoras, grupos de apoyo temáticos y sesiones de grupo mensuales.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Miembros Activos</span>
              </div>
              <div className="text-3xl font-bold text-primary">1,247</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">Mensajes Hoy</span>
              </div>
              <div className="text-3xl font-bold text-accent">342</div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Historias de Éxito</span>
              </div>
              <div className="text-3xl font-bold text-secondary">89</div>
            </Card>
          </div>

          {/* Post Creation */}
          <Card className="p-8 border-2 border-primary/20 mb-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold text-foreground mb-4">Comparte Tu Experiencia</h2>
            <Textarea
              placeholder="¿Qué quieres compartir con la comunidad? Tus preguntas, consejos, historias de progreso o apoyo para otras mujeres..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-32 mb-4"
            />
            <Button
              onClick={submitPost}
              disabled={posting}
              className="btn-primary w-full"
            >
              {posting ? "Publicando..." : "Publicar en la Comunidad"}
            </Button>
          </Card>

          {/* Recent Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Conversaciones Recientes
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{post.author}</h3>
                      <p className="text-xs text-muted-foreground">{post.date}</p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      {post.group}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{post.content}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <button className="hover:text-primary transition-colors">❤️ {post.likes}</button>
                    <button className="hover:text-primary transition-colors">💬 Responder</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Success Stories */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Historias de Éxito Inspiradoras
            </h2>
            <div className="space-y-4">
              {successStories.map((story) => (
                <Card key={story.id} className="p-6 bg-gradient-to-br from-accent/5 to-secondary/5 border-2 border-accent/20">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-foreground text-lg">{story.author}</h3>
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                      {story.timeframe}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{story.story}</p>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-sm font-semibold text-primary">✓ Resultado: {story.result}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <Card className="mt-12 p-8 bg-accent/5 border-accent">
            <h3 className="text-xl font-bold text-foreground mb-4">📋 Normas de la Comunidad</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Sé respetuosa y empática con todas las miembros</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Comparte tus experiencias genuinas y honestas</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>No hagas spam ni promociones comerciales</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Respeta la privacidad de todas las miembros</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Celebra los éxitos de otras mujeres</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
