import { BrowserWindow } from "electron";

const lastState: Record<number, boolean> = {};

export function startControllerNavigation(win: BrowserWindow) {

  setInterval(async () => {

    const input = await win.webContents.executeJavaScript(`
      (() => {
        const gp = navigator.getGamepads()[0];

        if (!gp) return null;

        return gp.buttons.map(b => b.pressed);
      })();
    `);

    if (!input) return;

    function press(button: number, key: string) {

      const pressed = input[button];

      if (pressed && !lastState[button]) {

        win.webContents.sendInputEvent({
          type: 'keyDown',
          keyCode: key
        });

        win.webContents.sendInputEvent({
          type: 'keyUp',
          keyCode: key
        });
      }

      lastState[button] = pressed;
    }

    // Xbox buttons
    press(0, 'Enter');   // A
    press(1, 'Escape'); // B

    press(12, 'Up');
    press(13, 'Down');
    press(14, 'Left');
    press(15, 'Right');

  }, 16);
}