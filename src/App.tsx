import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/header/Header';
import SelectedItems from './components/selectItems/SelectItems';

export default function App() {
  return (
    <BrowserRouter basename="/Class-components">
      <>
        <Header />
        <AppRoutes />
        <SelectedItems />
      </>
    </BrowserRouter>
  );
}
