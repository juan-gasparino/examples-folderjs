import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../styles/main.scss';

import { App } from './App';

import '../styles/main.scss';

const main = document.getElementById('main');

ReactDOM.render(<App path={'../../documents'}/>,main);