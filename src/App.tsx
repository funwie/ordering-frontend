import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import MenuList from './components/MenuList';
import TodoList from './components/todo/ToDoList';

 const App = () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/menu/:categoryFilter?' component={MenuList} />
        <Route path='/todos/:done?' component={TodoList} />
    </Layout>
);

export default App;
