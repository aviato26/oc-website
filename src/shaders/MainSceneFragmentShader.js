


const horseShoeFragment = 
`
    //precision mediump float;

    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform sampler2D aboutScene;
    uniform sampler2D contactScene;

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
     
      vec4 aboutSceneTexture = texture(aboutScene, uv);
      vec4 contactSceneTexture = texture(contactScene, uv);

      float p = progress;
      //float p = sin(time);      
      //float p = 1.0;            

      vec4 currentTexture;

      if(p == 0.0){
        currentTexture = texture(tex1, uv);
      }

      if(p == 1.0){
        currentTexture = texture(tex2, uv);
      }

      //vec4 finalTextureMix = mix(texture1, texture2, smoothstep(m.x, m.x + 0.08, uv / 2.0).y);

      //vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.04, p + 0.001, uv / 2.0).y);
      //vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);      
      vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);            
     
      //gl_FragColor = finalTextureMix;
      //gl_FragColor = aboutSceneTexture;      
      gl_FragColor = contactSceneTexture;            
    }
`;

export default horseShoeFragment;