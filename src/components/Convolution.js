import React, { useRef, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import { Mesh, PlaneGeometry } from 'three';

function Convolution(props) {
  const { inputTexture, kernel, outputTexture } = props;
  const convolutionShader = useRef();
  const outputMesh = useRef();

  useEffect(() => {
    const mesh = new Mesh(new PlaneGeometry(2, 2), outputTexture);
    mesh.position.set(0, 0, 0);
    outputMesh.current = mesh;
  }, []);

  useFrame(() => {
    convolutionShader.current.uniforms.inputTexture.value = inputTexture;
    convolutionShader.current.uniforms.kernel.value = kernel;
    convolutionShader.current.uniforms.outputTexture.value = outputTexture;
    convolutionShader.current.uniforms.resolution.value = [inputTexture.width, inputTexture.height];
    convolutionShader.current.uniforms.kernelSize.value = kernel.length;
  });

  return (
    <>
      <shaderMaterial
        ref={convolutionShader}
        uniforms={{
          inputTexture: { type: 't', value: inputTexture },
          kernel: { type: '1fv', value: kernel },
          outputTexture: { type: 't', value: outputTexture },
          resolution: { type: 'v2', value: [inputTexture.width, inputTexture.height] },
          kernelSize: { type: '1i', value: kernel.length },
        }}
        fragmentShader={`
          uniform sampler2D inputTexture;
          uniform float[9] kernel;
          uniform vec2 resolution;
          uniform int kernelSize;
          uniform sampler2D outputTexture;

          void main() {
            vec2 texCoord = gl_FragCoord.xy / resolution;
            vec4 colorSum = vec4(0.0);
            int halfKernel = (kernelSize - 1) / 2;
            for (int x = -halfKernel; x <= halfKernel; x++) {
              for (int y = -halfKernel; y <= halfKernel; y++) {
                vec4 sample = texture2D(inputTexture, texCoord + vec2(x, y) / resolution);
                colorSum += sample * kernel[x + halfKernel + (y + halfKernel) * kernelSize];
              }
            }
            gl_FragColor = colorSum;
            texture2D(outputTexture, texCoord) = colorSum;
          }
        `}
      />
      <primitive object={outputMesh.current} />
    </>
  );
}

export default Convolution;