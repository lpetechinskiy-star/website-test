'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Выбор из списка вместо браузерного `<select>`: тот же вид, что у остальных
 * полей, и одинаковый на всех системах — нативный список рисуется шрифтом и
 * цветами ОС и в окно записи не вписывается.
 *
 * Клавиатура ведёт себя как у настоящего списка: стрелки, Home/End, Enter и
 * пробел выбирают, Esc закрывает список, не закрывая окно записи.
 */
export function SelectField({
  id,
  value,
  options,
  onChange,
  label,
  className,
}: {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = `${useId()}-list`;

  // Клик мимо и потеря фокуса закрывают список.
  useEffect(() => {
    if (!open) return;
    const away = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  // Подсвеченный пункт всегда виден, даже если список длиннее своей высоты.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const choose = (index: number) => {
    onChange(options[index]);
    setActive(index);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = (delta: number) => {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((current) => (current + delta + options.length) % options.length);
    };

    switch (event.key) {
      case 'ArrowDown': return step(1);
      case 'ArrowUp': return step(-1);
      case 'Home': if (open) { event.preventDefault(); setActive(0); } return;
      case 'End': if (open) { event.preventDefault(); setActive(options.length - 1); } return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(active);
        else setOpen(true);
        return;
      case 'Escape':
        if (open) {
          // Иначе Esc дошёл бы до <dialog> и закрыл всё окно записи.
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
      default:
        return;
    }
  };

  return (
    <div ref={rootRef} className={cn('select-field', className)}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        onClick={() => { setActive(Math.max(0, options.indexOf(value))); setOpen((state) => !state); }}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${label}: ${value}`}
        className={cn('booking-field select-trigger', open && 'select-trigger-open')}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="select-chevron" aria-hidden />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onKeyDown}
          className="select-list"
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option === value}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className={cn(
                'select-option',
                index === active && 'select-option-active',
                option === value && 'select-option-chosen',
              )}
            >
              <span className="truncate">{option}</span>
              {option === value ? <Check className="size-4 shrink-0" aria-hidden /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
