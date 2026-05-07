// Compose the full page in narrative order.
const App = () => (
  <>
    <Hero/>
    <Business/>
    <Costs/>
    <Weight/>
    <Footprint/>
    <Bet/>
    <Competition/>
    <Close/>
  </>
);
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
