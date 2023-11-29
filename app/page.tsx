import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <main className="w-full bg-slate-800 h-screen sm:h-auto py-10">
            <div className="flex flex-wrap max-w-7xl mx-10 xl:mx-auto">
                <div className=" xl:w-2/5 flex flex-col justify-center mx-auto">
                    <h1 className="text-3xl sm:text-5xl font-bold">
                        Welcome to{" "}
                        <span className="text-blue-500">Upload.</span>
                    </h1>
                    <h3 className="text-xl sm:text-3xl font-bold pb-5">
                        Storing everything for you, all in one place.
                    </h3>

                    <p className="pb-10 sm:pb-20 text-sm sm:text-xl font-sans">
                        Enhance your workflow with our cloud storage solutions.
                        From sharing <br />
                        files with colleagues and friends to storing all your
                        important <br />
                        documents in one place, Upload has you covered.
                    </p>

                    <Link
                        href="/dashboard"
                        className="w-36 sm:w-48 text-sm sm:text-xl transition-colors py-2 px-3 sm:p-5 bg-blue-500 hover:bg-blue-600 font-bold"
                    >
                        Try for free!
                        <ArrowRightIcon className="inline-block ml-2" />
                    </Link>
                </div>
                <div className="bg-[#1E1919] dark:bg-slate-800 py-10 sm:px-10 w-full sm:w-[700px] mx-auto">
                    <video autoPlay loop muted className="rounded-lg">
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
                    </video>
                </div>
            </div>
        </main>
    );
}
