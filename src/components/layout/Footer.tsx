"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import logo from "../../../public/images/footerlogo.png";
import Link from "next/link";
import { CategoryNode } from "../../utils/types";

export default function Footer() {
  const [parentCategories, setParentCategories] = useState<CategoryNode[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((response) => {
        const rawData: CategoryNode[] = response && response.data ? response.data : (Array.isArray(response) ? response : []);

        const rootCategories = rawData.filter(c => c.parent_category_id === null);
        setParentCategories(rootCategories);
      })
      .catch((err) => console.error("Error fetching footer categories:", err));
  }, []);

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
            {parentCategories.length > 0 ? (
              parentCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {category.category_name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>no datas</li>
              </>
            )}
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