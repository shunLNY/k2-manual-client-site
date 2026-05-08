import React from "react";
import Image from "next/image";
import styles from "./ArticleDetail.module.scss";
import image from "../../../public/images/unsplash.png";
// import contractimage from "../../../public/images/credit_contract.png";

export default function ArticleDetail() {
  const mockSummernoteHTML = `
    <h2>契約プランを確認、変更する</h2>
    <p>ご契約中のプランを確認、プランの変更ができます。<br/>
    <span style="font-size: 12px; color: #666;">※プラン変更は、アップグレードのみ可能です。<br/>
    ※プランの変更には、クレジットカード等のお支払い方法の設定が必要です。</span></p>
    
    <ol>
      <li>
        ご契約内容画面にある「プラン変更」をクリックし、プラン詳細画面に移動します。
        <img src="../images/credit_contract.png" alt="Step 1 Screenshot" />
      </li>
      <li>
        変更したいプランを選択し、「ご契約画面へ進む」をクリックします。
      </li>
    </ol>
  `;

  return (
    <div className={styles.container}>
      {/* 1. Breadcrumb */}
      <div className={styles.breadcrumb}>
        Help Center &gt; Reference &gt; Category 3 &gt; Sub Category 1 &gt;{" "}
        <span>Article 001</span>
      </div>

      {/* 2. Main Title */}
      <h1 className={styles.mainTitle}>システム管理者ができること</h1>

      {/* 3. Hero Image */}
      <div className={styles.heroImageWrapper}>
        <Image src={image} alt="" className={styles.image} />
      </div>

      <div className={styles.bgcolor}>
        {/* 4. Summary Box */}
        <div className={styles.summarySection}>
          <div className={styles.summaryLeft}>
            <div className={styles.summaryLabel}>この記事では</div>
            <div className={styles.summaryText}>
              この記事はテストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。テストです。
            </div>
          </div>
          <div className={styles.summaryRight}>
            <div className={styles.summaryLabel}>カテゴリー</div>
            <div className={styles.tag}>リリース</div>
          </div>
        </div>

        {/* 5. SummerNote Rich Text Content */}
        <div
          className={styles.summernoteContent}
          dangerouslySetInnerHTML={{ __html: mockSummernoteHTML }}
        />
      </div>
    </div>
  );
}
