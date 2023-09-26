const debug = new Console();
const pOptions = [
  new Option("Select", () => {log("Selected")}, [
    new Option("Text", () => {log("selected text")}),
    new Option("Image", () => {log("selected image")}),
    new Option("Media", () => {log("selected media")}),
  ]),
  new Option("Cut HTML"),
  new Option("Copy HTML", (opt) => {opt.menu.copyData = opt.menu.target.cloneNode(true)}),
  new Option("Delete HTML", (opt) => { opt.parent.remove();  }),
  new Option("Paste HTML", (opt) => { 
    if(opt.menu.copyData){
      opt.menu.copyData.id = ''
      opt.menu.target.appendChild(opt.menu.copyData)
      opt.menu.copyData = opt.menu.copyData.cloneNode(true);
    }
  }),
];

const globalOptions = [
  new Option("Alert", (opt) => { alert(opt.menu.target.nodeName)}),
  new Option("Test"),
];
const globalContextMenu = new ContextMenu(
  globalOptions,
  document.body,
  'rgb(180, 70, 70)', 'white', 'darken'
);
const pContextMenu = new ContextMenu(
  pOptions, document.querySelector('.wrapper'), 'rgb(90, 90, 90)','white','darken');


pContextMenu.copyData = null;
ContextMenu.disableContextMenu();
