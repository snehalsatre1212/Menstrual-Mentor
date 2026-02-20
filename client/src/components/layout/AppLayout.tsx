import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Mic, Image as ImageIcon, FileText, Home, History } from "lucide-react";
import { useLocation, Link } from "wouter";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Log Cycle", url: "/log", icon: Calendar },
  { title: "Text Analysis", url: "/analyze/text", icon: FileText },
  { title: "Voice Journal", url: "/analyze/voice", icon: Mic },
  { title: "Image Scan", url: "/analyze/image", icon: ImageIcon },
  { title: "History", url: "/history", icon: History },
];

export function AppSidebar() {
  const [location] = useLocation();
  
  return (
    <Sidebar className="border-r border-border bg-card/50 backdrop-blur-sm">
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-gradient">
            Menstrual Mentor
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Holistic Cycle Tracking</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className="transition-all duration-200 hover:translate-x-1"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="flex items-center p-4 lg:hidden border-b bg-white">
            <SidebarTrigger />
            <span className="ml-4 font-bold text-primary">Menstrual Mentor</span>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-8 lg:p-12 scroll-smooth">
            <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500 slide-in-from-bottom-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
