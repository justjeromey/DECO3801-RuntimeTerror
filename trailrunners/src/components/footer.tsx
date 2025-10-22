import Link from "next/link";

const Footer = () => {

    return (
        <footer className="p-2 py-3 flex flex-col items-center justify-center gap-5">
            <p>Made with ❤️ by Runtime Terrors</p>
            <Link 
                href="/privacy" 
                className="underline"
            >
                Privacy Policy
            </Link>      


        </footer>
    );
}

export default Footer;
