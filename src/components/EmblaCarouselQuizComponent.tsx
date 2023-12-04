import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, {
    EmblaCarouselType,
    EmblaOptionsType
} from 'embla-carousel-react'
import { ChallengeCarouselType } from '@/types/ChallengeType'
import { QuizType } from '@/types/QuizType'

const EmblaCarouselQuiz = ({ options, quizz }: { options: EmblaOptionsType, quizz: QuizType[] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const [scrollProgress, setScrollProgress] = useState(0)

    const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
        const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
        setScrollProgress(progress * 100)
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onScroll(emblaApi)
        emblaApi.on('reInit', onScroll)
        emblaApi.on('scroll', onScroll)
    }, [emblaApi, onScroll])

    return (
        <>
            <h2 className='text-center mb-5 text-2xl'>Quizzes</h2>
            <div className="embla dark:bg-indigo-700 bg-blue-400">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container mt-5 mb-5">
                        {quizz.map((quiz) => (
                            <div className="embla__slide hover:cursor-pointer" key={quiz.id}>

                                <img
                                    className="embla__slide__img rounded-xl hover:rounded-none transition-all hover:scale-105 duration-700"
                                    src={quiz.image != null ? `/avatars/code.jpg` : "/avatars/null.jpg"}
                                    alt="Your alt text"
                                />
                                <div className="text-center">
                                    <span>{quiz.name}</span>
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

export default EmblaCarouselQuiz;