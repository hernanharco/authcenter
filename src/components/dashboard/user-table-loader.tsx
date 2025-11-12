'use client';

import dynamic from 'next/dynamic';
import { UserTableSkeleton } from './user-table-skeleton';

const UserTable = dynamic(() => import('@/components/dashboard/user-table').then(mod => mod.UserTable), { 
    ssr: false,
    loading: () => <UserTableSkeleton />
});

export function UserTableLoader() {
    return <UserTable />;
}
