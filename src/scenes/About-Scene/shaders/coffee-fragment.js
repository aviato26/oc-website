


const coffeeFragmentShader = `

    uniform float time;

    varying vec2 vUv;

    void main(){
/*
        vec2 uv = vUv;

        float dist = length(uv * fract(uv + time) * 0.1);

        gl_FragColor = vec4(dist, 0, 0, 1);
*/



        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = vUv;
        vec2 uv2 = fract(uv * 20.0);
        
        float dist = 1.0 / length(uv / uv2) * length(sin(uv + time));
        
        //dist *= 0.1;
        
        vec3 col = vec3(dist);
    
        // Output to screen
        gl_FragColor = vec4(col, 1);





    }

`

export default coffeeFragmentShader;