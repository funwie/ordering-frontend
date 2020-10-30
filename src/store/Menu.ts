import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

let menuItem = {
    "name": "Test Menu Items",
    "category": "Failed",
    "price": 1000,
    "available": true,
    "imageUrl": "",
    "description": "Could not get Menu from the backend",
    "id": "5f9b985d23b2cd75fc182f28"
};

let initialData: MenuItem[] = [menuItem, menuItem, menuItem];


export interface MenuState {
    isLoading: boolean;
    categoryFilter?: string;
    menuItems: MenuItem[];
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    available: boolean;
    imageUrl: string;
    description: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestMenuAction {
    type: 'REQUEST_MENU';
    categoryFilter: string;
}

interface ReceiveMenuAction {
    type: 'RECEIVE_MENU';
    categoryFilter: string;
    menuItems: MenuItem[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestMenuAction | ReceiveMenuAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestMenu: (categoryFilter: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.menu && categoryFilter !== appState.menu.categoryFilter) {
            fetch('http://localhost:3600/items')
                .then(response => response.json() as Promise<MenuItem[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_MENU', categoryFilter: categoryFilter, menuItems: data });
                }).catch(error => {
                    if (appState && appState.menu && appState.menu.menuItems) {
                        dispatch({ type: 'RECEIVE_MENU', categoryFilter: categoryFilter, menuItems: appState.menu.menuItems });
                    } else {
                        dispatch({ type: 'RECEIVE_MENU', categoryFilter: categoryFilter, menuItems: initialData });
                    } 
                });

            dispatch({ type: 'REQUEST_MENU', categoryFilter: categoryFilter });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: MenuState = { menuItems: [], isLoading: false };

export const reducer: Reducer<MenuState> = (state: MenuState | undefined, incomingAction: Action): MenuState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_MENU':
            return {
                categoryFilter: action.categoryFilter,
                menuItems: state.menuItems,
                isLoading: true
            };
        case 'RECEIVE_MENU':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.categoryFilter === state.categoryFilter) {
                return {
                    categoryFilter: action.categoryFilter,
                    menuItems: action.menuItems,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
