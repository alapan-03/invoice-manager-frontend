import logo from './logo.svg';
import './App.css';
import Home from './pages/Home.jsx';
import InvoiceList from './Components/InvoiceList/InvoiceList.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          {/* Define routes */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/invoices" element={<InvoiceList />} /> */}
          {/* <Route path="/" element={<FetchInvoice />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
