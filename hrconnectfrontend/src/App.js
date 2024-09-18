// App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Component } from 'react';
import './App.css';
import Login from './components/Login';
import Hrconnect from './context'; 
import Signup from "./components/Signup";
import Header from "./components/Header";
import NotFound from './NotFound';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Profile from './components/Profile';
import CreateJobs from './components/CreateJobs';
import Resumes from './components/Resumes';
import Apply from './components/Apply';
import Applications from './components/Applications';

class App extends Component {
  state = {
    role: '',
  };

  setrole = (role) => {
    this.setState({ role: role });
  };

  render() {
    const { role } = this.state;
    return (
      <Hrconnect.Provider value={{ role, setrole: this.setrole }}>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={Home} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
            <Route path="/create_jobs" element={<ProtectedRoute element={CreateJobs} />} />
            <Route path="/apply/:jobId" element={<ProtectedRoute element={Apply} />} />
            <Route path="/applications/:jobId" element={<ProtectedRoute element={Applications} />} />
            <Route path="/resumes" element={<ProtectedRoute element={Resumes} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Hrconnect.Provider>
    );
  }
}

export default App;
