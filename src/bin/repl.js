#! /usr/bin/env node
/* chrysalis-repl -- Chrysalis REPL
 * Copyright (C) 2018  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import Focus from "chrysalis-focus"
import Keymap from "chrysalis-keymap"
import CPPTransformer from "chrysalis-keymap-transformer-cpp"

import { Model01 } from "chrysalis-hardware-keyboardio-model01"

import { keymap_format } from "../lib/utils.js"

import child_process from "child_process"
import fs from "fs"
import repl from "repl"
import util from "util"
import tmp from "tmp"

console.log(`
+-----------------------------------------------+
| Welcome to the Chrysalis REPL!                |
|                                               |
| The following commands are available:         |
|  - find([<devices...>])                       |
|  - open(<device>)                             |
|  - command(<command>, [<arguments...>])       |
|  - io.<command>([<arguments>])                |
|  - edit_keymap()                              |
|  - exit()                                     |
|                                               |
| Supported devices:                            |
|  - Model01                                    |
|                                               |
| For example:                                  |
|  > io.help()                                  |
+-----------------------------------------------+
`)

let replServer = repl.start({
    prompt: "chrysalis> "
})

let focus = new Focus(),
    keymap = new Keymap(),
    command = async (cmd, args = []) => {
        let data = await focus.command(cmd, args)
        process.stdout.write("\r          \r")
        process.stdout.write(util.format(data))
        process.stdout.write("\n\nchrysalis> ")
    },
    io = new Proxy({}, {
        get: (target, name) => {
            return (args) => {
                return command(name, args)
            }
        }
    }),
    open = (device) => {
        focus.open(device)
        keymap.setLayerSize(device)
    },
    find = async (...devices) => {
        if (devices.length == 0)
            devices = Model01

        let data = await focus.find(devices)
        process.stdout.write("\r          \r")
        process.stdout.write(util.format(data))
        process.stdout.write("\n\nchrysalis> ")
    },
    edit_keymap = async () => {
        let editor = process.env.EDITOR || "vim",
            tmpfile = tmp.fileSync({
                prefix: "chrysalis-keymap-",
                postfix: ".cpp"
            })

        let keymap = await focus.command("keymap")
        fs.writeSync(tmpfile.fd, keymap_format(keymap))

        child_process.spawnSync(editor, [tmpfile.name], {
            stdio: "inherit"
        })

        process.stdout.write("\r          \r")
        process.stdout.write("<updating not implemented yet>")
        process.stdout.write("\n\nchrysalis> ")
    }

keymap.addKeyTransformers([new CPPTransformer()])
focus.addCommands({keymap: keymap})

replServer.context.Model01 = Model01
replServer.context.open = open
replServer.context.command = command
replServer.context.exit = process.exit
replServer.context.io = io
replServer.context.edit_keymap = edit_keymap
replServer.context.find = find
