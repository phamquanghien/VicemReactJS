import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home'
import Menu from './components/home/Menu';
import ListEmployee from './components/employee/ListEmployee';
import ListRole from './components/role/ListRole';

function App() {
  return (
    <Router>
      <Menu/>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/employee' element={<ListEmployee/>}/>
          <Route path='/role' element={<ListRole/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;


