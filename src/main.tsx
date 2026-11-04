import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { App } from './frontend/App';
import { queryClient } from './frontend/lib/query';
import { startDemo } from './frontend/mocks/browser';
import './assets/iconfonts/tabler-icons/iconfont/tabler-icons.css';
import './frontend/template.scss';
import './frontend/styles.css';
import './frontend/template-adapter.css';
async function bootstrap() {
  await startDemo();
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><BrowserRouter basename={import.meta.env.BASE_URL}><App/><Toaster richColors position="top-right" closeButton/></BrowserRouter></QueryClientProvider></React.StrictMode>);
}
bootstrap().catch(() => { document.getElementById('root')!.innerHTML = '<main style="padding:3rem;font-family:system-ui"><h1>Impossible de démarrer la démonstration</h1><p>Vérifiez le chargement du service worker MSW, puis actualisez la page.</p><button onclick="location.reload()">Réessayer</button></main>'; });
