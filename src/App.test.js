import * as React from "react";
import axios from "axios";

import {
    render,
    screen,
    fireEvent,
    act
} from "@testing-library/react";
import App,{
    storiesReducer,

    Item,
    List,
    SearchForm,
    InputWithLabel
} from './App';
import promise from "promise";
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
test('check if the list are in the document',()=>{
    render(<List {...listProps}/>);
    ///screen.debug();
   expect(screen.getByRole('list')).toBeInTheDocument()
})
    test('list and check if 2 elements are present',()=>{
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
        children:<strong>Search:</strong>
    }
    test('check InputWithLabel',()=>{
        render(<InputWithLabel {...inputWithLabelProps}/>);
        //screen.logTestingPlaygroundURL()
        //For debugging using testing-playground, screen exposes this convenient method
        // which logs and returns a URL that can be opened in a browser.
        expect(screen.getByRole('textbox', { name: /search:/i})).toBeInTheDocument();
    });
});
// This code is integration test First the testing fetching .
jest.mock('axios');
describe('App',()=>{
    test('success fetching data (happy path)',async ()=>{
        const promise = Promise.resolve({
            data: {
                hits:stories,
            },
        }

        )
            axios.get.mockImplementationOnce(() => promise);
            render(<App/>);
            //screen.debug();
            expect(screen.queryByText(/Loading/)).toBeInTheDocument();

            await act(()=> promise);

            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.getByText('React')).toBeInTheDocument();
            expect(screen.getByText('Redux')).toBeInTheDocument();
           expect(screen.getAllByText('Dismiss').length).toBe(2);

    });
    test('fails fetching data', async ()=>{
        const promise = Promise.reject();

        axios.get.mockImplementationOnce(()=> promise);

        render(<App/>);

        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        try {
            await act(() => promise);

        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }

    })
    test('removes a story', async ()=>{
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });
    axios.get.mockImplementationOnce(()=> promise);
    render(<App/>);

    await act(() => promise);

    expect(screen.getAllByText('Dismiss').length).toBe(2);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('Dismiss')[0]);

    expect(screen.getAllByText('Dismiss').length).toBe(1);
    expect(screen.queryByText('Jordan Walke')).toBeNull();

    })

    test('searches for specific stories', async ()=> {
        const reactPromise = Promise.resolve({
            data: {
                hits: stories,
            },
        });
        const anotherStory = {
            title: 'JavaScript',
            url:'https://en.wikipedia.org/wiki/JavaScript',
            author:'Brendan Eich',
            num_comments: 15,
            points:10,
            objectID: 3,
        };

        const javascriptPromise = Promise.resolve({
            data: {
              hits:[anotherStory],
            },
        });

        axios.get.mockImplementation((url)=>{
            if (url.includes('React')) {
                return reactPromise;
            }
            if (url.includes('JavaScript')){
                return javascriptPromise;
            }
            throw Error();
        });
        // Initial Render
        render(<App/>);

        // First Data Fetching
        await act(()=>reactPromise);

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
        expect(screen.queryByText('Brendan Eich')).toBeNull();

        // User interaction  - Search
        // this event change the value on the input the search
        fireEvent.change(screen.queryByDisplayValue('React'),{
            target:{
                value: 'JavaScript',
            },
        });
        expect(screen.queryByDisplayValue('React')).toBeNull();
        expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.submit(screen.queryByText('Submit'));

        //Second Daa Fetching

        await act(()=> javascriptPromise);

        expect(screen.queryByText('Jordan Walke')).toBeNull();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
        expect(screen.getByText('Brendan Eich')).toBeInTheDocument();

    });
});
