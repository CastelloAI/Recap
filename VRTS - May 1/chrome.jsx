// Persistent chrome — sticky header + scroll progress hairline

const { useRef: cUseRef } = React;

function Chrome({ dark }) {
  const docP = useDocProgress();
  return (
    <div className={"chrome" + (dark ? " dark" : "")}>
      <div className="chrome-row">
        <span className="ticker">VRTS</span>
        <span className="name">Virtus Investment Partners</span>
        <span className="label">Recap · FY ’24</span>
      </div>
      <div className="progress" style={{ width: (docP * 100).toFixed(2) + '%' }} />
    </div>
  );
}

// little eyebrow component
function Eyebrow({ num, children }) {
  return (
    <div className="eyebrow">
      <span className="num">{num}</span>
      <span className="dot" />
      <span>{children}</span>
    </div>
  );
}

// reset beat — italic editorial interlude
function Reset({ tone = "raised", children }) {
  const cls = "reset" + (tone === "deep" ? " deep" : tone === "night" ? " night" : "");
  return (
    <div className={cls}>
      <p>{children}</p>
    </div>
  );
}

Object.assign(window, { Chrome, Eyebrow, Reset });
