"use client";

import dynamic from "next/dynamic";
import { UserTableSkeleton } from "./user-table-skeleton";

const UserTable = dynamic(
  () =>
    import("@/features/dashboard/hooks/user-TableContainer").then(
      (mod) => mod.UserTableContainer
    ),
  {
    ssr: false,
    loading: () => <UserTableSkeleton />,
  }
);

export function UserTableLoader() {
  return <UserTable />;
}
