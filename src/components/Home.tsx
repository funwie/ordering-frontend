import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>
    <h1>Hello, world!</h1>
    <p>This is the frontend of ordering api backend</p>
    <p>My Initial planning was to do ordering menu items but time is limited. I added a Quick Todo</p>
    <p>I will continue the project to implement the ordering feature. Let me know if you want a copy of this in the future.</p>
  </div>
);

export default connect()(Home);
