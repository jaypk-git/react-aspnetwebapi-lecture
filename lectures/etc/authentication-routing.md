```jsx
// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username) => {
    // 실제 구현에서는 여기서 API 호출 등을 통해 인증을 수행합니다.
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;

// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </nav>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

// Login.js
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const history = useHistory();
  const location = useLocation();
  const { login } = useAuth();

  const { from } = location.state || { from: { pathname: "/" } };

  const handleLogin = () => {
    login("example_user");
    history.replace(from);
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
};

export default Login;

// Dashboard.js
import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Dashboard;
```
