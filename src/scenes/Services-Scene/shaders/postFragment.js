

const postFragmentShader = 
`

    uniform float time;
    uniform sampler2D tDiffuse;
    uniform vec3 cameraPos;
    uniform vec2 mouse;
    uniform vec2 mouseVel;
    varying vec2 vUv;

    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    // this shader was from yuri artiukh from this youtube video https://www.youtube.com/watch?v=o0M_QPkhNi4&t=590s
    // dude is awesome!

    void main(){

        vec2 uv = vUv;
        vec2 usersMouse = mouse;
        vec2 usersMouseVel = mouseVel;

        vec4 tex = texture(tDiffuse, uv);
        vec4 originalTex = texture(tDiffuse, uv);

        vec2 center = vec2(0.5, 0.4) - uv;
        //vec2 center = vec2(dot(vec2(uv - 0.5), cameraPos.xy));

        vec4 color = vec4(0);
        float total = 0.0;

        for(float i = 0.0; i < 30.0; i++){
            //float lerp = sin(i / 30.0);
            float lerp = (i + rand(uv)) / 30.0;            

            float weight = sin(lerp * 3.14159);

            //vec4 sampleT = texture(tDiffuse, uv + center * lerp * .29 );
            vec4 sampleT = texture(tDiffuse, uv + center * lerp * .60 );            
            sampleT.rgb *= sampleT.a + (abs(sin(time)) * 0.2);
            color += sampleT * weight;
        }

        color.a = 1.0;
        color.rgb /= 4.;

        vec4 finalColor = 1.0 - (1.0 - color) * (1.0 - originalTex);

        float force = usersMouseVel.x;

        //vec4 finalTexture = mix(tex, finalColor, abs(0.9 * (usersMouse.x - usersMouseVel.x)));
        
        vec4 finalTexture = mix(tex, finalColor, abs(force) + 0.2);        
        
        //vec4 finalTexture = mix(tex, finalColor, 0.2);        
/*
        vec2 uv = vUv;
        vec4 tex = texture(tDiffuse, uv);
  */      
        //gl_FragColor = finalColor;       
        gl_FragColor = finalTexture;       
        //gl_FragColor = tex;       
    }
`;

export default postFragmentShader;