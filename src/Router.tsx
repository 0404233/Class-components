import { Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
    </Routes>
  );
}
