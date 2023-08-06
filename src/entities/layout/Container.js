import { Entity } from "../../core/entity";

export class Container extends Entity {
  constructor() {
    super()
    this.width = 1
    this.height = 1

    document.addEventListener('DOMContentLoaded', (event) => {
    this.dispatchEvent( new CustomEvent('container-mutated', { bubbles: true }))
    })
  }
}

customElements.get('mr-container') ||
  customElements.define('mr-container', Container)