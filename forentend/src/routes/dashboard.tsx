import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DashboardShell } from "@/components/cosmos/DashboardShell";



export const Route = createFileRoute("/dashboard")({

  head: () => ({

    meta: [

      { title: "Dashboard — Cosmos Media Cloud" },

      { name: "description", content: "Your Cosmos Media Cloud control center." },

    ],

  }),

  component: () => (

    <DashboardShell>

      <Outlet />

    </DashboardShell>

  ),

});
