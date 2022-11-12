import SolidAper from "solid-aper";
import { MountableElement, render } from "solid-js/web";

export interface Options {
  container: MountableElement;
}

class Aper {
  constructor(options: Options) {
    render(() => <SolidAper />, options.container);
  }
  destroy() {}
}

export default Aper;
