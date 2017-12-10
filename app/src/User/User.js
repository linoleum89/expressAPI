import React from 'react';

const user = (props) => {
    return (
          <tr>
            <td>{props.user.id}</td>
            <td>{props.user.first_name} {props.user.last_name}</td>
            <td></td>
            <td>
              <button>Edit</button>
            </td>
            <td>
              <button onClick={props.remove}>Remove</button>
            </td>
          </tr>
    );
}

export default user;