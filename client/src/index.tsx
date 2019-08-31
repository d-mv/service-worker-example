import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { run } from './service';

ReactDOM.render(<App />, document.getElementById('root'));

// run service worker
run();