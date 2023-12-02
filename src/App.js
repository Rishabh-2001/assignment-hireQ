import logo from './logo.svg';
import {Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import HomeLayout from './Layout/HomeLayout';
import NotFound from './pages/NotFound';
function App() {
  return (
    <div className="App  w-[100%] box-content">
          <Routes>
          <Route
            path="/"
            element={
                <HomeLayout />
               }
          >
            <Route  index element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* <Route path="/*" element={<NotFound />} /> */}

      
      </Routes>
    </div>
  );
}

export default App;
