import { Link } from 'react-router-dom';

export const metadata = {
  title: 'Home | Next.js + TypeScript Example',
};

export default function IndexPage(): JSX.Element {
  return (
    <ul className="card-list">
      <li>
        <Link
          to="/donate-with-embedded-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Donate with embedded Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          to="/donate-with-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Donate with hosted Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          to="/donate-with-elements"
          className="card elements-style-background"
        >
          <h2 className="bottom">Donate with Elements</h2>
          <img src="/elements-card-payment.svg" />
        </Link>
      </li>
    </ul>
  );
}
