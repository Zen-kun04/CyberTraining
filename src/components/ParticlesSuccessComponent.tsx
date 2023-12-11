import React, { useCallback, useEffect, useState } from 'react';
import { Particles } from 'react-particles';
import { Engine } from 'tsparticles-engine';
import {loadSlim} from 'tsparticles-slim'

const ParticlesSuccessComponent = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesOptions = {
        "fullScreen": {
            "zIndex": 1
        },
        "particles": {
            "color": {
                "value": ["#fc0303", "#fcf803", "#56fc03", "#03fc73", "#03fcf8", "#0373fc", "#2803fc", "#ca03fc", "#fc0398"]
            },
            "move": {
                "direction": "bottom",
                "enable": true,
                "gravity": {
                    "enable": true,
                    "acceleration": 0
                },
                "outModes": {
                    "default": "out"
                },
                "speed": {
                    "min": 6,
                    "max": 8
                }
            },
            "number": {
                "value": 250,
                "density": {
                    "enable": true,
                    "area": 3000
                }
            },
            "opacity": {
                "value": 1
            },
            "shape": {
                "type": "polygon",
                "options": {
                    "sides": 5
                }
            },
            "size": {
                "value": {
                    "min": 3,
                    "max": 5
                },
                "random": {
                    "enable": true,
                    "minimumValue": 1
                }
            },
            "rotate": {
                "value": {
                    "min": 0,
                    "max": 360
                },
                "direction": "random",
                "move": true,
                "animation": {
                    "enable": true,
                    "speed": 60
                }
            },
            "tilt": {
                "direction": "random",
                "enable": true,
                "move": true,
                "value": {
                    "min": 0,
                    "max": 360
                },
                "animation": {
                    "enable": true,
                    "speed": 60
                }
            }
        }
    };
    

    return (
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    )
};

export default ParticlesSuccessComponent;