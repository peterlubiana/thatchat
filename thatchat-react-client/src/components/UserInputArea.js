import React from 'react';
import './UserInputArea.css';

function UserInputArea() {
  return (
    <div className="UserInputArea">
     <input type="textarea" autocomplete="off" placeholder="Write something!" id="txtpusher" data-bind="value: wallText, valueUpdate: 'keyup'"/>    
    </div>
  );
}

export default UserInputArea;
