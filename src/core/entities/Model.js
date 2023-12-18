import { MREntity } from 'mrjs/core/MREntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class Model
 * @classdesc Loads in any supported 3D model type to the requested location. `mr-model`
 * @augments MREntity
 */
export class Model extends MREntity {
    /**
     * @class
     * @description Constructor for the Model entity, does the default.
     */
    constructor() {
        super();
    }

    /**
     * @function
     * @description Callback function of MREntity - handles setting up this Model once it is connected to run as an entity component.
     * Includes loading up the model and associated data.
     */
    connected() {
        this.src = this.getAttribute('src');
        if (!this.src) {
            return;
        }

        const extension = this.src.slice(((this.src.lastIndexOf('.') - 1) >>> 0) + 2);

        mrjsUtils.Model.loadModel(this.src, extension)
            .then((loadedMeshModel) => {
                // todo - these material changes should be moved out of the loader at some point
                // loadedMeshModel.material = material;
                loadedMeshModel.receiveShadow = true;
                loadedMeshModel.renderOrder = 3;

                // the below is the same as 'scene.add'
                this.object3D.add(loadedMeshModel);

                this.dispatchEvent(new CustomEvent('new-entity', { bubbles: true }));
            })
            .catch((error) => {
                console.log(`ERR: in loading model ${this.src}. Error was:`, error);
            });
    }

    /**
     * @function
     * @description On load event function - right now defaults to do nothing.
     */
    onLoad = () => {};
}

customElements.get('mr-model') || customElements.define('mr-model', Model);