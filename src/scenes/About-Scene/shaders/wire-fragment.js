


const wireFragmentShader = `

    uniform float time;

    varying vec2 vUv;

    void main(){

        vec2 uv = vUv;
        //vec2 uv2 = uv;

        vec2 uv2 = fract(uv * 30.0);

        uv2.x -= fract(time * 3.0 - length(uv2.x * uv.y));
        //uv2.x *= fract(time + 4.0 - uv.x / uv2.y) * length(fract(uv2 / uv * time));        

        //float dist = 1.0 / length(fract(uv2 * 2.0) - 0.5) * length(uv2 - 0.5) + sin(time);
        float dist = 1.0 / length(uv2 - 0.5) * uv.x;        

        dist *= 0.1;

        //dist += length(uv2 - 0.5) * fract(uv2.x - 0.5 - time);

        vec3 col = vec3(dist);

        float r = 0.812;
        float g = 0.012;
        float b = 0.614;

        vec3 colors = vec3(r, g, b);

        col *= colors;

        gl_FragColor = vec4(col, 1);
    }

`;

export default wireFragmentShader;