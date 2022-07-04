



const floorFragmentShader =
`
    //precision mediump float;

    uniform sampler2D tex;
    uniform float time;

    varying vec2 vUv;

    void main()
    {

        vec2 uv = vUv;

        vec2 v = 2.0 * uv - 1.0;

        float r = 1.0;
        float g = 30.0;
        float b = 150.0;

        vec3 oColor = vec3(r / 255.0, g / 255.0, b / 255.0);

        vec4 color = vec4(0.08 / length(v));

        color.rgb = min(vec3(10.0), color.rgb);

        color.rgb *= oColor * 120.0;

        //color *= vOpacity;

        //color.a = min(1.0, color.a) * .15;
        //color.a = min(1.0, color.a) * .5;
        color.a = min(1.0, color.a) * 20.9;

        float disc = length(v);

        uv.x += time / 25.0;

        uv.x *= 5.0;
        uv.y *= 1.3;

        //float s = sin(uv.x * 16.0) / 2.0 + 0.5;
        float s = sin(uv.x * 16.0) / 2.0 + 0.5;        

        color *= smoothstep(0.0, 0.9, abs(s-uv.y));

        //gl_FragColor = vec4(smoothstep(0.0, 0.3, abs(s-uv.y)));
        gl_FragColor = color;
    }
`;

export default floorFragmentShader;
