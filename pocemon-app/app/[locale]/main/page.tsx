import getApiInfo from '../../../lib/getApiInfo';
import CardList from '../../../components/cardList/CardList';
import Search from '../../../components/search/Search';
import SelectedItemsFlyout from '../../../components/selectItems/SelectItems';
import styles from './Main.module.css';

export default async function MainPage() {
  const items = await getApiInfo('', 0, 10);

  return (
    <div className={styles.masterDetailLayout}>
      <div className={styles.leftPane}>
        <Search />
        <CardList items={items} />
        <SelectedItemsFlyout />
      </div>
    </div>
  );
}
