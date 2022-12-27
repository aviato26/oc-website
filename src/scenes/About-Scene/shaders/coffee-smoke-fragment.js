


const coffeeSmokeFrag = `

    #define Hash(x) fract(sin(x) * 34214.0)

    uniform float time;
    uniform sampler2D tex;

    varying vec2 vUv;

    void main(){
        vec2 uv = vUv;
        vec3 uvZoom = vec3(uv * .7, 1.0);
        //vec3 uvZoom = vec3(uv, 1.0);        

        //uvZoom.y -= fract(fract(fract(time * 0.1 - abs(length(uvZoom.y + 0.5) - fract((time * 0.1 - uvZoom.y )))))) * 0.3;        
        //uvZoom.y -= fract(fract(fract(time * 0.3 - sin(length(uvZoom.y + 0.5) - fract((time * 0.3 - uvZoom.y * uv.y )))))) * 0.3;                
        uvZoom.y -= fract(fract(fract(time * 0.1 - sin(length(uvZoom.y * 0.3) - fract((time * 0.3 - uvZoom.y * uv.y )))))) * 0.3;                                        
        //uvZoom.x -= sin(uvZoom.y * 0.3) * 0.1;

        //vec4 numberTexture = texture(tex, uvZoom.xy);

        vec2 smoke = vec2(0);
        float n;


        for(int i = 1; i < 3; i++){
            n = float(i);            
            //uvZoom.y += sin(length(uvZoom * n + uvZoom.x * n - 0.5) + fract(time * uvZoom.y * n * uvZoom.y) * 0.1) * 0.1;
            uvZoom.y += sin(length(uvZoom * n + uvZoom.x * n - 0.5) + fract(time * uvZoom.y * n * uvZoom.y) * 0.1) * 0.1;            
            //uvZoom.y -= sin(uvZoom.y * n + uvZoom.x * n) * sin((length(uvZoom * n - 0.1) - uvZoom.y * n)) * fract(length(uvZoom + 0.5) * time * 0.1);                                        
            //smoke += sin(uvZoom.y + uvZoom.x * n * .314) - sin(uvZoom.y + uvZoom.x * n * 0.278) * fract(time * 0.1);
            //smoke += sin(uvZoom.y + uvZoom.x + n) + sin(uvZoom.y + uvZoom.x + n) * sin(fract(time * 0.1 * fract(uvZoom.y * n)));            
        }

        //smoke *= abs(sin(time * 0.1) - length(uvZoom));

        vec4 numberTexture = texture(tex, uvZoom.xy);

        //numberTexture.a -= sqrt((uvZoom.y + .006) + length((sin(uvZoom.y) * cos(uvZoom.x)) + fract(time * 0.9 - (smoke.y)))) - 0.4;
        //numberTexture.a -= length(smoke * uvZoom.xy);
        
        //gl_FragColor = vec4(0. ,g , 0. , .1);
        gl_FragColor = numberTexture;
    }

`

export default coffeeSmokeFrag;