import '@testing-library/jest-dom';

globalThis.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
globalThis.HTMLMediaElement.prototype.play = () => Promise.resolve();
globalThis.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
globalThis.HTMLMediaElement.prototype.addTextTrack = () => ({}) as unknown as TextTrack;
