

import ElementsForm from '../../components/ElementsForm';

export const metadata = {
  title: 'Deploy with Elements',
};

export default function PaymentElementPage({
  searchParams,
}: {
  searchParams?: { payment_intent_client_secret?: string };
}): JSX.Element {
  return (
    <div className="page-container">
      <h1>Deploy with Elements</h1>
      <p>Deploy to our project 💖</p>
      <ElementsForm />
    </div>
  );
}
