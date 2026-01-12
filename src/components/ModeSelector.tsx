import { LineChart, GitCompare, Image } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModeSelectorProps {
  mode: string;
  onModeChange: (mode: string) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={onModeChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="single" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Single Stock</span>
          <span className="sm:hidden">Single</span>
        </TabsTrigger>
        <TabsTrigger value="multi" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <GitCompare className="h-4 w-4" />
          <span className="hidden sm:inline">Multi-Stock</span>
          <span className="sm:hidden">Compare</span>
        </TabsTrigger>
        <TabsTrigger value="image" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline">Chart Image</span>
          <span className="sm:hidden">Image</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
