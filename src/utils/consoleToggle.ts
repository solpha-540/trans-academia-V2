type ConsoleMethod = (...args: unknown[]) => void;

type ConsoleBackup = {
  log: ConsoleMethod;
  info: ConsoleMethod;
  debug: ConsoleMethod;
  warn: ConsoleMethod;
  error: ConsoleMethod;
};

const STORAGE_KEY = 'ENABLE_CONSOLE';

let backup: ConsoleBackup | null = null;
let installed = false;

const ensureBackup = (): ConsoleBackup => {
  if (backup) return backup;
  backup = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };
  return backup;
};

const getEnvDefault = (): boolean => {
  const raw = (import.meta as any)?.env?.VITE_ENABLE_CONSOLE;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return Boolean((import.meta as any)?.env?.DEV);
  }
  const val = String(raw).trim().toLowerCase();
  return val === 'true' || val === '1' || val === 'yes' || val === 'on';
};

export const isConsoleEnabled = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return getEnvDefault();
  const val = stored.trim().toLowerCase();
  return val === 'true' || val === '1' || val === 'yes' || val === 'on';
};

export const setConsoleEnabled = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  applyConsoleState(enabled);
};

export const applyConsoleState = (enabled: boolean): void => {
  const b = ensureBackup();

  if (enabled) {
    console.log = b.log;
    console.info = b.info;
    console.debug = b.debug;
    console.warn = b.warn;
    console.error = b.error;
    return;
  }

  const noop: ConsoleMethod = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.error = noop;
};

export const installConsoleToggle = (): void => {
  if (installed) return;
  installed = true;

  ensureBackup();
  applyConsoleState(isConsoleEnabled());

  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      applyConsoleState(isConsoleEnabled());
    }
  });
};
