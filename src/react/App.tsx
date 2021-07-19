import React from 'react';
import ReactDom from 'react-dom';
import MainContainer from './MainContainer';
import { RecoilRoot } from 'recoil';
ReactDom.render(
    <RecoilRoot>
        <MainContainer />
    </RecoilRoot>,
    document.getElementById('__root__')
);
