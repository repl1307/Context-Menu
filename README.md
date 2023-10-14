# Context-Menu
Custom Context Menu that serves as a replacement to the default browser one.
## Documentation
### Option()
```javascript 
new Option(name, callback, suboptions)
```
Creates a new ```Option``` instance. Append to a ```ContextMenu``` object  to actually use it.   

**```name```**  
&nbsp;&nbsp;&nbsp;This is the text that will be displayed when the option is added to a context menu  

**```callback```**  
&nbsp;&nbsp;&nbsp;This is the function that is triggered when the option is clicked on. The callback function is provided a parameter that represents the option    
&nbsp;&nbsp;&nbsp;instance. The option instance's parent context menu is stored as ```parameter.menu```.   

**```suboptions```**  
&nbsp;&nbsp;&nbsp;This is a 1D array of suboptions, made from the Option class. There can be at most 2 layers of suboptions.  
### ContextMenu()
```javascript
new ContextMenu(options, parent, hover, customStyle);
```
Creates a new ```ContextMenu``` instance.  
**```options```**  
&nbsp;&nbsp;&nbsp;A 1D array of the options that the ContextMenu will display. These options should be created using the ```Option``` class.  

**```parent```**  
&nbsp;&nbsp;&nbsp;The parent element the context menu is attached to. By default it is the document body.       

**```hover```**  
&nbsp;&nbsp;&nbsp; The visual effect to trigger when the menu is hovered on. The two options are ```"lighten"``` and ```"darken"```. 

**```customStyle```**  
&nbsp;&nbsp;&nbsp; A string containing any custom styling the context menu should have.

## Examples
Basic Usage:
```javascript
const options = [
    new Option("Hello World", (opt) => {}, ),
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
