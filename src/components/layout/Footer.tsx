import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import logo from "../../../public/images/footerlogo.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
      <Image src={logo} width={51} height={40} alt="header logo" />
        <span className={styles.logoText}>建工管理</span>
      </div>

      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.columnTitle}>サービス区分</div>
          <ul className={styles.list}>
            <li>現場管理</li>
            <li>販売管理</li>
            <li>勤務管理</li>
          </ul>
        </div>

        <div className={styles.column}>
          <div className={styles.columnTitle}>お問い合わせ</div>
          <ul className={styles.list}>
            <li>お電話（052-228-3646）</li>
            <li>受付時間：平日9:30〜17:30</li>
          </ul>
        </div>
      </div>

      <div className={styles.copyright}>
        &copy;growthchangeLtd. All Rights Reserved.
      </div>
    </footer>
  );
}
