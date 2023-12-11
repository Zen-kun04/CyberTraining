import ParticlesSuccessComponent from "@/components/ParticlesSuccessComponent";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { tsParticles } from "tsparticles-engine";

const InformationDisclosure = () => {
    const admin = "Zen-kun04";
    const uuid = "9fa6341e-8fc6-4252-8da9-9b0d627e99a0";

    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    const router = useRouter();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
        tsParticles.load("tsparticles", {
            "fullScreen": {
              "zIndex": 1
            },
            "particles": {
              "color": {
                "value": [
                  "#FFFFFF",
                  "#FFd700"
                ]
              },
              "move": {
                "direction": "bottom",
                "enable": true,
                "outModes": {
                  "default": "out"
                },
                "size": true,
                "speed": {
                  "min": 1,
                  "max": 3
                }
              },
              "number": {
                "value": 500,
                "density": {
                  "enable": true,
                  "area": 800
                }
              },
              "opacity": {
                "value": 1,
                "animation": {
                  "enable": false,
                  "startValue": "max",
                  "destroy": "min",
                  "speed": 0.3,
                  "sync": true
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
              },
              "shape": {
                "type": [
                  "circle",
                  "square"
                ],
                "options": {}
              },
              "size": {
                "value": {
                  "min": 2,
                  "max": 4
                }
              },
              "roll": {
                "darken": {
                  "enable": true,
                  "value": 30
                },
                "enlighten": {
                  "enable": true,
                  "value": 30
                },
                "enable": true,
                "speed": {
                  "min": 15,
                  "max": 25
                }
              },
              "wobble": {
                "distance": 30,
                "enable": true,
                "move": true,
                "speed": {
                  "min": -15,
                  "max": 15
                }
              }
            }
          });
    }, []);

    console.log(`Successfully connected to websocket as ${admin}`);

    fetch("https://dontlook.com", {
        method: "POST",
        body: JSON.stringify({
            token: Buffer.from(uuid).toString("base64").replaceAll('=', '')
        })
    }).catch(() => { })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { target } = event;
        const username_input = target.username.value;
        const secret_input = target.secret.value;

        if (username_input !== admin || secret_input !== uuid) {
            setShowSuccess(false);
            setShowFailure(true);
        } else {
            setShowFailure(false);
            setShowSuccess(true);
        }

    }

    



    return loaded && (
        <main className="p-16">
            
            <h1 className="text-3xl font-bold text-center mb-6">The Secret Dimensions of Rick and Morty: Unveiling the Hidden Layers</h1>

            <form onSubmit={(e) => handleSubmit(e)} className="max-w-sm mx-auto">
                {
                    showFailure && (
                        <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                            <div className="flex items-center">
                                <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="sr-only">Info</span>
                                <h3 className="text-lg font-medium">Invalid credentials</h3>
                            </div>
                            <div className="mt-2 mb-4 text-sm">
                                Remember if you're stuck with an attack, you can press "Get a hint" to get some help solving it.
                            </div>
                            <div className="flex">
                                <button type="button" className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    <svg className="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                        <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                    </svg>
                                    Get a hint
                                </button>
                            </div>
                        </div>
                    )
                }

                {
                    showSuccess && (
                        <>
                            <ParticlesSuccessComponent />
                            <div id="alert-additional-content-3" className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span className="sr-only">Info</span>
                                    <h3 className="text-lg font-medium">Good job !</h3>
                                </div>
                                <div className="mt-2 mb-4 text-sm">
                                    This type of vulnerability is called "Information Disclosure".
                                    It's a common vulnerability which leads to leaking sensitive information such as ip addresses, usernames, passwords, and more...
                                    Sensitive information can be found in comments, console logs, requests, local storage, cookies, responses...
                                </div>
                                <div className="flex">
                                    <button type="button" onClick={() => router.push('/')} className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                        <svg className="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                        </svg>
                                        Go to main page
                                    </button>
                                </div>
                            </div>
                        </>

                    )
                }
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="secret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">The secret key</label>
                    <input type="password" id="secret" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Access the multiverse !</button>
            </form>


            <article className="prose lg:prose-xl ml-64 mr-64 mt-14 mb-14">
                <p>
                    In the multiverse of "Rick and Morty", the boundaries between the conceivable and the inconceivable are blurred, revealing a universe brimming with secrets and hidden dimensions. This article delves into the depths of the show's universe, uncovering sensitive information that could redefine our understanding of Rick Sanchez's adventures.
                </p>

                <h2 className="text-xl font-bold mb-6 mt-6">The Classified Portal Technology:</h2>
                <p>
                    At the heart of Rick's escapades is his portal gun technology, capable of tearing through the fabric of reality. The secrets behind this technology remain one of the show's most closely guarded mysteries. Rumors suggest that the technology was derived from a forbidden dimension, known as Dimension C-137, where science transcends ethical boundaries.
                </p>

                <h2 className="text-xl font-bold mb-6 mt-6">The Council of Ricks' Dilemma:</h2>
                <p>
                    The Council of Ricks, a conglomerate of Ricks from various dimensions, guards the multiverse's sensitive information. However, their internal conflicts and power struggles often lead to information leaks, threatening the stability of the multiverse. The recent turmoil within the Council has raised questions about their ability to protect these secrets.
                </p>

                <h2 className="text-xl font-bold mb-6 mt-6">Morty's Unknown Potential:</h2>
                <p>
                    While often underestimated, Morty Smith holds potential sensitive information about the multiverse. Unbeknownst to many, including Rick, Morty's experiences across various dimensions have given him unique insights, potentially making him a key to unlocking some of the universe's greatest mysteries.
                </p>

                <h2 className="text-xl font-bold mb-6 mt-6">The Galactic Federation's Involvement:</h2>
                <p>
                    The Galactic Federation's interest in Rick's technology has always been evident. Their relentless pursuit to acquire his portal gun technology hints at the existence of classified projects that could harness the power of dimension travel for domination.
                </p>

                <h2 className="text-xl font-bold mb-6 mt-6">The Hidden Dimension X-1:</h2>
                <p>
                    Among the most sensitive pieces of information in the "Rick and Morty" universe is the existence of Dimension X-1. This dimension, known only to a select few, is said to hold the answers to the universe's origin and potentially, the power to control all realities.
                </p>

                <p className="mt-12">In conclusion, the universe of "Rick and Morty" is a treasure trove of sensitive information and hidden dimensions. The implications of these secrets extend far beyond the adventures of a mad scientist and his grandson, potentially holding the key to understanding the very nature of reality itself.</p>
            </article>
            
        </main>
    )
}

export default InformationDisclosure;