#! /usr/bin/env node
/* chrysalis-repl -- Chrysalis REPL
 * Copyright (C) 2018  Gergely Nagy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import SerialPort from "serialport"
import Focus from "chrysalis-focus"
import Keymap from "chrysalis-keymap"

console.log(`
+-----------------------------------------------+
| Welcome to the Chrysalis REPL!                |
|                                               |
| The following commands are available:         |
|  - command(<command>, [<arguments...>])       |
|  - exit()                                     |
+-----------------------------------------------+
`)

let port = new SerialPort("/dev/ttyACM0") ,
    focus = new Focus(port),
    keymap = new Keymap(64),
    command = (cmd, args = []) => {
        focus.command(cmd, args).then((data) => {
            console.log(data)
        })
    },
    exit = process.exit

focus.addCommands({keymap: keymap})
