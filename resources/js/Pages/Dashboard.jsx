import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/shadcn/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { HandCoinsIcon, Home, Layers, UserX } from 'lucide-react';
import { Head } from '@inertiajs/react';
import MantriDashboard from './Dashboard/MantriDashboard';

export default function Dashboard(props) {
  const { auth } = usePage().props;
  const requiredPermission = ['unit staff', 'unit kasir'];
  const showSideBar = requiredPermission.some((permission) =>
    auth.permissions.includes(permission)
  );
  return (
    <AuthenticatedLayout auth={props.auth} errors={props.errors} header="Home">
      <Head title="Home" />

      <div className="flex flex-col flex-1 gap-4">
        {showSideBar ? '' : <MantriDashboard />}
      </div>
    </AuthenticatedLayout>
  );
}
