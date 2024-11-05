'use client';

import { forwardRef, useMemo } from 'react';
import { Color, Texture } from 'three';
import { useTexture } from '@react-three/drei';
import { extend } from '@react-three/fiber';

import {
    PhysicalMaterialWithUniforms
} from '@/components/physicalMaterialWithUniforms';
import { customizeShaders } from '@/glsl/custom-shader';

extend({ PhysicalMaterialWithUniforms });

/**
 * Put materials into its own component, and wrap it in suspense in the mesh
 * to avoid weird race conditions.
 */
export const Material = forwardRef((props, ref) => {
    const aoTexture = useTexture('/media/ao.png');
    aoTexture.flipY = false;
    const instanceTexture = useTexture('/media/texture-mask-graph.png');

    const colors = useMemo(() => ({
        light_color:       new Color('#ffe9e9'),
        ramp_color_one:    new Color('#06082D'),
        ramp_color_two:    new Color('#020284'),
        ramp_color_three:  new Color('#0000ff'),
        ramp_color_four:   new Color('#71c7f5')
    }), [])

    const uniforms = useMemo(() => ({
        time: { value: 0 },
        uT_transition: { value: null },
        uT_displacement: { value: new Texture() },
        uT_shadow: { value: new Texture() },
        light_color: { value: colors.light_color},
        ramp_color_one: { value: colors.ramp_color_one },
        ramp_color_two: { value: colors.ramp_color_two },
        ramp_color_three: { value: colors.ramp_color_three },
        ramp_color_four: { value: colors.ramp_color_four },
        height_in: { value: 0 },
        height_graph_in: { value: 0 },
        height_graph_out: { value: 0 },
        height_out: { value: 0 },
        shadow_in: { value: 0 },
        shadow_out: { value: 0 },
        displacement_based_scale: { value: 0 },
        transition_noise: { value: 0 },
        height: { value: 0 }
    }), [ colors ]);

    return (
        <physicalMaterialWithUniforms
          ref={ref}
          roughness={0.65}
          map={aoTexture}
          aoMap={aoTexture}
          aoMapIntensity={0.75}
          args={[{uniforms, preCompileFunction: customizeShaders}]}
        />
    )
})

Material.displayName = 'Material';