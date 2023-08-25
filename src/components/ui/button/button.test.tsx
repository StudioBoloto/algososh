import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {Button} from './button';

describe('Button Component', () => {
    it('renders button with text correctly', () => {
        const {container} = render(<Button text="Click Me"/>);
        expect(container).toMatchSnapshot();
    });

    it('renders button without text correctly', () => {
        const {container} = render(<Button/>);
        expect(container).toMatchSnapshot();
    });

    it('renders disabled button correctly', () => {
        const {container} = render(<Button disabled/>);
        expect(container).toMatchSnapshot();
    });

    it('renders loading button correctly', () => {
        const {container} = render(<Button isLoader/>);
        expect(container).toMatchSnapshot();
    });

    it('calls onClick callback when button is clicked', () => {
        const onClickMock = jest.fn();
        render(<Button text="Click Me" onClick={onClickMock}/>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});
