import { MathUtils, MeshPhysicalMaterial, UniformsUtils } from 'three';

export class PhysicalMaterialWithUniforms extends MeshPhysicalMaterial {
        constructor(parameters = {}) {
            const { uniforms = {}, preCompileFunction = undefined, ...parentParams } = parameters;
            super(parentParams);
            this.uniforms = uniforms;
            this.preCompileFunction = preCompileFunction;

            if ( parameters !== undefined) {
                this.setValues( parameters );
            }

            // add getters/setters for uniforms
            Object.entries(uniforms).forEach(([name]) =>
                Object.defineProperty(this, name, {
                    get: () => this.uniforms[name].value,
                    set: (v) => (this.uniforms[name].value = v)
                })
            )
        }
        
        onBeforeCompile(shader, renderer) {
            Object.entries(this.uniforms).forEach(([key]) =>
                shader.uniforms[key] = this.uniforms[key]);

            if (this.preCompileFunction !== undefined) this.preCompileFunction(shader, renderer);
        }
}