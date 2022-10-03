


const horseShoeFragment = 
`
    //precision mediump float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform vec2 mouse;
    uniform vec2 res;
    uniform float progress;
    uniform float time;

    varying vec2 vUv;    
    
    
    void main()
    {
      vec2 uv = vUv;
      vec2 m = mouse.xy;
      
      vec4 texture1 = texture(tex1, uv);
      vec4 texture2 = texture(tex2, uv);

      vec4 finalTextureMix = mix(texture1, texture2, smoothstep(m.x, m.x + 0.08, uv / 2.0).y);
     
      gl_FragColor = finalTextureMix;
    }
`;

export default horseShoeFragment;