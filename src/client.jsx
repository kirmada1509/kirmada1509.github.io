import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import '@radix-ui/themes/styles.css';
import './styles.css';
import { App } from './portfolio.jsx';
const caseData=document.getElementById('case-data');
hydrateRoot(document.getElementById('portfolio'), <App caseContent={caseData?JSON.parse(caseData.textContent):undefined}/>);
