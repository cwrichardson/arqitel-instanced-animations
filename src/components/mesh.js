'use client';

import { forwardRef, Suspense, useMemo } from 'react';
import { MeshPhysicalMaterial, Object3D, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';

/**
 * Put materials into its own component, and wrap it in suspense in the mesh
 * to avoid weird race conditions.
 */
const Material = () => {
    const aoTexture = useTexture('/media/ao.png');
    aoTexture.flipY = false;
    const instanceTexture = useTexture('/media/texture-mask-graph.png');

    const uniforms = useMemo(() => ({
        time: { value: 0 },
        uT_transition: { value: instanceTexture },
        uT_displacement: { value: new Texture() },
        uT_shadow: { value: new Texture() },
        aoMap: { value: aoTexture },
        light_color: { value: '#ffe9e9'},
        ramp_color_one: { value: '#06082D'},
        ramp_color_two: { value: '#020284'},
        ramp_color_three: { value: '#0000ff'},
        ramp_color_four: { value: '#71c7f5'},
        height_in: { value: 0 },
        height_graph_in: { value: 0 },
        height_graph_out: { value: 0 },
        height_out: { value: 0 },
        shadow_in: { value: 0 },
        shadow_out: { value: 0 },
        displacement_based_scale: { value: 0 },
        transition_noise: { value: 0 },
        height: { value: 0 }
    }), [aoTexture, instanceTexture]);

    /**
     * We want to keep all of the magic of MeshPhysicalMaterial, but want
     * to do some magic of our own. One way would have been to recreate
     * the properties of MeshPhyicalMaterial inside of our own custom 
     * material. For this project, we're just starting with the material,
     * and augmenting it with our own shaders and uniforms.
     */ 
    function customizeShaders (shader) {
        // merge our uniforms with any existing ones
        shader.uniforms = Object.assign(shader.uniforms, uniforms);

        // add our uniforms to the vertex shader
        shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            /* glsl */ `
                #include <common>
                uniform float time;
                uniform sampler2D uT_transition;
                uniform sampler2D uT_displacement;
                uniform sampler2D uT_shadow;
                uniform vec3 light_color;
                uniform vec3 ramp_color_one;
                uniform vec3 ramp_color_two;
                uniform vec3 ramp_color_three;
                uniform vec3 ramp_color_four;
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
            `
        );

        // add our customized vertex manipulation
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            /* glsl */ `
                #include <begin_vertex>
                vec4 transition = texture2D(uT_transition, instanceUV);
                transformed *= transition.g;
            `
        )
    }

    return (
        <meshPhysicalMaterial
            roughness={0.65}
            map={aoTexture}
            aoMap={aoTexture}
            aoMapIntensity={0.75}
            onBeforeCompile={customizeShaders}
        />
    )
}

export const Mesh = forwardRef((props, ref) => {

    // instance geometry
    const { nodes } = useGLTF('/media/bar.glb');
    const barGeometry = nodes.Plane002.geometry;
    const instanceGeometry = barGeometry.scale(40, 40, 40);

    // instances
    const iSize = 50;
    const instances = iSize**2;

    /**
     * To set the position of each instance, `instanceBufferAttribute`
     * needs a Matrix4 for each one. The "local matrix" we're passing
     * is pretty simple:
     *      1 0 0 0
     *      0 1 0 0
     *      0 0 1 0
     *      x y z 1
     * 
     * but in case we need to do some fancier transforms later, we use
     * the helper functions of `Object3D` to create the matrix for us.
     * 
     * We did a `scale` on the underlying geometry of 40, so we use a
     * width of 60 to position each instance with a little space.
     */
    const d = new Object3D();
    const width = 60;
    const positions = [];
    const instancePositions = [];

    for (let i = 0; i < iSize; i++) {
        for (let j = 0; j < iSize; j++) {
            d.position.set(
                width * (i - iSize / 2),
                0,
                width * (j - iSize / 2)
            );
            d.updateMatrix();
            positions.push(...d.matrix.elements);

            // create an array for UVs
            instancePositions.push(i / iSize, j / iSize);
        }
    }
    const instanceLocMatrixPositions = new Float32Array(positions);
    const instanceUV = new Float32Array(instancePositions);
    console.log(instanceUV)

    useFrame((state, delta, xrFrame) => {
        // executes 1/frame, so we can just directly morph the ref with a delta
        // ref.current.rotation.x += 0.01;
        // ref.current.rotation.y += 0.02;
    })

    const foo = (<instancedMesh geometry={instanceGeometry} count={1} material={MeshPhysicalMaterial} />);
    console.log(foo);

    return (
        <instancedMesh ref={ref} geometry={instanceGeometry} count={instances}>
            <Suspense fallback={null}>
                <Material />
            </Suspense>
            <instancedBufferAttribute attach={'instanceMatrix'} args={[instanceLocMatrixPositions, 16]} />
            <instancedBufferAttribute attach={'geometry-attributes-instanceUV'} args={[instanceUV, 2]} />
        </instancedMesh>
    )
})

Mesh.displayName = 'Mesh';