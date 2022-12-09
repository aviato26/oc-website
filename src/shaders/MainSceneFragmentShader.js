


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
    uniform float progress2;
    uniform float progress3;

    uniform float time;

    uniform int sceneIndex;

    varying vec2 vUv;    
    
    
    void main()
    {
      vec2 uv = vUv;
      vec2 uv2 = vUv;      
      vec2 uv3 = vUv;            

      vec2 m = mouse.xy;
      
      vec4 HomeSceneTexture = texture(tex1, uv);
      vec4 ServicesSceneTexture = texture(tex2, uv);
      vec4 AboutSceneTexture = texture(aboutScene, uv);
      vec4 ContactSceneTexture = texture(contactScene, uv);

      float p = progress;
      float p2 = progress2;
      float p3 = progress3;

      //float p = sin(time);      
      //float p = 1.0;            

      vec4 currentTexture;
      vec4 lastTexture;
      vec4 mixTexture;
      vec4 mixTexture2;

/*
      if(p == 0.0){
        currentTexture = texture(tex1, uv);
      }

      if(p == 1.0){
        currentTexture = texture(tex2, uv);
      }
*/

      if(sceneIndex == 0){
        //gl_FragColor = mix(ServicesSceneTexture, HomeSceneTexture, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);      
        currentTexture = HomeSceneTexture;
        lastTexture = ServicesSceneTexture;

        gl_FragColor = mix(lastTexture, currentTexture, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);              

      }
      else if(sceneIndex == 1){

        currentTexture = ServicesSceneTexture;
        lastTexture = AboutSceneTexture;

        //lastTexture = ServicesSceneTexture;
        //currentTexture = AboutSceneTexture;

        gl_FragColor = mix(lastTexture, currentTexture, smoothstep(p2 - 0.4, p2 + 0.1, uv2 / 2.0).y);              

      }

      else if(sceneIndex == 2){
        currentTexture = AboutSceneTexture;
        lastTexture = ContactSceneTexture;

        //currentTexture = ContactSceneTexture;
        //lastTexture = AboutSceneTexture;

        gl_FragColor = mix(lastTexture, currentTexture, smoothstep(p3 - 0.4, p3 + 0.1, uv3 / 2.0).y);              
      }

      //gl_FragColor = mix(lastTexture, currentTexture, -smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);              

      //vec4 finalTextureMix = mix(texture1, texture2, smoothstep(m.x, m.x + 0.08, uv / 2.0).y);

      //vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.04, p + 0.001, uv / 2.0).y);
      //vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);      
      //vec4 finalTextureMix = mix(texture2, texture1, smoothstep(p - 0.4, p + 0.1, uv / 2.0).y);            
     
      //gl_FragColor = finalTextureMix;
      //gl_FragColor = texture1;      
      //gl_FragColor = AboutSceneTexture;            
    }
`;

export default horseShoeFragment;