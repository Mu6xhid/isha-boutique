'use client';
import { useEffect, useRef } from 'react';
import { useCart } from '@/components/CartProvider';

export default function ClearCart() {
  const { clear } = useCart();
  const clearedRef = useRef(false); // ✅ only run once

  useEffect(() => {
    if (!clearedRef.current) {
      clear();                    // call only once
      clearedRef.current = true;
    }
  }, [clear]);

  return null;
}
