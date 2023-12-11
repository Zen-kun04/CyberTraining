import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useContext, useEffect, useState } from 'react'
import NavbarComponent from '@/components/NavbarComponent'
import Head from 'next/head'
import { ChallengeCarouselType } from '@/types/ChallengeType'
import { getAllChallenges, getAllQuiz } from '@/utils/APIUtils'
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'
import EmblaCarouselChallenges from '@/components/EmblaCarouselChallengesComponent'
import EmblaCarouselQuiz from '@/components/EmblaCarouselQuizComponent'
import { QuizType } from '@/types/QuizType'
import UserContext from '@/context/UserContext'

const inter = Inter({ subsets: ['latin'] })

const HomePage = () => {
	// document.title = "CyberTraining - Train yourself to become a pentester"
	const [loaded, setLoaded] = useState(false);
	const [challenges, setChallenges] = useState<ChallengeCarouselType[]>([]);
	const [quiz, setQuiz] = useState<QuizType[]>([]);

	const userContext = useContext(UserContext);
	if(!userContext) {
		throw "You need to envelop the app with UserContext !";
	}

	const {user, setUser} = userContext;

	useEffect(() => {
		getAllChallenges().then((result) => {			
			setChallenges(result);
			setLoaded(true);
		})

		getAllQuiz().then((result) => {
			setQuiz(result);
			setLoaded(true);
		})

	}, [])

	const OPTIONS: EmblaOptionsType = { dragFree: true, slidesToScroll: 3 }
	return (
		<main>
			{
				loaded && (
					<main>
						<Head>
							<title>CyberTraining - Train yourself to become a pentester</title>
						</Head>
						<NavbarComponent page='home' fixed={true} />
						<h1 className='text-center mb-20 mt-28 text-4xl'>Learn and Practice<br />Web Penetration Testing<br />for FREE</h1>
						<section className="sandbox__carousel">
							<EmblaCarouselChallenges options={OPTIONS} challenges={challenges} />
						</section>
						
						<section className="sandbox__carousel mt-40">
							<EmblaCarouselQuiz options={OPTIONS} quizz={quiz} />
						</section>
					</main>

				)
			}

		</main>
	)
}

export default HomePage;