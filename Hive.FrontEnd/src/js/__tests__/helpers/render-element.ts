import {render} from '@testing-library/preact';

export const renderElement = (component: typeof render.arguments[0]) =>  render(component).container.firstElementChild as HTMLElement;
