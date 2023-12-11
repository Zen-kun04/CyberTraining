import NavbarComponent from "@/components/NavbarComponent";

const LegalPage = () => {
    return (
        <main>
            <NavbarComponent page="home" />
            <div className="mx-auto w-1/2">


                <h1 className="text-xl font-bold mt-6 text-center">Terms of Service for Cyber Training</h1>
                <p className="mt-4">Last Updated: 04/12/2023</p>

                <section className="mt-6 flex flex-col gap-7">
                    <div>
                        <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
                        <p>Welcome to Cyber Training. By accessing our website, you agree to these Terms of Service and our Privacy Policy.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">2. Description of Service</h2>
                        <p>Cyber Training provides free educational resources on web cybersecurity. Services are provided "as is" without any warranties.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">3. User Obligations</h2>
                        <p>Users must use the service for lawful purposes only and respect copyright laws.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">4. Intellectual Property</h2>
                        <p>All content on Cyber Training is the property of Cyber Training or its licensors.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">5. Limitation of Liability</h2>
                        <p>Cyber Training will not be liable for any damages resulting from the use of this website.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">6. Amendments to Terms</h2>
                        <p>We reserve the right to modify these terms at any time.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">7. Contact Us</h2>
                        <p>For any questions, please contact us at contact@cyber-training.com.</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">8. Governing Law</h2>
                        <p>These terms shall be governed by the laws of France.</p>
                    </div>

                </section>
            </div>
        </main>
    )
}

export default LegalPage;