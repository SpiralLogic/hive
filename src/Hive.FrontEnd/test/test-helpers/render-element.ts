import { render } from '@testing-library/preact';
import { ComponentChild } from 'preact';

export const renderElement = (component: ComponentChild): Element => render(component).baseElement;
