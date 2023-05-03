import { Link, BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import Item from './Item';
import Test from './Test';
//import FrontTab from './FrontTab';
import HeaderTop from './HeaderTop';
import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from './chating/ChatPage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route path='/RegisterPage' element={<RegisterPage />}/>
          <Route path='/ChatPage' element={<ChatPage />}></Route>
        </Routes>
  </BrowserRouter>
  );
}

export default App;
