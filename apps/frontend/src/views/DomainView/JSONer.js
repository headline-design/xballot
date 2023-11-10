import React, { useState } from 'react';

const JSONer = (props) => {
  const [advancedOptions, setAdvancedOptions] = useState('none');
  const options = Object.keys(props.object);

  function doJsonStuff(key) {
    props.object[key] = document.getElementById('input' + key).value;
    props.callBack(props.object);
  }

  function remove(key) {
    delete props.object[key];
    props.callBack(props.object);
    let index = options.indexOf(key);
    delete options[index];
    let parent = document.getElementById('div' + key);
    parent.remove();
  }

  function toggle() {
    if (advancedOptions === 'none') {
      setAdvancedOptions('block');
    } else {
      setAdvancedOptions('none');
    }
  }

  function createNew() {
    let key = document.getElementById('jsonerNew').value;
    if (key !== '') {
      if (!options.includes(key)) {
        props.object[key] = 'new value';
        options.push(key);
        props.callBack(props.object);
        let child = document.createElement('div');
        child.innerHTML =
          '<div class="meta-grid-2x" id="div' +
          key +
          '"><input class="prof-module sc-dSfdvi base-1 unset-border input-action" disabled value="' +
          key +
          '"><input class="prof-module sc-dSfdvi base-1 unset-border input-action" id="input' +
          key +
          '"><button class="add-remove-row-btn save-icon" id="' +
          key +
          '"></button><button class="add-remove-row-btn delete-icon" name="' +
          key +
          '" id="delete' +
          key +
          '"></button></div>';
        let parent = document.getElementById('options');
        parent.appendChild(child);
        document.getElementById(key).onclick = function (event) {
          doJsonStuff(event.target.id);
        };
        document.getElementById('delete' + key).onclick = function (event) {
          remove(event.target.name);
        };
      } else {
        alert('Key already exists!');
      }
    } else {
      alert('Enter a key value!');
    }
  }

  return (
    <div className="addrows-margin">

<div
        >   <div className="">
           <div className="prof-module base-1 unset-border">
 
           </div>
              
                  <div id="options">
                  

              
                   
                  </div>
                  
             
                   
            
                
                </div>
                
            
                
                
                                    
</div>
<div className="prof-module sc-dl4 bBOiLB unset-border dJQyXW prof-module sc-dSfdvi base-1 unset-border input-action">
           <div className="prof-module base-1 unset-border">
           <button
                      class="add-btn"
                      onClick={createNew}
                    >+ Add</button>
              
              </div>
              <div className="prof-module sc-eCImPb sc-tAExr base-1 unset-border dKkoen gdheUS">
              <input className="sc-dl1 sc-jlRLRk sc-dUbtfd kKeIIW input-c1 " id="jsonerNew" placeholder="New key"></input>
             </div></div></div>
      
  );
};

export default JSONer;