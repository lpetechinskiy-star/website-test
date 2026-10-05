// Точка входа для одностраничной сборки в один файл: та же страница, что и в
// Next, но примонтированная вручную — без роутера и загрузчика чанков.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Home from '@/app/page';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Home />
    </StrictMode>,
  );
}
