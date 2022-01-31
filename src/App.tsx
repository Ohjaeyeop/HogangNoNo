import React, {useEffect} from 'react';
import Home from './components/Home';
import * as db from './db/db';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  useEffect(() => {
    db.init();
  }, []);
  return (
    <NavigationContainer>
      <Home />
    </NavigationContainer>
  );
};

export default App;
