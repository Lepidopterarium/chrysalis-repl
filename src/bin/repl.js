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
import CPPTransformer from "chrysalis-keymap-transformer-cpp"
import repl from "repl"

console.log(`
+-----------------------------------------------+
| Welcome to the Chrysalis REPL!                |
|                                               |
| The following commands are available:         |
|  - command(<command>, [<arguments...>])       |
|  - io.<command>([<arguments>])                |
|  - exit()                                     |
|                                               |
| For example:                                  |
|  > io.help()                                  |
+-----------------------------------------------+
`)

let replServer = repl.start({
    prompt: "chrysalis> "
})

let port = new SerialPort("/dev/ttyACM0"),
    focus = new Focus(port),
    keymap = new Keymap(64),
    command = (cmd, args = []) => {
        focus.command(cmd, args).then((data) => {
            console.log(data)
        })
    },
    io = new Proxy({}, {
        get: (target, name) => {
            return (args) => {
                return command(name, args)
            }
        }
    })

keymap.addKeyTransformers([new CPPTransformer()])
focus.addCommands({keymap: keymap})

replServer.context.command = command
replServer.context.exit = process.exit
replServer.context.io = io
