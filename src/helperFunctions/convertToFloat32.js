
import { BufferGeometry, BufferAttribute } from 'three';

const convertedArr = (arr, names) => {
  let allGeometrys = [];
  //console.log(arr)
  arr.map(c => {
    //console.log(c)
    names.map(name => {
      if(!c.name.indexOf(name) ){
        //console.log('blah', c)
        //let opacityArr = c.geometry.attributes.position.array.map(particle => 0.1);
        let opacityArr = c.geometry.attributes.position.array.map(particle => 0.01);
        let arrCopy = c.geometry.attributes.position.array;

        let bufferGeo = new BufferGeometry();
        //this.bufferGeo2 = new THREE.BufferGeometry();

        bufferGeo.setAttribute('position', new BufferAttribute(new Float32Array(c.geometry.attributes.position.array.length), 3));
        bufferGeo.setAttribute('opacity', new BufferAttribute(new Float32Array(opacityArr), 3));

        allGeometrys.push(
          {

            id: c.name,
            geometry: bufferGeo,
            arrCopy: arrCopy,
            // storing transformations of original mesh to apply to new mesh since the new meshes will be transformation free and will not be in correct positions in world space
            meshPosition: c.position,
            meshQuaternion: c.quaternion,
            meshRotation: c.rotation,
            meshScale: c.scale
          }
        );

      }
    })
  })

  return allGeometrys;
}

export default convertedArr;
