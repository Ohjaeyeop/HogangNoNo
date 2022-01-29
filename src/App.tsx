import React, {useEffect} from 'react';
import Home from './components/Home';
import * as db from './db/db';

const App = () => {
  useEffect(() => {
    db.init();
  }, []);
  return <Home />;
};

export default App;
