import { render } from '@testing-library/preact';
import { ComponentChild, VNode } from 'preact';

export const renderElement = (component: ComponentChild): Element => render(component).baseElement;
