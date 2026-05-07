/* Tweaks for the Fox Recap. Lets the user adjust palette mode and signal color,
   plus toggle the broadcast-CRT scanlines and the ON-AIR tally light. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "paletteMode": "newsroom",
  "signalHue": "#C8102E",
  "showScanlines": true,
  "showOnAir": true,
  "scoreboardTone": "amber"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  const root = document.documentElement;

  // Palette mode
  if (t.paletteMode === "newsroom") {
    root.style.setProperty('--news-paper',   '#F2EFE7');
    root.style.setProperty('--news-paper-2', '#E8E4D8');
    root.style.setProperty('--news-ink',     '#0D0C0B');
    root.style.setProperty('--news-line',    '#D8D3C5');
  } else if (t.paletteMode === "studio") {
    // Inverted — dark by default, like a control room
    root.style.setProperty('--news-paper',   '#0F0E0D');
    root.style.setProperty('--news-paper-2', '#1A1917');
    root.style.setProperty('--news-ink',     '#F2EFE7');
    root.style.setProperty('--news-line',    '#2A2826');
    document.body.style.color = '#F2EFE7';
  } else if (t.paletteMode === "ledger") {
    // Cooler, paper-white, more like a financial broadsheet
    root.style.setProperty('--news-paper',   '#FAF8F1');
    root.style.setProperty('--news-paper-2', '#EFECE2');
    root.style.setProperty('--news-ink',     '#161514');
    root.style.setProperty('--news-line',    '#E0DCCE');
  }

  // Signal hue
  root.style.setProperty('--signal', t.signalHue);

  // Scoreboard tone
  if (t.scoreboardTone === 'amber') {
    root.style.setProperty('--score-glow', '#FFB23C');
  } else if (t.scoreboardTone === 'mint') {
    root.style.setProperty('--score-glow', '#7CE0A6');
  } else if (t.scoreboardTone === 'paper') {
    root.style.setProperty('--score-glow', '#F2EFE7');
  }

  // Scanlines
  document.querySelectorAll('.scanlines').forEach(el => {
    el.style.display = t.showScanlines ? '' : 'none';
  });

  // On-air light
  document.querySelectorAll('.on-air').forEach(el => {
    el.style.display = t.showOnAir ? '' : 'none';
  });
}

function App() {
  const { TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakToggle } = window;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Palette">
        <TweakRadio
          label="Mode"
          value={tweaks.paletteMode}
          onChange={(v) => setTweak('paletteMode', v)}
          options={[
            { value: 'newsroom', label: 'Newsroom' },
            { value: 'studio',   label: 'Studio'   },
            { value: 'ledger',   label: 'Ledger'   },
          ]}
        />
        <TweakColor
          label="Signal hue"
          value={tweaks.signalHue}
          onChange={(v) => setTweak('signalHue', v)}
        />
      </TweakSection>

      <TweakSection title="Scoreboard">
        <TweakRadio
          label="Tone"
          value={tweaks.scoreboardTone}
          onChange={(v) => setTweak('scoreboardTone', v)}
          options={[
            { value: 'amber', label: 'Amber' },
            { value: 'mint',  label: 'Mint'  },
            { value: 'paper', label: 'Paper' },
          ]}
        />
      </TweakSection>

      <TweakSection title="Broadcast chrome">
        <TweakToggle
          label="Scanlines"
          value={tweaks.showScanlines}
          onChange={(v) => setTweak('showScanlines', v)}
        />
        <TweakToggle
          label="ON-AIR light"
          value={tweaks.showOnAir}
          onChange={(v) => setTweak('showOnAir', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
root.render(<App />);
