'use strict';


var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0};

var SPECIAL_SPACES = [
    0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
    0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
];

function isSpace(ch) {
    return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || // Line terminators
        // White spaces
        (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
        (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
}

function isCommand(code) {
    /*eslint-disable no-bitwise*/
    switch (code | 0x20) {
        case 0x6D/* m */
        :
        case 0x7A/* z */
        :
        case 0x6C/* l */
        :
        case 0x68/* h */
        :
        case 0x76/* v */
        :
        case 0x63/* c */
        :
        case 0x73/* s */
        :
        case 0x71/* q */
        :
        case 0x74/* t */
        :
        case 0x61/* a */
        :
        case 0x72/* r */
        :
            return true;
    }
    return false;
}

function isDigit(code) {
    return (code >= 48 && code <= 57);   // 0..9
}

function isDigitStart(code) {
    return (code >= 48 && code <= 57) || /* 0..9 */
        code === 0x2B || /* + */
        code === 0x2D || /* - */
        code === 0x2E;
    /* . */
}


function State(path) {
    this.index = 0;
    this.path = path;
    this.max = path.length;
    this.result = [];
    this.param = 0.0;
    this.err = '';
    this.segmentStart = 0;
    this.data = [];
}

function skipSpaces(state) {
    while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
        state.index++;
    }
}


function scanParam(state) {
    var start = state.index,
        index = start,
        max = state.max,
        zeroFirst = false,
        hasCeiling = false,
        hasDecimal = false,
        hasDot = false,
        ch;

    if (index >= max) {
        state.err = 'SvgPath: missed param (at pos ' + index + ')';
        return;
    }
    ch = state.path.charCodeAt(index);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        index++;
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
    }

    // This logic is shamelessly borrowed from Esprima
    // https://github.com/ariya/esprimas
    //
    if (!isDigit(ch) && ch !== 0x2E/* . */) {
        state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
        return;
    }

    if (ch !== 0x2E/* . */) {
        zeroFirst = (ch === 0x30/* 0 */);
        index++;

        ch = (index < max) ? state.path.charCodeAt(index) : 0;

        if (zeroFirst && index < max) {
            // decimal number starts with '0' such as '09' is illegal.
            if (ch && isDigit(ch)) {
                state.err = 'SvgPath: numbers started with `0` such as `09` are ilegal (at pos ' + start + ')';
                return;
            }
        }

        while (index < max && isDigit(state.path.charCodeAt(index))) {
            index++;
            hasCeiling = true;
        }
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
    }

    if (ch === 0x2E/* . */) {
        hasDot = true;
        index++;
        while (isDigit(state.path.charCodeAt(index))) {
            index++;
            hasDecimal = true;
        }
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
    }

    if (ch === 0x65/* e */ || ch === 0x45/* E */) {
        if (hasDot && !hasCeiling && !hasDecimal) {
            state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
            return;
        }

        index++;

        ch = (index < max) ? state.path.charCodeAt(index) : 0;
        if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
            index++;
        }
        if (index < max && isDigit(state.path.charCodeAt(index))) {
            while (index < max && isDigit(state.path.charCodeAt(index))) {
                index++;
            }
        } else {
            state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
            return;
        }
    }

    state.index = index;
    state.param = parseFloat(state.path.slice(start, index)) + 0.0;
}


function finalizeSegment(state) {
    var cmd, cmdLC;

    // Process duplicated commands (without comand name)

    // This logic is shamelessly borrowed from Raphael
    // https://github.com/DmitryBaranovskiy/raphael/
    //
    cmd = state.path[state.segmentStart];
    cmdLC = cmd.toLowerCase();

    var params = state.data;

    if (cmdLC === 'm' && params.length > 2) {
        state.result.push([cmd, params[0], params[1]]);
        params = params.slice(2);
        cmdLC = 'l';
        cmd = (cmd === 'm') ? 'l' : 'L';
    }

    if (cmdLC === 'r') {
        state.result.push([cmd].concat(params));
    } else {

        while (params.length >= paramCounts[cmdLC]) {
            state.result.push([cmd].concat(params.splice(0, paramCounts[cmdLC])));
            if (!paramCounts[cmdLC]) {
                break;
            }
        }
    }
}


function scanSegment(state) {
    var max = state.max,
        cmdCode, comma_found, need_params, i;

    state.segmentStart = state.index;
    cmdCode = state.path.charCodeAt(state.index);

    if (!isCommand(cmdCode)) {
        state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
        return;
    }

    need_params = paramCounts[state.path[state.index].toLowerCase()];

    state.index++;
    skipSpaces(state);

    state.data = [];

    if (!need_params) {
        // Z
        finalizeSegment(state);
        return;
    }

    comma_found = false;

    for (; ;) {
        for (i = need_params; i > 0; i--) {
            scanParam(state);
            if (state.err.length) {
                return;
            }
            state.data.push(state.param);

            skipSpaces(state);
            comma_found = false;

            if (state.index < max && state.path.charCodeAt(state.index) === 0x2C/* , */) {
                state.index++;
                skipSpaces(state);
                comma_found = true;
            }
        }

        // after ',' param is mandatory
        if (comma_found) {
            continue;
        }

        if (state.index >= state.max) {
            break;
        }

        // Stop on next segment
        if (!isDigitStart(state.path.charCodeAt(state.index))) {
            break;
        }
    }

    finalizeSegment(state);
}


/* Returns array of segments:
 *
 * [
 *   [ command, coord1, coord2, ... ]
 * ]
 */
window.pathParse = function pathParse(svgPath) {
    var state = new State(svgPath);
    var max = state.max;

    skipSpaces(state);

    while (state.index < max && !state.err.length) {
        scanSegment(state);
    }

    if (state.err.length) {
        state.result = [];

    } else if (state.result.length) {

        if ('mM'.indexOf(state.result[0][0]) < 0) {
            state.err = 'SvgPath: string should start with `M` or `m`';
            state.result = [];
        } else {
            state.result[0][0] = 'M';
        }
    }

    return {
        err: state.err,
        segments: state.result
    };
};

window.scaleSvgPath = function (segments, sx, sy) {
    sy = (!sy && (sy !== 0)) ? sx : sy

    return segments.map(function (segment) {
        var name = segment[0].toLowerCase()

        // V & v are the only command, with shifted coords parity
        if (name === 'v') {
            segment[1] *= sy
            return segment
        }

        // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        // touch rx, ry, x, y only
        if (name === 'a') {
            segment[1] *= sx
            segment[2] *= sy
            segment[6] *= sx
            segment[7] *= sy
            return segment
        }

        // All other commands have [cmd, x1, y1, x2, y2, x3, y3, ...] format
        return segment.map(function (val, i) {
            if (!i) {
                return val
            }
            return val *= i % 2 ? sx : sy
        })
    })
}

window.pathToString = function (segments) {
    var elements = [], skipCmd, cmd;

    for (var i = 0; i < segments.length; i++) {
        // remove repeating commands names
        cmd = segments[i][0];
        skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === segments[i - 1][0];
        elements = elements.concat(skipCmd ? segments[i].slice(1) : segments[i]);
    }

    return elements.join(' ')
    // Optimizations: remove spaces around commands & before `-`
    //
    // We could also remove leading zeros for `0.5`-like values,
    // but their count is too small to spend time for.
        .replace(/ ?([achlmqrstvz]) ?/gi, '$1')
        .replace(/ \-/g, '-')
        // workaround for FontForge SVG importing bug
        .replace(/zm/g, 'z m');
};