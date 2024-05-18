import { Link } from 'react-router-dom';

export const metadata = {
  title: 'Home | Next.js + TypeScript Example',
};

export default function PaywithFiat(): JSX.Element {
  return (
    <ul className="card-list">
      <li>
        <Link
          to="/Deploy-with-embedded-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Deploy with embedded Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          to="/Deploy-with-checkout"
          className="card checkout-style-background"
        >
          <h2 className="bottom">Deploy with hosted Checkout</h2>
          <img src="/checkout-one-time-payments.svg" />
        </Link>
      </li>
      <li>
        <Link
          to="/Deploy-with-elements"
          className="card elements-style-background"
        >
          <h2 className="bottom">Deploy with Elements</h2>
          <img src="/elements-card-payment.svg" />
        </Link>
      </li>
    </ul>
  );
}
