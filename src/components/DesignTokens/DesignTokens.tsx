import React from "react";
import styles from "./DesignTokens.module.scss";

type SwatchProps = {
  label: string;
  className: string;
};

const Swatch: React.FC<SwatchProps> = ({ label, className }) => (
  <div className={styles.swatch}>
    <div className={`${styles.swatchColor} ${className}`} />
    <div className={styles.swatchLabel}>{label}</div>
  </div>
);

export default function DesignTokens() {
  return (
    <div className={styles.root}>
      <h1 className={styles.pageTitle}>Design tokens</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors</h2>
        <div className={styles.swatches}>
          <Swatch label="Brand 700" className={styles.colorBrand700} />
          <Swatch label="Brand 600" className={styles.colorBrand600} />
          <Swatch label="Brand 400" className={styles.colorBrand400} />

          <Swatch label="Link 700" className={styles.colorLink700} />
          <Swatch label="Link 600" className={styles.colorLink600} />

          <Swatch label="Success 700" className={styles.colorSuccess700} />
          <Swatch label="Success 600" className={styles.colorSuccess600} />
          <Swatch label="Success 100" className={styles.colorSuccess100} />

          <Swatch label="Error 700" className={styles.colorError700} />
          <Swatch label="Error 600" className={styles.colorError600} />
          <Swatch label="Error 100" className={styles.colorError100} />

          <Swatch label="Neutral 1000" className={styles.colorNeutral1000} />
          <Swatch label="Neutral 950" className={styles.colorNeutral950} />
          <Swatch label="Neutral 900" className={styles.colorNeutral900} />
          <Swatch label="Neutral 800" className={styles.colorNeutral800} />
          <Swatch label="Neutral 700" className={styles.colorNeutral700} />
          <Swatch label="Neutral 500" className={styles.colorNeutral500} />
          <Swatch label="Neutral 400" className={styles.colorNeutral400} />
          <Swatch label="Neutral 300" className={styles.colorNeutral300} />
          <Swatch label="Neutral 100" className={styles.colorNeutral100} />
          <Swatch label="Neutral 000" className={styles.colorNeutral000} />

          <Swatch label="Tint 90" className={styles.tint90} />
          <Swatch label="Tint 70" className={styles.tint70} />
          <Swatch label="Tint 50" className={styles.tint50} />
          <Swatch label="Tint 30" className={styles.tint30} />
          <Swatch label="Tint 10" className={styles.tint10} />

          <Swatch label="Shade 90" className={styles.shade90} />
          <Swatch label="Shade 70" className={styles.shade70} />
          <Swatch label="Shade 50" className={styles.shade50} />
          <Swatch label="Shade 30" className={styles.shade30} />
          <Swatch label="Shade 10" className={styles.shade10} />

          <Swatch label="Callout surface" className={styles.bgCallout} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.typeGroup}>
          <div className="title-large">Title Large</div>
          <div className="title-medium">Title Medium</div>
          <div className="title-small">Title Small</div>
          <div className="title-small-alt">Title Small Alt</div>
          <div className="title-small-medium">Title Small Medium</div>
        </div>
        <div className={styles.typeGroup}>
          <div className="body-large">Body Large — regular</div>
          <div className="body-large-alt">Body Large Alt — regular</div>
          <div className="body-large-strong">Body Large — strong</div>
          <div className="body-large-strong-alt">Body Large Alt — strong</div>
          <div className="body-medium">Body Medium</div>
          <div className="body-medium-strong">Body Medium — strong</div>
          <div className="body-small">Body Small</div>
          <div className="body-small-strong">Body Small — strong</div>
        </div>
        <div className={styles.typeGroup}>
          <div className="button-text">Button text</div>
          <div className="menu-text">Menu text</div>
          <div className="overline-text">Overline text</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>UI elements</h2>

        <div className={styles.uiGroup}>
          <div className="overline-text">Buttons</div>
          <div className={styles.row}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>Primary</button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>Secondary</button>
            <button className={`${styles.btn} ${styles.btnGhost}`}>Ghost</button>
            <button className={`${styles.btn} ${styles.btnDestructive}`}>Destructive</button>
          </div>
        </div>

        <div className={styles.uiGroup}>
          <div className="overline-text">Links</div>
          <div className={styles.row}>
            <a href="#" className={styles.linkDemo}>Inline link</a>
            <a href="#" className={styles.linkDemo} aria-disabled>
              Disabled link
            </a>
          </div>
        </div>

        <div className={styles.uiGroup}>
          <div className="overline-text">Form controls</div>
          <div className={styles.row}>
            <input className={styles.input} placeholder="Input placeholder" />
            <input className={`${styles.input} ${styles.inputInvalid}`} placeholder="Invalid state" />
            <select className={styles.input} defaultValue="">
              <option value="" disabled>
                Select option
              </option>
              <option>Option A</option>
              <option>Option B</option>
            </select>
          </div>
          <div className={styles.row}>
            <textarea className={styles.textarea} placeholder="Textarea..." rows={3} />
          </div>
        </div>

        <div className={styles.uiGroup}>
          <div className="overline-text">Code block</div>
          <pre className={styles.codeBlock}><code>{`// example
function greet(name: string) {
  return \`Hello!\`;
}`}</code></pre>
        </div>

        <div className={styles.uiGroup}>
          <div className="overline-text">Lists and tables</div>
          <div className={styles.rowGrid}>
            <ul className={styles.listDemo}>
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
            <table className={styles.tableDemo}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ada</td>
                  <td>Engineer</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>Active</span>
                  </td>
                </tr>
                <tr>
                  <td>Linus</td>
                  <td>Maintainer</td>
                  <td>
                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.uiGroup}>
          <div className="overline-text">Callouts</div>
          <div className={styles.rowColumn}>
            <div className={`${styles.callout} ${styles.calloutInfo}`}>
              <strong>Note:</strong> This is an informational callout surface.
            </div>
            <div className={`${styles.callout} ${styles.calloutSuccess}`}>
              <strong>Success:</strong> Your changes have been saved.
            </div>
            <div className={`${styles.callout} ${styles.calloutError}`}>
              <strong>Error:</strong> Something went wrong. Try again.
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing</h2>
        <div className={styles.spacingList}>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space1}`} />
            <span className={styles.spaceLabel}>$spacing-1</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space2}`} />
            <span className={styles.spaceLabel}>$spacing-2</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space3}`} />
            <span className={styles.spaceLabel}>$spacing-3</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space4}`} />
            <span className={styles.spaceLabel}>$spacing-4</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space6}`} />
            <span className={styles.spaceLabel}>$spacing-6</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space8}`} />
            <span className={styles.spaceLabel}>$spacing-8</span>
          </div>
          <div className={styles.spaceItem}>
            <div className={`${styles.spaceToken} ${styles.space16}`} />
            <span className={styles.spaceLabel}>$spacing-16</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radius</h2>
        <div className={styles.tokensRow}>
          <div className={`${styles.boxToken} ${styles.radiusSm}`}>$border-radius-sm</div>
          <div className={`${styles.boxToken} ${styles.radius}`}>$border-radius</div>
          <div className={`${styles.boxToken} ${styles.radiusLg}`}>$border-radius-lg</div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shadows</h2>
        <div className={styles.tokensRow}>
          <div className={`${styles.boxToken} ${styles.shadowSm}`}>$shadow-sm</div>
          <div className={`${styles.boxToken} ${styles.shadow}`}>$shadow</div>
          <div className={`${styles.boxToken} ${styles.shadowLg}`}>$shadow-lg</div>
        </div>
      </section>
    </div>
  );
}


