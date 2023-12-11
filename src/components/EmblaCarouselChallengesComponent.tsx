import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, {
    EmblaCarouselType,
    EmblaOptionsType
} from 'embla-carousel-react'
import { ChallengeCarouselType } from '@/types/ChallengeType'
import { useRouter } from 'next/router'

const EmblaCarouselChallenges = ({ options, challenges }: { options: EmblaOptionsType, challenges: ChallengeCarouselType[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const [scrollProgress, setScrollProgress] = useState(0)

    const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
        const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
        setScrollProgress(progress * 100)
    }, [])

    useEffect(() => {
        if (!emblaApi) {
          return
        }

        onScroll(emblaApi)
        emblaApi.on('reInit', onScroll)
        emblaApi.on('scroll', onScroll)
    }, [emblaApi, onScroll])

    const router = useRouter();

    return (
        <>
            <h2 className='text-center mb-5 text-2xl'>Challenges</h2>
            <div className="embla dark:bg-indigo-700 bg-blue-400">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container mt-5 mb-5">
                        <div onClick={() => router.push('/challenge/1')} className="embla__slide hover:cursor-pointer" key="1">

                            <img
                                className="embla__slide__img rounded-xl hover:rounded-none transition-all hover:scale-105 duration-700 mx-auto w-full"
                                src={"/challenge/21232f297a57a5a743894a0e4a801fc3.webp"}
                                alt="Admin Login challenge"
                            />
                            <div className="text-center">
                                <span>Admin Login</span>
                            </div>
                        </div>

                        <div onClick={() => router.push('/challenge/2')} className="embla__slide hover:cursor-pointer" key="2">

                            <img
                                className="embla__slide__img rounded-xl hover:rounded-none transition-all hover:scale-105 duration-700 mx-auto w-full"
                                src={"/challenge/3c6e0b8a9c15224a8228b9a98ca1531d.webp"}
                                alt="Multiverse Key challenge"
                            />
                            <div className="text-center">
                                <span>Multiverse Key</span>
                            </div>
                        </div>
                        {challenges.map((challenge) => (
                            <div onClick={() => router.push(`/challenge/${challenge.id}`)} className="embla__slide hover:cursor-pointer" key={challenge.id}>

                                <img
                                    className="embla__slide__img rounded-xl hover:rounded-none transition-all hover:scale-105 duration-700 mx-auto w-full"
                                    src={challenge.image != null ? challenge.image : "/challenge/null.webp"}
                                    alt={`${challenge.title} challenge`}
                                />
                                <div className="text-center">
                                    <span>{challenge.title}</span>
                                </div>
                            </div>
                        )


                        )}
                    </div>
                </div>
                <div className="embla__progress">
                    <div
                        className="embla__progress__bar"
                        style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
                    />
                </div>
            </div>
        </>
    )
}

export default EmblaCarouselChallenges;