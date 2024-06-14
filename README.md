# Graph Manager Docs

## Keybinds

The keybindings are defined in the `canvas/utils/kbd_shortcuts.js` file. To add a new keybinding add the corresponding lines of code on the `handleShortcuts` function on the same file.

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

### Assign a callback event to a tool

- Add a new key in the tools callbacks file in the `graph-manager/utils/tools/{your-tool}.js` file. The key should be uno of the callbacks supported that can be seen in the `canvas/utils/globals.js` file. The value should be the callback function.

### Assign a keybinding to a tool

The app has some predefined keybindings that will be evaluated before the custom keybindings defined for a tool. The default keybindings are located in the file `canvas/utils/kbd_shortcuts.js`. To add a new keybinding for a tool, add it inside the callback function `keyDownCallback` in the `graph-manager/utils/tools/{your-tool}.js` file