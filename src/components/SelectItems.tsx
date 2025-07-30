import { useSelectionStore } from '../store/useSelectionStore';
import styles from './SelectedItems.module.css';

export default function SelectedItemsFlyout() {
  const selectedSet = useSelectionStore((state) => state.selected);
  const selected = Array.from(selectedSet);
  console.log(selected);
  const clearAll = useSelectionStore((state) => state.clearAll);

  if (selected.length === 0) return null;

  const handleDownload = () => {
    const csvRows = selected.map((name) => `"${name}"`);
    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `${selected.length}_items.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.selectedItemsBlock}>
      <div>
        {selected.length} item{selected.length > 1 ? 's' : ''} selected
      </div>
      <div>
        <button onClick={clearAll}>Unselect all</button>
        <button onClick={handleDownload} style={{ marginLeft: '10px' }}>
          Download
        </button>
      </div>
    </div>
  );
}
