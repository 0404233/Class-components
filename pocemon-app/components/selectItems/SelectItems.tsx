'use client';

import { useSelectionStore } from '../../store/useSelectionStore';
import { useTranslations } from 'next-intl';
import styles from './SelectedItems.module.css';

export default function SelectedItemsFlyout() {
  const selectedSet = useSelectionStore((state) => state.selected);
  const selected = Array.from(selectedSet);
  const clearAll = useSelectionStore((state) => state.clearAll);
  const t = useTranslations();

  if (selected.length === 0) return null;

  const handleDownload = async () => {
    const res = await fetch('/api/downloadCsv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: selected }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selected.length}_items.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.selectedItemsBlock}>
      <div>{t('selectedItems', { count: selected.length })}</div>
      <div>
        <button onClick={clearAll}>{t('unselectAll')}</button>
        <button onClick={handleDownload} style={{ marginLeft: '10px' }}>
          {t('download')}
        </button>
      </div>
    </div>
  );
}
