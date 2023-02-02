

const screenFragmentShader = 
`

    uniform sampler2D errorTexture;
    uniform sampler2D fixedErrorTexture;
    uniform float time;

    varying vec2 vUv;

    void main(){

        vec2 uv = vUv;

        vec4 tex = texture(errorTexture, uv);
        vec4 tex2 = texture(fixedErrorTexture, uv);

        gl_FragColor = mix(tex, tex2, abs(sin(time)));
    }
`;

export default screenFragmentShader;