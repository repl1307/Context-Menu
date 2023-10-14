const debug = new Console();

let copyData = null;

const PasteHTMLOption = function(){
  const instance = new Option("Paste HTML", (opt) => { 
    if(copyData){
      log(opt.menu.target)
      copyData.dataset.menu = opt.menu.target.dataset.menu;
      opt.menu.target.appendChild(copyData);
      copyData = copyData.cloneNode(true);
    }
  });
  return instance;
};
//wrapper options
const wrapperOptions = [
  //log option
  new Option("Log", () => {}, [
    //log suboptions
    new Option("Text", (opt) => {
      log(opt.menu.target.textContent);
    }, 
    //log text suboptions
      [
        new Option("subtest", ()=> { log('subtext called') }),
        new Option("subsubtest", ()=> { log('subsubtext called') }),
      ]),
    //element option
    new Option("Element", (opt) => {
      log(opt.menu.target);
    }, //element suboptions
    [
      //new Option("subtest", ()=> { log('subtext called') }, [new Option("subtest", ()=> { log('subtext called') })]),
    ]),
    new Option("Style", (opt) => {
      const style = getComputedStyle(opt.menu.target);
      log(style);
      console.log(opt);
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
wrapperOptions[0].icon = ContextMenuIcons.cut();
//global context menu options
const globalOptions = [
  new Option("Alert", (opt) => { alert(opt.menu.target.nodeName)}),
  new Option("Test"),
  new PasteHTMLOption
];
//actual context menus
const globalContextMenu = new ContextMenu(
  globalOptions,
  document.body, 'darken'
);
const wrapperContextMenu = new ContextMenu(
  wrapperOptions, document.querySelector('.wrapper'), 'lighten',
  `  
    background-color: rgb(28, 31, 29);
    color: white;
    border: none;
    padding: 0;
    border-radius: 5px;
  `, 
  `
  border: none;
  padding: 5px;
  font-size: 0.8rem;
  border-radius: 5px;
  `
);



ContextMenu.disableContextMenu();
