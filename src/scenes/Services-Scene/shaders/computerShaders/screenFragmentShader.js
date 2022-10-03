

const screenFragmentShader = 
`

    uniform sampler2D errorTexture;
    uniform sampler2D fixedErrorTexture;
    uniform float time;
    uniform bool shadowContainer;
    uniform bool shadowContainer2;    
    uniform float stateClock;
    uniform float stateClock2;

    varying vec2 vUv;



    float lerp(float start, float end, float t){
        return start * (1.0 - t) + end * t;
    }



    void main(){

        vec2 uv = vUv;

        vec4 errorTex = texture(errorTexture, uv);
        vec4 fixedErrorTex = texture(fixedErrorTexture, uv);
        vec4 tex;
        vec4 tex2;


        float t;
        float t2;

        vec4 finalTexture;

        t = stateClock;
        t2 = stateClock2;

        tex = errorTex;       
        tex2 = fixedErrorTex;

        if(shadowContainer && t2 < 0.1){
            gl_FragColor = mix(vec4(0), tex, t);
        }
        
        if(!shadowContainer && t > 0.0){
            gl_FragColor = mix(vec4(0), tex, t);
        }

        if(shadowContainer2 && t < 0.1){
            gl_FragColor = mix(vec4(0), tex2, t2 );
        }
        
        if(!shadowContainer2 && t2 > 0.0){
            gl_FragColor = mix(vec4(0), tex2, t2 );
        }
        
    }
`;

export default screenFragmentShader;