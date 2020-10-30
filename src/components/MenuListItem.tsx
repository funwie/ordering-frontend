import * as React from 'react';
import { MenuItem } from '../store/Menu';
  
interface Props {
    menuItem: MenuItem;
}

const MenuListItem: React.FC<Props> = props => {
    return (
        <tr data-item-id={props.menuItem.id}>
          <td>{props.menuItem.name}</td>
          <td>{props.menuItem.price}</td>
          <td>{props.menuItem.description}</td>
          <td>{props.menuItem.available}</td>
        </tr>
      );
  };

  export default MenuListItem;