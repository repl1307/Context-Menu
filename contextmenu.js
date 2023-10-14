//add icon styling
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
  .context-menu--icon {
    width: 1em;
    height: auto;
    margin: 0px 5px;
  }`;
  document.head.appendChild(style);
})();

//context menu class
class ContextMenu {
  constructor(options, parent = document.body, hover = 'lighten', customStyles = null, customListItemStyles = null) {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMONPQRSTUVWXYZ';
    //setting id
    this.id = '';
    for (let i = 0; i < 7; i++) { this.id += chars[Math.floor(Math.random() * (chars.length - 1))]; }
    if (!parent.dataset.menu) { parent.dataset.menu = this.id; }
    //custom styling 
    this.customStyles = customStyles;
    this.customListItemStyles = customListItemStyles;
    this.parent = parent; //element menu is attached to
    this.hover = hover;
    this.contextMenu = this.createContextMenu(options, customStyles, customListItemStyles);
    //a unique data attribute for context menus in order to prevent opening menus on top of menus
    this.contextMenu.dataset.isContextMenu = true;
    this.contextMenu.style.display = 'none';
    this.parent.style.webkitUserSelect = 'none';
    this.parent.style.userSelect = 'none';
    this.parent.style.mozUserSelect = 'none';
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
      const offset = 2;
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
        this.contextMenu.style.left = (e.clientX+offset) + 'px';
        this.contextMenu.dataset.align = 'right';
      }
      const height = parseInt(getComputedStyle(this.contextMenu).height.replace('px', ''));
      if (parseInt(e.clientY) + height >= window.innerHeight)
        this.contextMenu.style.top = (e.clientY - height - offset) + 'px';
      else
        this.contextMenu.style.top = (e.clientY+offset) + 'px';
    });
  }
  //create actual context menu
  createContextMenu = function(options = [], customStyles = null, customListItemStyles = null) {
    const container = document.createElement('ul');
    if(customStyles == null)
      container.style = globalContainerStyling() + ' width: 200px;';
    else
      container.style = mandatoryContainerStyling + customStyles +'width: 200px';
    
    // recursive function that allows as many options within options as desired
    const createOption = (option, parent, container) => {
      option.menu = this;
      option.parent = this.parent;
      option.callbackWrapper = (opt) => { this.contextMenu.style.display = 'none' };
      const optElem = this.createListItem('', customListItemStyles);
      option.elem = optElem;
      optElem.dataset.isContextMenu = true;
      //add icon if one exists
      if(option.icon != null){
        const svg = option.icon;
        optElem.appendChild(option.icon);
      }
      optElem.innerHTML += option.name;
      optElem.onclick = option.callback;

      if (option.options.length > 0) {
        const innerContainer = document.createElement('ul');
        if(customStyles == null)
          innerContainer.style = globalContainerStyling() + ' display: none; min-width:150px; max-width: 150px; left: 100%;';
        else
          innerContainer.style = mandatoryContainerStyling + customStyles + ' display: none; min-width:150px; max-width: 150px; left: 100%;';
        
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
  createListItem = function(message = '', customStyles = null) {
    const li = document.createElement('li');
    if(customStyles == null)
      li.style = globalListItemStyling();
    else
      li.style = mandatoryListItemStyling + customStyles;
      
    li.textContent = message;
    li.onmouseover = () => {
      li.dataset.hover = true;
      let parent = li.parentNode;
      while(parent.parentNode.dataset.isContextMenu){
        parent = parent.parentNode;
      }

      //looping through suboptions and displaying
      for (const child of li.children) {
        if(child.nodeName == 'svg'){ continue; }
        child.style.display = 'flex';
        const rect = child.getBoundingClientRect();
        child.dataset.align = 'right';
        //TODO: replace window width check with parent width check
        if (rect.x + rect.width > window.innerWidth) {
          child.dataset.align = 'left';
        }
        else if(rect.x <= 0){
          child.dataset.align = 'right'
        }
        const pRect = parent.getBoundingClientRect();
        const paddingRight = parseFloat(getComputedStyle(parent).paddingRight.replace('px', ''));
        const paddingLeft = parseFloat(getComputedStyle(parent).paddingLeft.replace('px', ''));
        if(parent.dataset.align == 'left')
          child.style.left = '-' + (rect.width + paddingRight) + 'px';
        else
          child.style.left = (child.parentNode.clientWidth + paddingLeft) + 'px';
      }

      if (this.hover == 'lighten')
        li.style.backgroundColor = tinycolor(getComputedStyle(this.contextMenu).backgroundColor).lighten(10).toString();
      else
        li.style.backgroundColor = tinycolor(getComputedStyle(this.contextMenu).backgroundColor).darken(10).toString();
    
      
    };
    
    //disappear on mouseout
    li.onmouseout = () => {
      li.dataset.hover = false;
      setTimeout(() => {
        let hover = li.dataset.hover.toLowerCase() == 'true';
        if (hover) { return; }
        for (const child of li.children) {
          if (child.classList.contains('context-menu--icon')) { continue; }
          child.style.display = 'none';
          child.dataset.align = 'right';
          child.style.left = '100%';
        }
      }, 150);
      li.style.backgroundColor = getComputedStyle(this.contextMenu).backgroundColor;
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
const globalContainerStyling = () => {
  return `
    background-color: rgb(90, 90, 90);
    color: white;
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
const mandatoryContainerStyling = `
    position: absolute;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
`;
const mandatoryListItemStyling = `
    user-select: none;
    position: relative;
    display: block;
    flex-direction: row;
`;
const globalListItemStyling = () => {
  return `
    border: 1px solid white;
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
    this.icon = null;
  }
}

const ContextMenuIcons = {
  copy: () => {
    const svg = document.createElement('svg');
    svg.dataset.isContextMenu = true;
    svg.classList.add('context-menu--icon');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 448 512');
    const path = document.createElement('path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z');
    path.dataset.isContextMenu = true;
    svg.appendChild(path);
    return svg;
  },
  paste: () => {
    const svg = document.createElement('svg');
    svg.dataset.isContextMenu = true;
    svg.classList.add('context-menu--icon');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 512 512');
    const path = document.createElement('path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M80 96v16c0 17.7 14.3 32 32 32h60.8c16.6-28.7 47.6-48 83.2-48h62c-7.1-27.6-32.2-48-62-48H215.4C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48H64C28.7 48 0 76.7 0 112V384c0 35.3 28.7 64 64 64h96V400H64c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H80zm64-40a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM256 464c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H384v48c0 17.7 14.3 32 32 32h48V448c0 8.8-7.2 16-16 16H256zm192 48c35.3 0 64-28.7 64-64V227.9c0-12.7-5.1-24.9-14.1-33.9l-51.9-51.9c-9-9-21.2-14.1-33.9-14.1H256c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H448z');
    path.dataset.isContextMenu = true;
    svg.appendChild(path);
    return svg;
  },
  cut: () => {
    const svg = document.createElement('svg');
    svg.dataset.isContextMenu = true;
    svg.classList.add('context-menu--icon');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 512 512');
    const path = document.createElement('path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M256 192l-39.5-39.5c4.9-12.6 7.5-26.2 7.5-40.5C224 50.1 173.9 0 112 0S0 50.1 0 112s50.1 112 112 112c14.3 0 27.9-2.7 40.5-7.5L192 256l-39.5 39.5c-12.6-4.9-26.2-7.5-40.5-7.5C50.1 288 0 338.1 0 400s50.1 112 112 112s112-50.1 112-112c0-14.3-2.7-27.9-7.5-40.5L499.2 76.8c7.1-7.1 7.1-18.5 0-25.6c-28.3-28.3-74.1-28.3-102.4 0L256 192zm22.6 150.6L396.8 460.8c28.3 28.3 74.1 28.3 102.4 0c7.1-7.1 7.1-18.5 0-25.6L342.6 278.6l-64 64zM64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48 240a48 48 0 1 1 0 96 48 48 0 1 1 0-96z');
    path.dataset.isContextMenu = true;
    svg.appendChild(path);
    return svg;
    
  },
};
