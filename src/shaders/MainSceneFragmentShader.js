


const horseShoeFragment = 
`
    uniform sampler2D mainScene;
    uniform float progressBarValue;
    uniform float radius;
    
    varying vec2 vUv;    


    float sdSegment( in vec2 p, in vec2 a, in vec2 b )
    {
        vec2 pa = p-a, ba = b-a;
        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        return length( pa - ba*h );
    }

    
    void main()
    {
      vec2 uv = vUv;
      vec2 uv2 = vUv;
      vec2 sphereUV = vUv;

      vec2 line = uv;
      line -= 0.5;
      line *= 8.0;

      sphereUV -= 0.5;
  
      float sdf = step(sdSegment(line, vec2(-1, 0), vec2(1, 0)) * 2., 0.05) * 0.3;
      float sdf2 = step(sdSegment(line, vec2(0, 0) - vec2(1, 0), vec2(progressBarValue * 2.0, 0) - vec2(1, 0)) * 2., 0.05);    


      float circle = smoothstep(length(sphereUV), length(sphereUV - uv2), radius);
      //float circle = step(length(sphereUV), radius);      

      vec4 mainSceneTexture = texture(mainScene, uv2);

      if(progressBarValue < 1.){
        gl_FragColor = vec4(sdf + sdf2);
      }
      else{
        //gl_FragColor = mainSceneTexture;                    
        gl_FragColor = mix(vec4(0.), vec4(circle * mainSceneTexture), radius);
      }

      //gl_FragColor = mainSceneTexture;                    

    }
`;

export default horseShoeFragment;