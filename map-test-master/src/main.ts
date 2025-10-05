import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Router, NavigationStart } from '@angular/router';
import { MapCleanupService } from './app/core/map-cleanup.service';

// Interceptar console.warn en modo desarrollo para suprimir warnings WebGL ruidosos
const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
if (isDev) {
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: any[]) => {
    const msg = String(args[0] || '');
    // Filtrar warnings de WebGL y mensajes repetitivos del renderer
    if (msg.includes('WEBGL_debug_renderer_info') || msg.includes('texSubImage: Alpha-premult') || msg.includes('After reporting')) {
      return;
    }
    originalWarn(...args);
  };
}

bootstrapApplication(App, appConfig)
  .then((appRef) => {
    try {
      const injector = (appRef as any).injector || (appRef as any).get?.(Symbol.for('INJECTOR'));
      if (!injector) return;
      const router = injector.get?.(Router) as Router | undefined;
      const cleanup = injector.get?.(MapCleanupService) as MapCleanupService | undefined;
      if (router && cleanup) {
        // Limpiar al inicio de cada navegación para asegurar que no persistan hotspots
        router.events.subscribe((e: any) => {
          if (e instanceof NavigationStart) {
            try { cleanup.triggerClear(); } catch (err) { console.debug('cleanup trigger error', err); }
          }
        });
      }
    } catch (e) {
      console.debug('router cleanup hook error', e);
    }
  })
  .catch((err) => console.error(err));
