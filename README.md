# Graph Manager Docs

## Keybinds

The keybindings are defined in the `canvas/utils/kbd_shortcuts.js` file. To add a new keybinding add the corresponding lines of code on the `handleShortcut` function on the same file.

## Memento

Use the keybinding `Ctrl + Z` to undo the last action and `Ctrl + Y`  or `Ctrl + Shift + Z` to redo the last action.

- Call the `recordMemento` method to record the current state of the graph.

### Add support for a feature in memento

If the new feature is stored in the `window` object
    - Add the key to the `generateSnapshot` method in the `memento.js` file.
    - Add the corresponding code to the `restoreSnapshot` method in the `memento.js` file to restore the feature to the window object.
    - Add the corresponding code to the `snapshotEquals` method in the `memento.js` file to compare the feature with the same feature from past snapshots.
  
If the new feature is stored in an `element` object
    - Add the corresponding code to the `clone` and `equals` methods in the element class file where the feature is stored.

## Tools

### Add a new tool

- Create a new file in the `utils/tools` directory for the callback functions of the tool. Export a default object containing the callback functions defined in the file. The callbacks supported can be seen in the `canvas/utils/globals.js` file.
- Add the name of the tool to the `toolsCallbacks` object in the `graph-manager/utils/tools/tools_callbacks.js` file. The key should be the name of the tool and the value should be the object exported from the file created in the first step.
- Add a new item in the `ToolBar.jsx` file in the `tools` object.

### Assign a callback event to a tool

- Add a new key in the tools callbacks file in the `graph-manager/utils/tools/{your-tool}.js` file. The key should be uno of the callbacks supported that can be seen in the `canvas/utils/globals.js` file. The value should be the callback function.

Additionally, you can use the `setup` and `clean` callbacks to execute code when the tool is activated and deactivated respectively.

### Assign a keybinding to a tool

> **Add a keybind to activate the tool**
>
> Add the keybinding to the `constants.js` file in the `graph-manager/utils` directory. The keybinding should be added to the `TOOL_KEYS` object. The key should be the key code of the key and the value should be the name of the tool defined in `graph-manager/utils/tools/tools_callbacks.js`. Example: `KeyA: 'add-node'`


> **Add a keybind while the tool is active**
> 
> The app has some predefined keybindings that will be evaluated before the custom keybindings defined for a tool. The default keybindings are located in the file `canvas/utils/kbd_shortcuts.js`. To add a new keybinding for a tool, add it inside the callback function `keyDownCallback` in the `graph-manager/utils/tools/{your-tool}.js` file

### Use a callback event defined in a tool

To use a callback event defined in a tool, call the `getActiveToolCallback` function with the name of the callback event as a parameter. The function will return the callback function of the active tool.

```js
const callback = getActiveToolCallback('mouseDownCallback');
callback();
```


## Elements

### Add a new element

- Edit the method `findElementsByCoords`, `findElementsByHover` and the rest of the function related to generic elements in the `canvas/utils/find_elements.js` file to add the new element to the list of elements that can be selected.
- Consider if memento should support the new element and its features. See the [memento section](#memento) for more information.
- Implement the abstract class `Element` and add the abstract methods defined there. The class should be located in the `canvas/elements` directory.
    - distance
    - isHover
    - clone
    - equals
    - delete

## Events

### Add a new DOM event

To add a new DOM event in order to be able to use it in the tools files `utils/tools/{your-tool}.js` take a event from the `Canvas` component that you have not used yet. and setup as it shows `window.cvs.{your-event} = getActiveToolCallback('{your-event}')` in the `GraphBoard.jsx` file.

## Listeners 

The GraphManager component provides a way to subscribe to events that happen in the graph. The listeners are just callback functions that are stored in one of the following arrays, and that will be called when the corresponding event is triggered.

The available listeners are:
- `selectedListener` - Calls the funcitons when the selection changes (element selected or deselected)
- `graphListeners` - Calls the functions when the graph changes (element added, removed, moved, colored, etc)
- `toolListeners` - Calls the functions when the tool changes
- `allListeners` - Calls the functions when any of the above events happen

### Subscribe to a listener

To subscribe to a listener, add the callback function to the corresponding array.

```js
// Example of subscribing to the selectedListener
const myCallback = (element) => console.log(element);
selectedListener.push(myCallback);
```

### Unsubscribe from a listener

To unsubscribe from a listener, remove the callback function from the corresponding array.

```js
// Example of unsubscribing from the selectedListener
selectedListener = selectedListener.filter((callback) => callback !== myCallback);
```

### Trigger a listener

To trigger a listener, call the `trigger<event>Listeners` method with the corresponding event.

```js
// Example of triggering the selectedListener
triggerSelectedListeners(element);
```