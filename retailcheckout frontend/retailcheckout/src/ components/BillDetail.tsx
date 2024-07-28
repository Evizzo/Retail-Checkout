import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import { executeFindBillById, executeRefundArticle, executeCancelBill } from '../api/ApiService';
import { Link } from 'react-router-dom';

function BillDetail() {
  const { billId } = useParams<{ billId: string }>();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const handleRefund = async (articleId: string) => {
    setActionLoading(true);
    try {
      await executeRefundArticle(billId, articleId);
      setBill((prevBill: any) => ({
        ...prevBill,
        articles: prevBill.articles.filter((article: any) => article.articleId !== articleId),
      }));
      setActionLoading(false);
    } catch (err) {
      setError('Failed to refund article. Please try again later.');
      setActionLoading(false);
    }
  };

  const handleCancelBill = async () => {
    setActionLoading(true);
    try {
      await executeCancelBill(billId);
      navigate('/cashiers-bills');
    } catch (err) {
      setError('Failed to cancel the bill. Please try again later.');
      setActionLoading(false);
    }
  };

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
      <p>Amount paid with points: ${bill.paidWithPoints.toFixed(2)}</p>
      <p>Amount paid with cash: ${bill.cashAmount.toFixed(2)}</p>
      <p>Amount paid with card: ${bill.cardAmount.toFixed(2)}</p>
      <p>Refunded Amount: ${bill.refundedAmount.toFixed(2)}</p>
      <p>Code used: {bill.codeUsed}</p>
      <h3>Articles</h3>
      <ul>
        {bill.articles.map((article: any) => (
          <li key={article.articleId}>
            <strong>{article.articleName}</strong> (x{article.quantity}): ${article.fullPrice.toFixed(2)}
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => handleRefund(article.articleId)}
              disabled={actionLoading}
              className="ml-2"
            >
              Refund
            </Button>
          </li>
        ))}
      </ul>
      <Button 
        variant="danger" 
        onClick={handleCancelBill}
        disabled={actionLoading}
        className="mt-3"
      >
        Cancel Bill
      </Button>
      <br></br>
      <hr></hr>
      <br></br>
      <Link to="/cashiers-bills">
        <Button variant="secondary" className="mt-3 ml-2">
          Go to bills
        </Button>
      </Link>
    </Container>
  );
}

export default BillDetail;
