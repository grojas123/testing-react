import * as React from "react";
import App,{
    storiesReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from './App';
const storyOne = { title: 'React', url: 'https:// reactjs.org/', author: 'Jordan Walke', num_comments: 3, points: 4, objectID: 0, };
const storyTwo = { title: 'Redux', url: 'https:// redux.js.org/', author: 'Dan Abramov, Andrew Clark', num_comments: 2, points: 5, objectID: 1, };

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