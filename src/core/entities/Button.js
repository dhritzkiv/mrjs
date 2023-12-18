import { MRDivEntity } from 'mrjs/core/MRDivEntity';

/**
 * @class Button
 * @classdesc 3D representation of a Button mimicking the html version. `mr-button`
 * @augments MRDivEntity
 */
export class Button extends MRDivEntity {
    /**
     * @class
     * @description Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
    }

    /**
     * @function
     * @description On Hover event function that handles how the button should visualize based on 'hover' aspect.
     * @param {object} event - the hover event
     */
    onHover = (event) => {
        switch (event.type) {
            case 'hover-start':
                this.object3D.scale.addScalar(0.1);
                this.object3D.position.z += 0.001;

                break;

            case 'hover-end':
                this.object3D.scale.subScalar(0.1);
                this.object3D.position.z -= 0.001;

                break;

            default:
                break;
        }
    };
}

customElements.get('mr-button') || customElements.define('mr-button', Button);