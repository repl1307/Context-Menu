//add icon styling
function addIconStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
  .icon {
    width: 15px;
    height: auto;
    margin: 0px 5px;
  }`;
  document.head.appendChild(style);
}
addIconStyles();

class ContextMenu {
  constructor(options, parent = document.body, backgroundColor = 'darkgrey', color = 'white', hover = 'lighten', customStyles = '') {
    this.backgroundColor = backgroundColor;
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMONPQRSTUVWXYZ';
    this.id = '';
    for(let i = 0; i < 7; i++){this.id += chars[Math.floor(Math.random()*(chars.length-1))];}
    if(!parent.dataset.menu){ parent.dataset.menu = this.id; }
    this.color = color;
    this.parent = parent;
    this.hover = hover;
    this.contextMenu = this.createContextMenu(options);
    this.contextMenu.style.display = 'none';
    this.target = null;
    //hide option menu on click
    document.addEventListener('mousedown', e => {
      if (!this.contextMenu.contains(e.target)){
        this.contextMenu.style.display = 'none';
      }
    });
    //hide option menu on scroll
    window.addEventListener('scroll', e => {
      this.contextMenu.style.display = 'none';
    });
    //replace default context menu 
    this.parent.addEventListener('contextmenu', e => {
      e.preventDefault();
      const offset = 15;
      let parent = e.target.parentNode;
      if(parent != document.documentElement && parent != document.body){
        console.log(parent.innerHTML)
        while(!parent.dataset.menu){
          parent = parent.parentNode;
        }
        if(!parent.dataset.menu){
          alert('asdf')
        }
        else{
          e.target.dataset.menu = parent.dataset.menu;
        }
      }
      //update target and visibility if id matches element id
      if(e.target.dataset.menu == this.id){
        this.contextMenu.style.display = 'flex';
        this.target = e.target;
      }
      if (parseInt(e.clientX) + 200 >= window.innerWidth) {
        this.contextMenu.style.left = (e.clientX - 200 - offset) + 'px'
      }
      else {
        this.contextMenu.style.left = (e.clientX) + 'px';
      }
      const height = parseInt(getComputedStyle(this.contextMenu).height.replace('px', ''));
      if (parseInt(e.clientY) + height >= window.innerHeight)
        this.contextMenu.style.top = (e.clientY - height - offset) + 'px';
      else
        this.contextMenu.style.top = (e.clientY) + 'px';
    });

  }
  //create actual context menu
  createContextMenu = function(options = []) {
    const container = document.createElement('ul');
    container.style = globalContainerStyling(this.backgroundColor, this.color) + ' width: 200px;';
    //loop throught base options
    for (const option of options) {
      //option.parent = this.parent;
      option.menu = this;
      option.callbackWrapper = (opt) => { this.contextMenu.style.display = 'none' };
      const optElem = this.createListItem();
      const svg = option.icon;
      //handle options that contain additional options within them
      optElem.innerHTML += option.icon + option.name;
      optElem.onclick = option.callback;
      const innerContainer = document.createElement('ul');
      innerContainer.style = globalContainerStyling(this.backgroundColor, this.color) + ' display: none; min-width:100px; margin-left: 5px; left: 100%;';
      //loop through inner options
      for (const innerOption of option.options) {
        innerOption.parent = this.parent;
        const innerOptElem = this.createListItem(innerOption.name);
        innerOptElem.onclick = innerOption.callback;
        innerContainer.appendChild(innerOptElem);
      }
      //styling and removing parent click callback if children exist
      if (option.options.length > 0) {
        optElem.onclick = null;
        innerContainer.firstChild.style.borderTopLeftRadius = '10px';
        innerContainer.firstChild.style.borderTopRightRadius = '10px';
        innerContainer.lastChild.style.borderBottomLeftRadius = '10px';
        innerContainer.lastChild.style.borderBottomRightRadius = '10px';
        optElem.appendChild(innerContainer);
      }
      container.appendChild(optElem);
    }
    container.firstChild.style.borderTopLeftRadius = '10px';
    container.firstChild.style.borderTopRightRadius = '10px';
    container.lastChild.style.borderBottomLeftRadius = '10px';
    container.lastChild.style.borderBottomRightRadius = '10px';
    document.body.appendChild(container);
    return container;
  }
  //create list item
  createListItem = function(message = '') {
    const li = document.createElement('li');
    li.style = globalListItemStyling(this.color);
    li.textContent = message;
    li.onmouseover = () => {
      li.dataset.hover = true;
      for (const child of li.children) {
        child.style.display = 'block';
        const rect = child.getBoundingClientRect();
        //console.log(rect);
        if (rect.x + rect.width > window.innerWidth) {
          child.style.left = '-' + (rect.width + 10) + 'px';
        }
      }
      if (this.hover == 'lighten')
        li.style.backgroundColor = tinycolor(this.backgroundColor).lighten(10).toString();
      else
        li.style.backgroundColor = tinycolor(this.backgroundColor).darken(10).toString();
    };
    li.onmouseout = () => {
      li.dataset.hover = false;
      setTimeout(() => {
        let hover = li.dataset.hover.toLowerCase() == 'true';
        if (hover) { return; }
        for (const child of li.children) {
          if (child.classList.contains('icon')) { continue; }
          child.style.display = 'none';
          child.style.left = '100%';
        }
      }, 150);
      li.style.backgroundColor = this.backgroundColor;
    };
    return li;
  }
  static disableContextMenu = function() {
    document.addEventListener('contextmenu', e => {
      e.preventDefault();
    });
  }
}

//globals styles
const globalContainerStyling = (backgroundColor, color) => {
  return `
    background-color: ${backgroundColor};
    color: ${color};
    position: absolute;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 5px;
    top: 0;
    left: 0;
    border-radius: 10px;
`};
const globalListItemStyling = (color) => {
  return `
    border: 1px solid ${color};
    padding: 5px;
    font-size: 1.15rem;
    user-select: none;
    position: relative;
    display: flex;
    flex-direction: row;
`};

//option class
class Option {
  constructor(name, callback = (opt) => { console.log( this.name + ' was clicked.'); }, options = [], parent=document.body) {
    this.name = name;
    this.parent = parent;
    this.callbackWrapper = (opt) => { console.log('This is a sub function called after the main callback. ') };
    this.callback = () => {callback(this); this.callbackWrapper(this)};
    this.options = options;
    this.icon = ContextMenuIcons.copy;
  }
}

const ContextMenuIcons = {
  copy: '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>',
}