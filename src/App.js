import logo from './assets/logo.svg';
import imageTexture from './assets/braid_gradient_logo_white.png'
import './assets/styles/App.css';
import { useFrame } from 'react-three-fiber';
import { Canvas } from 'react-three-fiber';
import Convolution from './components/Convolution'

function App() {
  let textureKernel = [
  [0.0625, 0.125, 0.0625],
  [0.125, 0.250, 0.125],
  [0.0625, 0.125, 0.0625]]
  let _outputTexture 
  return (
    <Canvas>
      <Convolution inputTexture={imageTexture} kernel={textureKernel} outputTexture={_outputTexture} />
    </Canvas>
  );
}

export default App;
