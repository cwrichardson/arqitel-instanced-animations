/**
 * We want to keep all of the magic of MeshPhysicalMaterial, but want
 * to do some magic of our own. One way would have been to recreate
 * the properties of MeshPhyicalMaterial inside of our own custom 
 * material. For this project, we're just starting with the material,
 * and augmenting it with our own shaders and uniforms.
 */ 
export function customizeShaders (shader) {
    console.log(shader)
    // add our uniforms to the vertex shader
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        /* glsl */ `
            #include <common>
            uniform float time;
            uniform sampler2D uT_transition;
            uniform sampler2D uT_displacement;
            uniform sampler2D uT_shadow;
            uniform float height_in;
            uniform float height_graph_in;
            uniform float height_graph_out;
            uniform float height_out;
            uniform float shadow_in;
            uniform float shadow_out;
            uniform float displacement_based_scale;
            uniform float transition_noise;
            uniform float height;

            attribute vec2 instanceUV;
            varying float vHeight;
            varying float vHeightUv;
        `
    );

    // add our customized vertex manipulation
    // vHeightUv is for the gradient, so we clamp between 0 and 1
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        /* glsl */ `
            #include <begin_vertex>
            vHeightUv = clamp(position.y * 2., 0., 1.);
            vec4 transition = texture2D(uT_transition, instanceUV);
            transformed *= transition.g;
            vHeight = transformed.y;
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        /* glsl */ `
            #include <common>
            uniform vec3 light_color;
            uniform vec3 ramp_color_one;
            uniform vec3 ramp_color_two;
            uniform vec3 ramp_color_three;
            uniform vec3 ramp_color_four;

            varying float vHeight;
            varying float vHeightUv;
        `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        /* glsl */ `
            #include <color_fragment>
            // diffuseColor.rgb = vec3(1.,0.,0.);
            vec3 highlight = mix(ramp_color_three, ramp_color_four, vHeightUv);
            diffuseColor.rgb = ramp_color_two;
            diffuseColor.rgb = mix(diffuseColor.rgb, ramp_color_three, vHeightUv);
            diffuseColor.rgb = mix(diffuseColor.rgb, highlight, clamp(vHeight / 10. - 3., 0., 1.));
        `
    )
}