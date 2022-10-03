

const rainShader = 
`
    
    uniform sampler2D tex;

    void main()
    {

        vec2 uv = vec2(gl_FragCoord.x, 1.0 - gl_FragCoord.y);
        vec4 tex = texture2D(tex, uv);        

        //gl_FragColor = tex;
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
;
`