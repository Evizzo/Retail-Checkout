import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { executeFindBillById } from '../api/ApiService';
import { Link } from 'react-router-dom';

function BillDetail() {
  const { billId } = useParams<{ billId: string }>();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!billId) return;

    async function fetchBill() {
      try {
        const response = await executeFindBillById(billId);
        setBill(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bill details. Please try again later.');
        setLoading(false);
      }
    }

    fetchBill();
  }, [billId]);

  if (!billId) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Bill ID not provided.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!bill) {
    return null;
  }

  return (
    <Container className="mt-5">
      <h1>Bill Details</h1>
      <p>Bill ID: {bill.id}</p>
      <p>Date: {new Date(bill.date).toLocaleString()}</p>
      <p>Paid By: {bill.paidBy}</p>
      <p>Total Price: ${bill.totalPrice.toFixed(2)}</p>
      <p>Change Given: ${bill.changeGiven.toFixed(2)}</p>
      <p>Amount Given To Cashier: ${bill.amountGivenToCashier.toFixed(2)}</p>
      <h3>Articles</h3>
      <ul>
        {bill.articles.map((article: any) => (
          <li key={article.articleId}>
            <strong>{article.articleName}</strong> (x{article.quantity}): ${article.fullPrice.toFixed(2)}
          </li>
        ))}
      </ul>
      <Link to="/cashiers-bills">
        <Button variant="secondary">
          Go to bills
        </Button>
      </Link>
    </Container>
  );
}

export default BillDetail;
