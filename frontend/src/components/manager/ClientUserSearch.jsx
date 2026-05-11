import { useEffect, useRef, useState } from 'react';
import { usersApi } from '../../api/users.api.js';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';

const DEBOUNCE_MS = 300;
const FETCH_LIMIT = 40;

/**
 * Пошук клієнта / бізнес-клієнта за запитом (сервер обмежує кількість результатів).
 */
export function ClientUserSearch({ selected, onSelect, onClear }) {
  const [input, setInput] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (selected) {
      setResults([]);
      setOpen(false);
      return undefined;
    }

    const q = debounced.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const isIdQuery = /^\d+$/.test(q);
    if (!isIdQuery && q.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    usersApi
      .listOrderableClients({ search: q, limit: FETCH_LIMIT })
      .then((list) => {
        if (!cancelled) setResults(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, selected]);

  const pick = (client) => {
    onSelect(client);
    setInput('');
    setDebounced('');
    setResults([]);
    setOpen(false);
  };

  if (selected) {
    return (
      <div className="client-user-search client-user-search--selected">
        <span className="input-label">Клієнт</span>
        <div className="client-user-search__picked">
          <div className="client-user-search__picked-main">
            <strong>{selected.label}</strong>
            <span className="client-user-search__meta">
              {selected.role}
              {selected.phone ? ` · ${selected.phone}` : ''}
            </span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Змінити
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="client-user-search" ref={wrapRef}>
      <Input
        label="Клієнт"
        name="clientSearch"
        type="search"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        placeholder="Пошта, телефон, ім'я, компанія або ID…"
        hint="Мінімум 2 символи (або точний числовий ID). До 40 результатів."
      />
      {open && (input.trim() || loading) && (
        <div className="client-user-search__panel" role="listbox">
          {loading && <div className="client-user-search__status">Пошук…</div>}
          {!loading &&
            input.trim() &&
            !/^\d+$/.test(input.trim()) &&
            input.trim().length === 1 && (
              <div className="client-user-search__status">Введіть ще один символ для пошуку</div>
            )}
          {!loading &&
            input.trim() &&
            debounced.trim() === input.trim() &&
            (input.trim().length >= 2 || /^\d+$/.test(input.trim())) &&
            results.length === 0 && (
              <div className="client-user-search__status">Нічого не знайдено</div>
            )}
          {!loading &&
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                className="client-user-search__option"
                role="option"
                onClick={() => pick(c)}
              >
                <span className="client-user-search__option-title">{c.label}</span>
                <span className="client-user-search__option-meta">
                  {c.role}
                  {c.phone ? ` · ${c.phone}` : ''}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
