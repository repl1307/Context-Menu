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
    for (let i = 0; i < 7; i++) { this.id += chars[Math.floor(Math.random() * (chars.length - 1))]; }
    if (!parent.dataset.menu) { parent.dataset.menu = this.id; }
    this.color = color;
    this.parent = parent; //element menu is attached to
    this.hover = hover;
    this.contextMenu = this.createContextMenu(options, customStyles);
    //a unique data attribute for context menus in order to prevent opening menus on top of menus
    this.contextMenu.dataset.isContextMenu = true;
    this.contextMenu.style.display = 'none';
    this.target = null; // last clicked element within parent
    //hide option menu on click
    document.addEventListener('mousedown', e => {
      if (!this.contextMenu.contains(e.target)) {
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

      //prevent menu from opening on top of other menu
      if (e.target.dataset.isContextMenu) {
        this.contextMenu.style.display = 'none';
        return;
      }

      // get parent context menu if element's context menu is undefined
      if (parent != document.documentElement && parent != document.body) {
        while (!parent.dataset.menu) {
          parent = parent.parentNode;
        }
        e.target.dataset.menu = parent.dataset.menu;
      }
      //update target and visibility if id matches element id
      if (e.target.dataset.menu == this.id) {
        this.contextMenu.style.display = 'flex';
        this.target = e.target;
      }
      //keeping menu in viewport
      let width = 200;
      width = 500;
      let tWidth = 0;
      const getWidth = elem => {
        let count = 0;
        for(const child of elem.children){
          const eStyle = getComputedStyle(elem);
          const style = getComputedStyle(child);
          const spacings = [
            parseInt(eStyle.paddingLeft.replace('px', '')),
            parseInt(eStyle.paddingRight.replace('px', '')),
            parseInt(eStyle.marginLeft.replace('px', '')),
            parseInt(eStyle.marginRight.replace('px','')),
            parseInt(style.paddingLeft.replace('px', '')),
            parseInt(style.paddingRight.replace('px', '')),
            parseInt(style.marginLeft.replace('px', '')),
            parseInt(style.marginRight.replace('px','')),
          ];
          if(count == 0){
            tWidth += 150;
            for(const s of spacings){
              tWidth += s;
            }
          }
          if(child.children.length > 0){
            getWidth(child);
          }
          count++;
        }
        //tWidth /= elem.children.length;
      };
      getWidth(this.contextMenu);
      console.log('Total Width: '+ tWidth);

      if (parseInt(e.clientX) + width >= window.innerWidth) {
        this.contextMenu.style.left = (e.clientX - 200 - offset) + 'px'
        this.contextMenu.dataset.align = 'left';
      }
      else {
        this.contextMenu.style.left = (e.clientX) + 'px';
        this.contextMenu.dataset.align = 'right';
      }
      const height = parseInt(getComputedStyle(this.contextMenu).height.replace('px', ''));
      if (parseInt(e.clientY) + height >= window.innerHeight)
        this.contextMenu.style.top = (e.clientY - height - offset) + 'px';
      else
        this.contextMenu.style.top = (e.clientY) + 'px';
    });

  }
  //create actual context menu
  createContextMenu = function(options = [], customStyles = null) {
    const container = document.createElement('ul');
    container.style = globalContainerStyling(this.backgroundColor, this.color) + ' width: 200px;';
    // recursive function that allows as many options within options as desired
    const createOption = (option, parent, container) => {
      option.menu = this;
      option.parent = this.parent;
      option.callbackWrapper = (opt) => { this.contextMenu.style.display = 'none' };
      const optElem = this.createListItem();

      optElem.dataset.isContextMenu = true;
      const svg = option.icon;
      optElem.appendChild(option.icon);
      optElem.innerHTML += option.name;
      optElem.onclick = option.callback;

      if (option.options.length > 0) {
        const innerContainer = document.createElement('ul');
        innerContainer.style = globalContainerStyling(this.backgroundColor, this.color) + ' display: none; min-width:150px; max-width: 150px; margin-left: 5px; left: 100%;';
        optElem.onclick = null;
        for (const child of option.options) {
          createOption(child, optElem, innerContainer);
        }
        const borderRadius = innerContainer.style.borderRadius;
        const style = innerContainer.style;
        console.log(borderRadius);
        innerContainer.children[0].style.borderTopLeftRadius = style.borderTopLeftRadius;
        innerContainer.children[0].style.borderTopRightRadius = style.borderTopRightRadius;
        innerContainer.lastChild.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
        innerContainer.lastChild.style.borderBottomRightRadius = style.borderBottomRightRadius;
        optElem.appendChild(innerContainer);
      }
      container.appendChild(optElem);
    };
    //loop through base options
    for (const option of options) {
      createOption(option, this.contextMenu, container);
    }
    const style = container.style;
    container.children[0].style.borderTopLeftRadius = style.borderTopLeftRadius;
    container.children[0].style.borderTopRightRadius = style.borderTopRightRadius;
    container.lastChild.style.borderBottomLeftRadius = style.borderBottomLeftRadius;
    container.lastChild.style.borderBottomRightRadius = style.borderBottomRightRadius;
    
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
      let parent = li.parentNode;
      while(parent.parentNode.dataset.isContextMenu){
        parent = parent.parentNode;
      }
      for (const child of li.children) {
        if(child.nodeName == 'svg'){ continue; }
        child.style.display = 'block';
        const rect = child.getBoundingClientRect();

        parent.style.border = '1px solid red';
        child.dataset.align = 'right';
        //TODO: replace window width check with parent width check
        if (rect.x + rect.width > window.innerWidth) {
        //   child.style.left = '-' + (rect.width + 10) + 'px';
        //   console.log(child)
        //   child.style.border = '3px solid pink'
          child.dataset.align = 'left';
        }
        console.log(child.dataset.align);
        if(parent.dataset.align == 'left')
          child.style.left = '-' + (rect.width + 10) + 'px';
      }

      if (this.hover == 'lighten')
        li.style.backgroundColor = tinycolor(this.backgroundColor).lighten(10).toString();
      else
        li.style.backgroundColor = tinycolor(this.backgroundColor).darken(10).toString();
    
      
    };
    
    //disappear on mouseout
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
  //disable default context menu on entire webpage
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
  constructor(name, callback = (opt) => { console.log(this.name + ' was clicked.'); }, options = [], parent = document.body) {
    this.name = name;
    this.parent = parent;
    this.callbackWrapper = (opt) => { console.log('This is a customizable function called after the main callback. ') };
    this.callback = () => { callback(this); this.callbackWrapper(this) };
    for (const option of options) {
      option.menu = this.menu;
      const func = option.callback;
      option.callback = () => {
        func(option);
      }
    };
    this.options = options;
    this.icon = ContextMenuIcons.copy();
  }
}

const ContextMenuIcons = {
  copy: () => {
    const svg = document.createElement('svg');
    svg.dataset.isContextMenu = true;
    svg.classList.add('icon');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 448 512');
    const path = document.createElement('path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z');
    path.dataset.isContextMenu = true;
    svg.appendChild(path);
    return svg;
    /*'<svg class="icon" data-iscontextmenu="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="currentColor" d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>*/
  },
};
