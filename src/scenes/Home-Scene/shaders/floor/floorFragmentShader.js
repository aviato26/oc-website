



const floorFragmentShader =
`
    //precision mediump float;

    uniform sampler2D tex;
    uniform float time;
    uniform float mouseInput;

    varying vec2 vUv;

    void main()
    {

        vec2 uv = vUv;

        vec2 v = 2.0 * uv - 1.0;

        float r = 30.0;
        float g = 8.0;
        float b = 27.0;

        vec3 oColor = vec3(r / 255.0, g / 255.0, b / 255.0);

        vec4 color = vec4(0.08 / length(v));

        color.rgb = min(vec3(10.0), color.rgb);

        color.rgb *= oColor * 120.0;


        color.a = min(1.0, color.a) * 20.5;



        vec3 col2 = vec3(r, b, b);
            
        float dis = 5.0 - mouseInput;
        float width = 0.01;
        float blur = .7;
        vec3 lineColor = vec3(.5, .4, 1.4);

        vec2 o=uv+vec2(uv.x, uv.y);
        float angle = tan(o.y + o.x);
        float l = length(o);
        float offset = l + (angle/(2. * 3.14)) * dis;
        //float circles = mod(offset - time * 0.9, dis);
        float circles = mod(offset - time, dis);        
        color.a = (smoothstep(circles-blur,circles,width)-smoothstep(circles,circles+blur,width)) * lineColor.r;
        color.a += .3;



        //gl_FragColor = vec4(smoothstep(0.0, 0.3, abs(s-uv.y)));
        //gl_FragColor = color * 1.5;
        gl_FragColor = color;        
        //gl_FragColor = vec4(col2, 1.0);
    }
`;

export default floorFragmentShader;
