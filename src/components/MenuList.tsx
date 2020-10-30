import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as MenuStore from '../store/Menu';
import MenuListItem from './MenuListItem';

type MenuProps = MenuStore.MenuState // ... state we've requested from the Redux store
  & typeof MenuStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ categoryFilter: string }>; // ... plus incoming routing parameters


class MenuList extends React.PureComponent<MenuProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Restaurant Menu</h1>
        <p>Our delicious meals</p>
        {this.renderMenuTable()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    const categoryFilter = this.props.match.params.categoryFilter || '';
    this.props.requestMenu(categoryFilter);
  }

  private renderMenuTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {this.props.menuItems.map((menuItem: MenuStore.MenuItem) =>
            <MenuListItem key={menuItem.id} menuItem={menuItem} />
          )}
        </tbody>
      </table>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.menu, // Selects which state properties are merged into the component's props
  MenuStore.actionCreators // Selects which action creators are merged into the component's props
)(MenuList as any);
