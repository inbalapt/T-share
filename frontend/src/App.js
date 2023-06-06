import { Link, BrowserRouter, Route, Routes  } from 'react-router-dom'
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
//import Item from './Item';
import Test from './Test';
//import FrontTab from './FrontTab';
import HeaderTop from './HeaderTop';
import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemScrollPage from './ItemScrollPage';
import ItemPage from "./ItemPage"
import FavoriteItems from './FavoriteItems';
import ChatPage from './chating/ChatPage';
import ChatList from './chating/ChatList';
import ChatMessages from './chating/ChatMessages';
import HomePage from './HomePage';
import UserAccountPage from './UserAccountPage';
import UploadItem from './UploadItem';
import UserAccountMenu from './UserAccountMenu';
import TempAccount from './TempAccount';
import UserProfilePage from './UserProfilePage';



function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route path='/HomePage' element={<HomePage />}/>
          <Route path='/RegisterPage' element={<RegisterPage />}/>
          <Route path='/ChatPage' element={<ChatPage />}></Route>
          <Route path='/clothing/:category' element={<ItemScrollPage  />}></Route>
          <Route path='/item/:id' element={<ItemPage   />}></Route>
          <Route path='/favorites' element={<FavoriteItems/>} />
          <Route path='/account' element={<UserAccountPage/>}></Route>
          <Route path='/test' element={<TempAccount/>}></Route>
          <Route path='/userPage/:userProName' element={<UserProfilePage   />}></Route>
        </Routes>
  </BrowserRouter>
  );
}

export default App;
