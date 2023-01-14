import * as React from "react";
import {
    render,
    screen,
    fireEvent,
    act,
} from "@testing-library/react";
import App,{
    storiesReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from './App';
const storyOne = { title: 'React', url: 'https://reactjs.org/', author: 'Jordan Walke', num_comments: 3, points: 4, objectID: 0, };
const storyTwo = { title: 'Redux', url: 'https://redux.js.org/', author: 'Dan Abramov, Andrew Clark', num_comments: 2, points: 5, objectID: 1, };

const stories = [storyOne,storyTwo];
// This a test of a function storiesReducer
describe('storiesReducer', () => {
    test('handles the STORIES_FETCH_INIT action', () => {
        const state = {};
        const action = { type: 'STORIES_FETCH_INIT' };
        const newState = storiesReducer(state, action);
        expect(newState.isLoading).toBe(true);
        expect(newState.isError).toBe(false);
    });

    test('handles the STORIES_FETCH_SUCCESS action', () => {
        const state = {};
        const action = { type: 'STORIES_FETCH_SUCCESS', payload: [storyOne] };
        const newState = storiesReducer(state, action);
        expect(newState.isLoading).toBe(false);
        expect(newState.isError).toBe(false);
        expect(newState.data).toEqual(action.payload);
    });

    test('handles the STORIES_FETCH_FAILURE action', () => {
        const state = {};
        const action = { type: 'STORIES_FETCH_FAILURE' };
        const newState = storiesReducer(state, action);
        expect(newState.isLoading).toBe(false);
        expect(newState.isError).toBe(true);
    });

    test('handles the REMOVE_STORY action', () => {
        const state = { data: stories };
        const action = { type: 'REMOVE_STORY', payload: storyOne };
        const newState = storiesReducer(state, action);
        expect(newState.data).toEqual([storyTwo]);
    });

    test('throws an error when the default case is reached', () => {
        const state = {};
        const action = { type: 'UNKNOWN_ACTION' };
        expect(() => storiesReducer(state, action)).toThrow();
    });
});
describe('Item',()=>{
    test('renders all properties',()=>{
        render(<Item item={storyOne}/>);
        // use to see what was rendered of the element
        // screen.debug();
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );

    });
    test('renders al clickable dismiss button',()=>{
        render(<Item item={storyOne}/>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    })
    test('clicking the dismiss button calls the callback handler',
        ()=>{
        const handleRemoveItem = jest.fn();
        render(<Item item={storyOne} onRemoveItem={handleRemoveItem}/>);
        fireEvent.click(screen.getByRole('button'));
        expect(handleRemoveItem).toHaveBeenCalledTimes(1);

        });
});
describe('SearchForm',()=>{
    const searchFormProps = {
        searchTerm:'React',
        onSearchInput: jest.fn(),
        onSearchSubmit: jest.fn(),
    };
    test('renders the input field with its value',()=>{
        render(<SearchForm {...searchFormProps}/>)
        // to check the element screen.debug();
        // This is the default value on the input field 'React'
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });
    test('renders the correct label',()=>{
        render(<SearchForm {...searchFormProps}/>);
        // Using  a regular expression /Search/
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });
    //Test for interactive actions
    test('calls onSearchInput on input field change',()=>{
        render(<SearchForm {...searchFormProps}/>);
        fireEvent.change(screen.getByDisplayValue('React'),{
            target: {value: 'Redux'}
        });
        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });
    test('calls onSearchSubmit on button submit click',()=>{
        render(<SearchForm {...searchFormProps}/>);
        fireEvent.submit(screen.getByRole('button'));
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('List',()=>{
    const listProps={
        list:stories,
        onRemoveItem:jest.fn(),
    }
test('renders the list',()=>{
    render(<List {...listProps}/>);
    ///screen.debug();
   expect(screen.getByRole('list')).toBeInTheDocument()
})
    test('renders the list and check if 2 elements are present',()=>{
        render(<List {...listProps}/>);
        expect(screen.getAllByRole('listitem').length).toStrictEqual(2)
    })

})
describe('InputWithLabel',()=>{
    const inputWithLabelProps={
        id:"search",
        value:"React",
        isFocused:true,
        onInputChange:jest.fn,
        children:jest.fn
    }
})