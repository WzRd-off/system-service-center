import { useCallback, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../components/common/PaginationBar.jsx';
import { equipmentApi } from '../api/equipment.api.js';

const DEVICE_SORT_FIELDS = [
  { value: 'type', label: 'Тип' },
  { value: 'manufacturer', label: 'Виробник' },
  { value: 'model', label: 'Модель' },
  { value: 'serial_number', label: 'Серійний номер' },
];

const SORT_DIRECTIONS = [
  { value: 'asc', label: 'За зростанням' },
  { value: 'desc', label: 'За спаданням' },
];

function deviceConfirmLabel(device) {
  const label = `${device.type || ''} ${device.manufacturer || ''} ${device.model || ''}`.trim();
  return label || 'пристрій';
}

/**
 * Стан і дії для сторінок керування технікою (клієнт / бізнес).
 */
export function useManagedDevicesPage(data, reload) {
  const [activeTab, setActiveTab] = useState('create');
  const [listError, setListError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('type');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);

  const addDevice = useCallback(
    async (form) => {
      await equipmentApi.create(form);
      reload();
      setActiveTab('list');
    },
    [reload]
  );

  const handleDeleteDevice = useCallback(
    async (device) => {
      const label = deviceConfirmLabel(device);
      if (!window.confirm(`Видалити техніку «${label}»?`)) return;

      setListError(null);
      setRemovingId(device.id);
      try {
        await equipmentApi.delete(device.id);
        reload();
      } catch (err) {
        setListError(err?.message || 'Не вдалось видалити');
      } finally {
        setRemovingId(null);
      }
    },
    [reload]
  );

  const visibleDevices = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const query = search.trim().toLowerCase();

    const filtered = query
      ? list.filter((d) =>
          [d.type, d.manufacturer, d.model, d.serial_number, d.notes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query)
        )
      : list;

    return [...filtered].sort((a, b) => {
      const left = String(a?.[sortField] ?? '');
      const right = String(b?.[sortField] ?? '');
      const cmp = left.localeCompare(right, 'uk', { sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, search, sortField, sortDirection]);

  const maxPage = Math.max(0, Math.ceil(visibleDevices.length / PAGE_SIZE) - 1);
  const effectivePage = Math.min(page, maxPage);

  const pagedDevices = useMemo(() => {
    const start = effectivePage * PAGE_SIZE;
    return visibleDevices.slice(start, start + PAGE_SIZE);
  }, [visibleDevices, effectivePage]);

  return {
    activeTab,
    setActiveTab,
    listError,
    removingId,
    search,
    setSearch,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    page: effectivePage,
    setPage,
    addDevice,
    handleDeleteDevice,
    visibleDevices,
    pagedDevices,
    sortFieldOptions: DEVICE_SORT_FIELDS,
    sortDirectionOptions: SORT_DIRECTIONS,
  };
}
