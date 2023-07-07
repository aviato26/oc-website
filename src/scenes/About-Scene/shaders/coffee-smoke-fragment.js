


const coffeeSmokeFrag = `

    #define Hash(x) fract(sin(x) * 34214.0)

    uniform float time;
    uniform sampler2D tex;
    uniform float displacement;

    varying vec2 vUv;


    float sdBox( in vec2 p, in vec2 b )
    {
        vec2 d = abs(p)-b;
        return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
    }


    void main(){
        vec2 uv = vUv;
        vec2 uv2 = vUv;

        //vec3 uvZoom = vec3(uv * .7, 1.0);
        vec3 uvZoom = vec3(uv, 1.0);        

        float mousePos = mix(0., 1., displacement * 0.1);

        vec2 uv3 = uv * 1.5;
        vec2 cHalf = vec2(0.5,0.9);
        vec2 cTheta = cHalf-uv3;
        float d = length(cTheta) * 2.0;
    
        float s = sin(d-time * 0.2) * 1.0;
        //float s = sin(d-time * mousePos) * 1.0;        
        uv3.y += cTheta.y + s;
        uv3.x += fract(uv3.x * 1.) + (sin(time * .1));
        uv3 *= 1.3;
        //gl_FragColor = texture(tex , uv3 - fract((length(displacement * 0.5 * uv) * time * 0.05) + uv.x));
        gl_FragColor = texture(tex , uv3 - fract((length(uv) * time * 0.05) + uv.x));        

        gl_FragColor *= abs(sin(time + uv3.y) * sin(uv.y) * sin(uv3.y)) * (uv3.y * uv.y) + length(uv.y) + 0.2;
        gl_FragColor.a = dot(uv.y, 0.5) * 2.;
    }

`

export default coffeeSmokeFrag;