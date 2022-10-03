



const warpFragmentShader = 
`
    //precision mediump float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float progress;
    uniform float time;

    varying vec2 vUv;

    vec2 distort(vec2 olduv, float progress, float expo){
        vec2 p0 = 2.0 * olduv - 1.0;
        vec2 p1 = p0 / (1.0 - progress * length(p0) * expo);

        return (p1 + 1.0) * 0.5;
    }    

    void main()
    {

        //vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);        
        //vec2 uv = vec2(gl_FragCoord.x, 1.0 - gl_FragCoord.y);        
        //vec2 v = 2.0 * uv - 1.0;
        
        vec2 uv = vUv;

        vec2 uv1 = distort(uv, -10.0 * progress, progress * 4.0);
        vec2 uv2 = distort(uv, -10.0 * (1.0 - progress), progress * 4.0);

        vec4 texture1 = texture2D(tex1, uv1);
        vec4 texture2 = texture2D(tex2, uv2);

        float circle = distance(uv, vec2(0.5));

        float dx = distance(uv * uv, vec2(2.0 * uv));

        //float blendTextures = smoothstep(texture1.x * circle, texture2.y * circle, progress);
        //float blendTextures = smoothstep(uv.y * circle, uv.y * circle, sin(time * 0.1 ));
        
        float blendTextures = smoothstep(uv.y, uv.y + 0.5, progress);
        
        //float blendTextures = smoothstep(uv.y * dx, uv.y * dx, sin(time * 0.1 ));

        vec4 finalTexture = mix(texture1, texture2, blendTextures);


        //gl_FragColor = vec4(1.0 - disc, 0.0, 0.0, 1.0) * vOpacity;
        //gl_FragColor = vec4(color.rgb, color.a) * vOpacity;
        //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        //gl_FragColor = texture1 * blendTextures;
        //gl_FragColor = vec4(blendTextures * uv.x, blendTextures * uv.y, 0.0, 1.0);
        //gl_FragColor = texture1;
        //gl_FragColor = finalTexture;
    }
`;

export default warpFragmentShader;