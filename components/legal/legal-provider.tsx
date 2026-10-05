'use client';

import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { LEGAL, type LegalDocument } from '@/lib/legal';
import { cn } from '@/lib/utils';

const LegalContext = createContext<{ open: (id: LegalDocument['id']) => void } | null>(null);

export function LegalProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<LegalDocument['id'] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = useCallback((id: LegalDocument['id']) => setCurrent(id), []);
  const close = useCallback(() => setCurrent(null), []);
  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
  }, [current]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setCurrent(null);
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  const document_ = current ? LEGAL[current] : null;

  return (
    <LegalContext.Provider value={value}>
      {children}

      <dialog ref={dialogRef} className="booking-dialog legal-dialog" aria-labelledby="legal-title">
        <div className="booking-panel">
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
            aria-label="Закрыть"
          >
            <X className="size-5" aria-hidden />
          </button>

          {document_ ? (
            <article className="legal-text">
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs tracking-wide text-ink uppercase">
                документ
              </span>
              <h2 id="legal-title" className="mt-4 font-display text-2xl leading-tight font-black sm:text-3xl">
                {document_.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{document_.lead}</p>

              {document_.sections.map((section) => (
                <section key={section.heading} className="mt-7">
                  <h3 className="font-display text-base font-black">{section.heading}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                  {section.list ? (
                    <ul className="mt-2 space-y-1.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blush" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className="booking-actions">
                <button
                  type="button"
                  onClick={close}
                  className="w-full rounded-2xl bg-ink py-4 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Понятно
                </button>
              </div>
            </article>
          ) : null}
        </div>
      </dialog>
    </LegalContext.Provider>
  );
}

export function useLegal() {
  const context = useContext(LegalContext);
  if (!context) throw new Error('useLegal must be used inside LegalProvider');
  return context;
}

/** Link-looking button that opens one of the documents. */
export function LegalLink({
  document: id,
  children,
  className,
}: {
  document: LegalDocument['id'];
  children: ReactNode;
  className?: string;
}) {
  const { open } = useLegal();
  return (
    <button type="button" onClick={() => open(id)} className={cn('legal-link', className)}>
      {children}
    </button>
  );
}
