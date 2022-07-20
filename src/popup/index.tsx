import React from 'react';
import { createRoot } from 'react-dom/client';
import Popup from './popup';
import Options from '../options/options';
import '../static/tailwind.css';

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Options />);
