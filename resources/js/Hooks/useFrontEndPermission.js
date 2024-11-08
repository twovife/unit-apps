import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

function useFrontEndPermission() {
  const { auth } = usePage().props;
  const { permissions } = auth;

  const permissionStatus = useMemo(() => {
    const isUnit = permissions.includes('unit');
    const isMantri = permissions.includes('area');
    const isPusat = permissions.includes('pusat');
    const isCreator = permissions.includes('can create');
    return {
      isUnit,
      isMantri,
      isPusat,
      isCreator,
    };
  }, [permissions]);

  return permissionStatus;
}

export default useFrontEndPermission;
