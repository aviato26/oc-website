

const fragmentShader =
`
    //precision mediump float;

    uniform sampler2D tex;
    uniform float time;
    varying float vOpacity;

    varying vec2 vUv;

    void main()
    {

        vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
        vec2 v = 2.0 * uv - 1.0;

        float r = 5.0;
        float g = 5.0;
        float b = 225.0;

        vec3 oColor = vec3(r / 255.0, g / 255.0, b / 255.0);

        vec4 color = vec4(0.08 / length(v));

        color.rgb = min(vec3(10.0), color.rgb);

        color.rgb *= oColor * 120.0;

        color *= vOpacity;

        //color.a = min(1.0, color.a) * .15;
        //color.a = min(1.0, color.a) * .5;
        color.a = min(1.0, color.a) * .7;

        float disc = length(v);

        //gl_FragColor = vec4(1.0 - disc, 0.0, 0.0, 1.0) * vOpacity;
        //gl_FragColor = vec4(color.rgb, color.a) * vOpacity;
        gl_FragColor = color * vOpacity;
        //gl_FragColor = vec4(1.0);
    }
`;

export default fragmentShader;
