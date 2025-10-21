"use client";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function Privacy() {
  return (
        <div className="flex flex-col justify-between">
            <Header activePath={""} />

            <main className="flex flex-col px-0 h-full flex-1">

                <section className="w-full bg-colour-primary py-20">
                    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 text-center text-white gap-5">
                        <h2 className="text-4xl font-bold mb-6 text-green-400">
                            Privacy Policy
                        </h2>

                        <p>
                            At TrailRunners, we are dedicated to protecting your privacy. 
                            This Privacy Policy outlines how we collect, use, and safeguard your personal information 
                            when you use our application. By using TrailRunners, you agree to the terms of this Privacy Policy.
                        </p>

                        <h3 className="text-2xl font-semibold mt-6">1. Information We Collect:</h3>
                        <p> 
                            TrailRunners will prompt users to provide and upload GPX and LiDAR files, only for the 
                            purpose of trail analysis and visualization. We do not collect any personally identifiable information, or store 
                            any files on our servers. All file processing is done on the server, and sent back to the user&apos;s browser for viewing.
                            No information will be kept or shared with third parties.
                        </p>

                        <h3 className="text-2xl font-semibold mt-6">2. Use of Information:</h3>
                        <p>
                            The GPX and LiDAR files you upload are used solely for the purpose of analyzing and visualizing trail data within the 
                            TrailRunners application. We do not use this information for any other purposes.
                        </p>

                        <h3 className="text-2xl font-semibold mt-6">3. Data Security:</h3>
                        <p>
                            We implement appropriate security measures to protect your data during transmission and processing. 
                            However, please be aware that no method of transmission over the internet is fully secure.
                        </p>

                        <h3 className="text-2xl font-semibold mt-6">4. User Accounts:</h3>
                        <p>
                            We will not ask users to create accounts or provide login information. All features of TrailRunners are accessible without
                            the need for user accounts. If any &quot;TrailRunners&quot; website asks for account creations or details, please report it to us immediately - 
                            we will never ask for this information.
                        </p>


                        <h3 className="text-2xl font-semibold mt-6">5. Changes to This Privacy Policy:</h3>
                        <p>
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page.
                        </p>


                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}