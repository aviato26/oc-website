

const screenVertexShader = 
`

    uniform sampler2D tex;
    varying vec2 vUv;

    void main(){

        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    }

`;

export default screenVertexShader;