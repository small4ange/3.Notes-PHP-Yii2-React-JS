const now = new Date();
import logo from '/logo.svg';
export default function Header() {
    return (
      <header>
        <img src={logo} alt={'Notes'} />
        <h3>Notes</h3>
        <span>Profile: {now.toLocaleTimeString()}</span>
      </header>
    )
  }