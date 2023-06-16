import { Link, BrowserRouter, Route, Routes  } from 'react-router-dom'
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
//import Item from './Item';
//import FrontTab from './FrontTab';
import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemScrollPage from './mainPage/ItemScrollPage';
import ItemPage from "./specificItemPage/ItemPage"
import FavoriteItems from './favoriteItems/FavoriteItems';
import ChatPage from './chating/ChatPage';
import ChatList from './chating/ChatList';
import ChatMessages from './chating/ChatMessages';
import HomePage from './mainPage/HomePage';
import UserAccountPage from './accountPage/UserAccountPage';
import UploadItem from './accountPage/UploadItem';
import UserAccountMenu from './accountPage/UserAccountMenu';
import UserProfilePage from './userPage/UserProfilePage';



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
          
          <Route path='/userPage/:userProName' element={<UserProfilePage   />}></Route>
        </Routes>
  </BrowserRouter>
  );
}

export default App;
