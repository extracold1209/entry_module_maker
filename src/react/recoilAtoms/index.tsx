import { atom, selector } from 'recoil';

export const modeState = atom({
    key: 'modeState',
    default: 'hardware',
});
