'use client';

import React, { useEffect } from 'react';

type clientOnlyProps = {
  children: React.ReactNode;
};

const ClientOnly: React.FC<clientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};

export default ClientOnly;
