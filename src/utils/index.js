// /**
//  * @module mrjsUtils
//  * @description mrjsUtils module acts as a one stop shop for all global util functions of mrjs.
//  * Items can be grabbed by importing as `import { mrjsUtils } from 'mrjs';` and calling them through `mrjsUtils.ParentFile.functionName(...);`
//  */

// // TODO - this should auto grab instead of manually be updated as manual updates will create problems.

import { CSS } from './CSS.js';
import { Display } from './Display.js';
import { Geometry } from './Geometry.js';
import { Material } from './Material.js';
import { Model } from './Model.js';
import { MathUtils } from './MathUtils.js';
import { Math3D } from './Math3D.js';
import { Physics } from './Physics.js';
import { StringUtils } from './StringUtils.js';

const mrjsUtils = {
    CSS,
    Display,
    Geometry,
    Material,
    Model,
    MathUtils,
    Math3D,
    Physics,
    StringUtils,
};

export { mrjsUtils }; // Export as named export