import React, { ReactNode, useState } from "react";
import styles from "./Layout.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import SearchModal from "../modals/SearchModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <Header onMenuClick={toggleMenu} />

        <div className={styles.bodyWrapper}>
          <Sidebar
            isOpen={isMenuOpen}
            onClose={toggleMenu}
            onSearchFocus={openSearchModal}
          />
          <main className={styles.mainContent}>{children}</main>
        </div>

        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu}></div>
        )}
        <Footer />
      </div>

      {/* Search Modal Component */}
      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </>
  );
}
