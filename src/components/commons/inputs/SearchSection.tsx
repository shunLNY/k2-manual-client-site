import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./SearchSection.module.scss";

export default function SearchSection() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>御困りごとはなんですか？</h1>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <input
          type="text"
          placeholder="例）案件の登録、工程表の作成"
          className={styles.input}
        />
      </div>
    </div>
  );
}
