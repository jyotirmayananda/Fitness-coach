"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PlanSectionProps {
    title: string;
    content: string;
    on_item_click: (item: string) => void;
}

const parseContent = (content: string) => {
    const sections: { title: string; items: string[] }[] = [];
    const lines = content.split('\n');
    let currentSection: { title: string; items: string[] } | null = null;
  
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
  
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmedLine.replace(/\*\*/g, ''), items: [] };
      } else if (trimmedLine.match(/^Day \d+/i) || trimmedLine.match(/^Meal:/i) || trimmedLine.match(/^Breakfast:/i) || trimmedLine.match(/^Lunch:/i) || trimmedLine.match(/^Dinner:/i) || trimmedLine.match(/^Snacks:/i)) {
         if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmedLine.replace(/:$/, ''), items: [] };
      }
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        if (!currentSection) {
          currentSection = { title: 'General', items: [] };
        }
        currentSection.items.push(trimmedLine.substring(1).trim());
      } else if (currentSection) {
        currentSection.items.push(trimmedLine);
      }
    });
  
    if (currentSection) {
      sections.push(currentSection);
    }

    if(sections.length === 0 && content) {
        return [{ title: 'Plan Details', items: content.split('\n').filter(l => l.trim() !== '') }]
    }
  
    return sections;
};

export function PlanSection({ title, content, on_item_click }: PlanSectionProps) {
    const parsed_sections = parseContent(content);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {parsed_sections.map((section, index) => (
                    <div key={index} className="space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">{section.title}</h3>
                        <ul className="list-none space-y-2">
                            {section.items.map((item, item_index) => {
                                // Extract the main exercise/food item name before any colon or quantity
                                const mainItem = item.split(/[:(]/)[0].trim();
                                return (
                                    <li key={item_index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-secondary/50">
                                        <p className="text-muted-foreground flex-grow">{item}</p>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => on_item_click(mainItem)}
                                            className="mt-2 sm:mt-0 sm:ml-4 self-start sm:self-center"
                                        >
                                            <Sparkles className="mr-2 h-4 w-4 text-accent" />
                                            Visualize
                                        </Button>
                                    </li>
                                )
                           })}
                        </ul>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
