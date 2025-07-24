import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; 

import Button from "../Button";

function ScrollToTopButton({ scrollHight = 200, scrollContainer = window }) {
    
    const [btnOnTop, setBtnOnTop] = useState(false);

    const handleScrollToTop = () => {
        const target = scrollContainer === window ? window : scrollContainer.current;
        target.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const container = scrollContainer === window ? window : scrollContainer.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollY = container === window ? window.scrollY : container.scrollTop;
            setBtnOnTop(scrollY > scrollHight);
        };

        container.addEventListener("scroll", handleScroll);

        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollContainer, scrollHight]);

    return btnOnTop && (
        <Button
            primary
            onClick={handleScrollToTop}
            className="group fixed bottom-20 right-10 w-14 h-14 rounded-full"
        >
            <ArrowUp className="group-hover:-translate-y-1 transition" />
        </Button>
    );
};

export default ScrollToTopButton;
