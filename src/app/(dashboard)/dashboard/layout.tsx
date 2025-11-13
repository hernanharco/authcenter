// src/app/(dashboard)/dashboard/layout.tsx
"use client";

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/features/dashboard/components/user-nav";
import { Home, User, Settings, LogOut } from "lucide-react";
import { logout } from "@/features/signup/lib/actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* 1. SIDEBAR (Izquierda) - Necesita ser 'fixed' o 'absolute' para no ocupar espacio en el flujo normal,
           o el contenedor padre debe manejar el layout de dos columnas. */}
        <Sidebar collapsible="icon" className="bg-sidebar-background">
          <SidebarHeader>{/* ... Logo ... */}</SidebarHeader>
          <SidebarContent>
            {/* ... Menú de navegación con Link ... */}
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton tooltip="Panel" isActive>
                    <Home />
                    <span>Panel</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/profile">
                  <SidebarMenuButton tooltip="Perfil">
                    <User />
                    <span>Perfil</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="#">
                  <SidebarMenuButton tooltip="Ajustes">
                    <Settings />
                    <span>Ajustes</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <form action={logout}>
              <SidebarMenuButton type="submit" tooltip="Cerrar Sesión">
                <LogOut />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </form>
          </SidebarFooter>
        </Sidebar>

        {/* 2. SIDEBAR INSET (Derecha) - Contenedor principal del contenido.
           El problema está aquí. Si SidebarInset no funciona, necesitamos un div que aplique el margen. 
           Si estás utilizando Tailwind y los componentes Shadcn/ui o similares, la clase SidebarInset debería 
           manejar el espaciado interno (offset).

           Si el error persiste, prueba envolver el contenido principal en un <div> y aplicar el padding:
        */}
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <UserNav />
          </header>

          {/* Aquí el SidebarInset debe manejar el margen. Si no funciona, la implementación del componente Sidebar/SidebarInset está fallando. */}
          <SidebarInset>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
