import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BookOpen, Users, Target } from "lucide-react";

interface ContentSlideProps {
  title: string;
  subtitle?: string;
  content: {
    type: "text" | "list" | "grid" | "steps";
    data: any;
  };
  learning_objectives?: string[];
}

export const ContentSlide = ({ title, subtitle, content, learning_objectives }: ContentSlideProps) => {
  const renderContent = () => {
    switch (content.type) {
      case "text":
        return (
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl leading-relaxed">{content.data}</p>
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            {content.data.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-1 bg-primary/10 rounded-full mt-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-lg text-foreground flex-1">{item}</p>
              </div>
            ))}
          </div>
        );

      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.data.map((item: { title: string; description: string; icon?: string }, index: number) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-card-foreground">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case "steps":
        return (
          <div className="space-y-6">
            {content.data.map((step: { title: string; description: string }, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h4>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Learning Objectives */}
      {learning_objectives && (
        <Card className="mb-8 p-6 bg-gradient-subtle border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Learning Objectives</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {learning_objectives.map((objective, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                {objective}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Main Content */}
      <Card className="p-8 bg-card/50 backdrop-blur-sm">
        {renderContent()}
      </Card>

      {/* Interactive Elements */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="elegant" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Discussion Forum
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Additional Resources
        </Button>
      </div>
    </div>
  );
};