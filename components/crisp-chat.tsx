'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('7c4fbb88-b8dd-4793-951f-49618e5117ef');
  }, []);

  return null;
};
