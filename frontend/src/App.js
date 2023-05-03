import { Link, BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Feedy from './Feedy';
import Item from './Item';
import Test from './Test';
//import FrontTab from './FrontTab';
import HeaderTop from './HeaderTop';
import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route path='/RegisterPage' element={<RegisterPage />}/>
          <Route path='/Feedy' element={<Feedy />}></Route>
        </Routes>
  </BrowserRouter>
  );
}

export default App;
