import { Link, BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Feedy from './Feedy';

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
