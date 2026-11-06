import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './portfolio.jsx';
export function render(){return renderToString(<App/>);}

export function renderCase(content){return renderToString(<App caseContent={content}/>);}
