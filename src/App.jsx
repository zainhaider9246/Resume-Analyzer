import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Analyzer from './pages/Analyzer';

function App() {
  return (
    <>
      <Navbar />
      <Analyzer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
