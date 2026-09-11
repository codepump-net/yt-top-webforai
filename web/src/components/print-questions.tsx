'use client';

import { useEffect } from 'react';

export function PrintQuestions() {
  useEffect(() => {
    const original = new Map<HTMLDetailsElement, boolean>();
    const restore = () => {
      original.forEach((open, element) => {
        element.open = open;
      });
      original.clear();
    };
    const expand = () => {
      document.querySelectorAll<HTMLDetailsElement>('.qa-list details').forEach((element) => {
        if (!original.has(element)) original.set(element, element.open);
        element.open = true;
      });
    };
    window.addEventListener('beforeprint', expand);
    window.addEventListener('afterprint', restore);
    return () => {
      window.removeEventListener('beforeprint', expand);
      window.removeEventListener('afterprint', restore);
      restore();
    };
  }, []);
  return null;
}
