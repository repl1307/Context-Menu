# Context-Menu
Custom Context Menu that serves as a replacement to the default browser one.

Example Usage:
```javascript
const options = [
    new Option(),
];

const contextMenu = new ContextMenu();
```

Creating a menu that modifies html:
```javascript
const debug = new Console();

let copyData = null;

const PasteHTMLOption = function(){
  let instance = new Option("Paste HTML", (opt) => { 
    if(copyData){
      log(opt.menu.target)
      opt.menu.target.appendChild(copyData);
      copyData = copyData.cloneNode(true);
    }
  });
  return instance;
};
//
const divOptions = [
  new Option("Log", () => {}, [
    new Option("Text", (opt) => {
      log(opt.menu.target.textContent);
    }),
    new Option("Element", (opt) => {
      log(opt.menu.target);
    }),
    new Option("Style", () => {
      log(getComputedStyle(opt.menu.target));
    }),
  ]),
  new Option("Cut HTML", (opt) => {
    copyData = opt.menu.target.cloneNode(true);
    copyData.id = '';
    opt.menu.target.remove();
  }),
  new Option("Copy HTML", (opt) => {
    copyData = opt.menu.target.cloneNode(true);
    copyData.id = ''
    copyData.style = getComputedStyle(opt.menu.target)
  }),
  new Option("Delete HTML", (opt) => { 
    opt.menu.target.remove();  
  }),
  new PasteHTMLOption,
];


const divContextMenu = new ContextMenu(
  divOptions, document.querySelector('.wrapper'), 'rgb(90, 90, 90)','white','darken');
const globalOptions = [
  new Option("Alert", (opt) => { alert(opt.menu.target.nodeName)}),
  new Option("Test"),
  new PasteHTMLOption
];
const globalContextMenu = new ContextMenu(
  globalOptions,
  document.body,
  'rgb(180, 70, 70)', 'white', 'darken'
);

ContextMenu.disableContextMenu();

```