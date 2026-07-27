// components/ScrollToTop.tsx
import { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.scss";
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll position ကို စစ်ဆေးမယ့် function
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // အပေါ်ကို ဖြည်းဖြည်းချင်း ပြန်တက်မယ့် function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Component ပျက်သွားတဲ့အခါ Event listener ကို ဖျက်ပေးဖို့လိုပါတယ်
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={styles.scrollBtn}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
