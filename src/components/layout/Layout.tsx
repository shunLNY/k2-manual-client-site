import React, { ReactNode, useState } from "react";
import styles from "./Layout.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={styles.container}>
        <Header onMenuClick={toggleMenu} />

        <div className={styles.bodyWrapper}>
          <Sidebar isOpen={isMenuOpen} onClose={toggleMenu} />
          <main className={styles.mainContent}>{children}</main>
        </div>

        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu}></div>
        )}
        <Footer />
      </div>
    </>
  );
}
