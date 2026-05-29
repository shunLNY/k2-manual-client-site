import React, { useEffect, useRef } from "react";
import styles from "./SearchModal.module.scss";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockResults = [
  {
    id: 1,
    title: "システム管理者ができること",
    description:
      "この記事はテストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。",
  },
  {
    id: 2,
    title: "システム管理者ができること",
    description: "この記事はテストです ... (Truncated)",
  },
  {
    id: 3,
    title: "システム管理者ができること",
    description: "この記事はテストです ... (Truncated)",
  },
];

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={styles.header}>
          {/* Active Search Input */}
          <div className={styles.modalSearchContainer}>
            <svg
              className={styles.modalSearchIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles.modalSearchInput}
              placeholder="Search"
              autoFocus
            />
          </div>

          {/* Categories Dropdown Button */}
          <button className={styles.categoriesButton}>
            <span>Categories</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className={styles.resultsStats}>
            {mockResults.length} results found
          </div>
        </div>

        {/* Modal Body (Results) */}
        <div className={styles.resultsBody}>
          <ul className={styles.resultsList}>
            {mockResults.map((result) => (
              <li key={result.id} className={styles.resultItem}>
                <div className={styles.resultTitle}>{result.title}</div>
                <p className={styles.resultDescription}>{result.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
