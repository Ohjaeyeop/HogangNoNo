import React, {useEffect} from 'react';
import Home from './components/Home';
import * as db from './db/db';

const App = () => {
  async function dbInitialize() {
    await db.init();
    await db.selectAll();
  }
  /*  useEffect(() => {
    dbInitialize();
  }, []);*/
  return <Home />;
};

export default App;
