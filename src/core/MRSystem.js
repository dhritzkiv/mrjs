import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class MRSystem
 * @classdesc The default representation of an MRSystem to be expanded upon by actual details ECS System items.
 */
export class MRSystem {
    frameRate = null;

    delta = 0;

    /**
     * @class
     * @description Constructor for MRSystem. Sets up appropriate document event listeners, component defaults, and system defaults that will be used for system runs ever frame.
     * @param {boolean} useComponents - Default to true. Determines whether comonents need to be maintained (attached/updated/detached) with the system.
     * @param {number} frameRate - Default to null. When set, used and updated as part of the System's update function.
     */
    constructor(useComponents = true, frameRate = null) {
        this.app = document.querySelector('mr-app');

        if (!this.app) {
            return;
        }

        this.frameRate = frameRate;
        // Need a way to register and deregister systems per environment
        this.registry = new Set();

        this.systemName = this.constructor.name.split('System')[0];
        this.componentName = `comp${this.systemName}`;

        this.app.registerSystem(this);

        if (useComponents) {
            document.addEventListener(`${this.componentName}-attached`, this.onAttach);
            document.addEventListener(`${this.componentName}-updated`, this.onUpdate);
            document.addEventListener(`${this.componentName}-detached`, this.onDetach);
        }

        this.app.addEventListener('new-entity', (event) => {
            if (this.registry.has(event.target)) {
                return;
            }
            this.onNewEntity(event.target);
        });

        const entities = document.querySelectorAll(`[${this.componentName}]`);
        for (const entity of entities) {
            if (!(entity instanceof MREntity)) {
                return;
            }
            this.registry.add(entity);
        }
    }

    /**
     * @function
     * @description Checks if we need to run the generic system update call. Default implementation returns true if there are
     * any items in the system's registry. Allows subclasses to override with their own implementation.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     * @returns {boolean} true if the system is in a state where an update is needed to be run this render call, false otherwise
     */
    needsUpdate(deltaTime, frame) {
        return this.registry.size > 0;
    }

    /**
     * @function
     * @description The actual system update call.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    __update(deltaTime, frame) {
        if (!this.needsUpdate(deltaTime, frame)) {
            return;
        }

        if (this.frameRate) {
            this.delta += deltaTime;
            if (this.delta < this.frameRate) {
                return;
            }
        }
        this.update(deltaTime, frame);
        this.delta = 0;
    }

    /**
     * @function
     * @description The generic system update call.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {}

    /**
     * @function
     * @description Called when a new entity is added to the scene
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {}

    /**
     * @function
     * @description Called when the entity component is initialized
     * @param {MREntity} entity - the entity being attached/initialized.
     */
    attachedComponent(entity) {}

    /**
     * @function
     * @description Called when a specific entity component is being updated
     * @param {MREntity} entity - the entity being updated
     * @param {object} oldData - the
     */
    updatedComponent(entity, oldData) {}

    /**
     * @function
     * @description Called when the entity component is removed
     * @param {MREntity} entity - the entity component being removed.
     */
    detachedComponent(entity) {}

    /**
     * @function
     * @description Handles the component and registry aspect of the event when an entity component attaches to this system.
     * @param {object} event - the attach event
     */
    onAttach = (event) => {
        this.registry.add(event.target);
        this.attachedComponent(event.target);
    };

    /**
     * @function
     * @description Handles the component and registry update of the even when an entity component needs to change.
     * @param {object} event - the update event
     */
    onUpdate = (event) => {
        this.updatedComponent(event.target, event.detail.oldData);
    };

    /**
     * @function
     * @description Handles the component and registry aspect of the even when an entity component detaches from this system.
     * @param {object} event - the detach event
     */
    onDetach = (event) => {
        this.registry.delete(event.target);
        this.detachedComponent(event.target);
    };
}
