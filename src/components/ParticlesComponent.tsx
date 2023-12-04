import { useCallback } from "react";
import Particles from "react-particles";
import { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const config = require("./particlesjs.json");

const ParticlesComponent = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles id="tsparticles" init={particlesInit} options={config} />
    )
}

export default ParticlesComponent;