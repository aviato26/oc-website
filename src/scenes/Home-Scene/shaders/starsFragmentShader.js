

const starsFragmentShader =
`
    //precision mediump float;

    uniform sampler2D tex;
    uniform float time;
    varying float vOpacity;

    varying vec2 vUv;

    void main()
    {

        vec2 uv = vUv;
        vec4 tex1;
        vec2 uv2;
        vec2 finalUv;

        vec2 baseVecs = vec2(0.0, 0.0);


        for(int i = 0; i < 21; i++){


          //uv.x *= cos(time * uv.y) * 0.001 * cos(time * uv.x) + length(.314);
          //uv.y *= cos(time * uv.x) * 0.001 * sin(time * uv.y) + length(.314);



          //uv.x += cos(uv.x * time) * 0.001;
          //uv.y += sin(uv.y * time) * 0.001;
          //uv.y *= cos(time * uv.x) * 0.001 * sin(time * uv.y) + length(.314);

          //uv2.x += cos(time * uv2.y) * 0.001 * sin(time * uv2.x);
          //uv2.y += cos(time * uv2.x) * 0.001 * sin(time * uv2.y);



          //finalUv.x += uv.x * uv2.x;

          tex1 = texture(tex, uv);
        }



        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        //gl_FragColor = tex1;
    }

`;

export default starsFragmentShader;
