




const floorVertexShader =
`

    uniform sampler2D tex;
    uniform float time;
    varying float vOpacity;
    attribute float opacity;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main()
    {
        vUv = uv;

        vPosition = position;

        vOpacity = opacity;

        vec3 transform = position.xyz;


        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(transform, 1.0);
        //gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = 1.0;
    }




/*
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main()
        {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            gl_PointSize = 10.0;
        }
*/

`;

export default floorVertexShader;
