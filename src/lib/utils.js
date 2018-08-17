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

function pad(str, len) {
    str = String(str);
    var i = -1;
    if (!len || len <= 0)
        len = 15
    len = len - str.length;
    while (++i < len) {
        str = str + " ";
    }
    return str;
}

function format_layer(idx, layer) {
    let src = "  [" + idx.toString() + "] = KEYMAP_STACKED\n" +
        "  (  ",
        k = (r, c, noPad) => {
            let pos = r * 16 + c
            if (!noPad)
                return pad(layer[pos])
            else
                return layer[pos]
        }

    src +=
        /* left side */
        k(0, 0) + "," +
        k(0, 1) + "," +
        k(0, 2) + "," +
        k(0, 3) + "," +
        k(0, 4) + "," +
        k(0, 5) + "," +
        k(0, 6, true) + "\n" +
        "    ," +
        k(1, 0) + "," +
        k(1, 1) + "," +
        k(1, 2) + "," +
        k(1, 3) + "," +
        k(1, 4) + "," +
        k(1, 5) + "," +
        k(1, 6, true) + "\n" +
        "    ," +
        k(2, 0) + "," +
        k(2, 1) + "," +
        k(2, 2) + "," +
        k(2, 3) + "," +
        k(2, 4) + "," +
        k(2, 5, true) + "\n" +
        "    ," +
        k(3, 0) + "," +
        k(3, 1) + "," +
        k(3, 2) + "," +
        k(3, 3) + "," +
        k(3, 4) + "," +
        k(3, 5) + "," +
        k(2, 6, true) + "\n" +
        "    ," +
        k(0, 7) + "," +
        k(1, 7) + "," +
        k(2, 7) + "," +
        k(3, 7, true) + "\n" +
        "    ," +
        k(3, 6, true) + "\n" +
        "\n" +
        "    ," +
        k(0, 9) + "," +
        k(0, 10) + "," +
        k(0, 11) + "," +
        k(0, 12) + "," +
        k(0, 13) + "," +
        k(0, 14) + "," +
        k(0, 15, true) + "\n" +
        "    ," +
        k(1, 9) + "," +
        k(1, 10) + "," +
        k(1, 11) + "," +
        k(1, 12) + "," +
        k(1, 13) + "," +
        k(1, 14) + "," +
        k(1, 15, true) + "\n" +
        "                    ," +
        k(2, 10) + "," +
        k(2, 11) + "," +
        k(2, 12) + "," +
        k(2, 13) + "," +
        k(2, 14) + "," +
        k(2, 15, true) + "\n" +
        "    ," +
        k(2, 9) + "," +
        k(3, 10) + "," +
        k(3, 11) + "," +
        k(3, 12) + "," +
        k(3, 13) + "," +
        k(3, 14) + "," +
        k(3, 15, true) + "\n" +
        "    ," +
        k(3, 8) + "," +
        k(2, 8) + "," +
        k(1, 8) + "," +
        k(0, 8, true) + "\n" +
        "    ," +
        k(3, 9, true)

    src += "\n  ),\n"
    return src
}

export function keymap_format(map) {
    let cpp =
        "// You can edit this as if it was in your sketch.\n" +
        "// You can even copy it there!\n" +
        "KEYMAPS(\n",
        idx = 0

    for (let layer of map) {
        cpp += format_layer(idx, layer)
        idx++
    }
    cpp += ");\n"

    return cpp
}
