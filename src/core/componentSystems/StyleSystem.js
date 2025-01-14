import { MRSystem } from 'mrjs/core/MRSystem';
import { MRDivEntity } from 'mrjs/core/MRDivEntity';
import { MREntity } from 'mrjs/core/MREntity';

/**
 * @class StyleSystem
 * @classdesc Handles style updates for all items.
 * @augments MRSystem
 */
export class StyleSystem extends MRSystem {
    /**
     * @class
     * @description StyleSystem's default constructor with a starting framerate of 1/30.
     */
    constructor() {
        super(false);
        this.cssUpdateNeeded = true;

        document.addEventListener('panel-mutated', () => {
            this.cssUpdateNeeded = true;
        });
    }

    /**
     * @function
     * @description The generic system update call. Handles updating all 3D items to match whatever style is expected whether that be a 2D setup or a 3D change.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            if (!entity.needsStyleUpdate) {
                continue;
            }
            entity.object3D.scale.setScalar(entity.compStyle.scale != 'none' ? entity.compStyle.scale : 1);
            if (entity.compStyle.zIndex != 'auto') {
                let parentZ = entity.parentElement.compStyle.zIndex == 'auto' ? 1 : parseFloat(entity.parentElement.compStyle.zIndex);
                // default zIndex values in css are in the 1000s - using this arbitrary divide to convert to an actual usable threejs value.
                entity.object3D.position.setZ((parseFloat(entity.compStyle.zIndex) + parentZ) / 1000);
            }

            entity instanceof MRDivEntity ? entity.updateStyle() : null;
            entity.dispatchEvent(new CustomEvent('child-updated', { bubbles: true }));
            entity.needsStyleUpdate = false;
        }

        this.cssUpdateNeeded = false;
    }

    /**
     * @function
     * @description Called when a new entity is added to the scene. Adds said new entity to the style's system registry.
     * @param {MREntity} entity - the entity being added.
     */
    onNewEntity(entity) {
        this.registry.add(entity);
        this.cssUpdateNeeded = true;
    }
}
