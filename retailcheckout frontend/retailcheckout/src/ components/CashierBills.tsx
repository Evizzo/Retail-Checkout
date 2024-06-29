import React, { useEffect, useState } from 'react';
import { Table, Container, Alert, Button } from 'react-bootstrap';
import { executeFindBillsByUserId } from '../api/ApiService';
import { Link } from 'react-router-dom';
import { useAuth } from '../api/AuthContex';

interface ArticleDTO {
  articleId: string;
  serialNumber: string;
  articleName: string;
  quantity: number;
  pricePerItem: number;
  fullPrice: number;
  billId: string;
}

interface BillDTO {
  id: string;
  date: string;
  paidBy: string;
  totalPrice: number;
  changeGiven: number;
  amountGivenToCashier: number;
  articles: ArticleDTO[];
  userId: string;
}

const CashierBills: React.FC = () => {
  const [bills, setBills] = useState<BillDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const authContext = useAuth();

  useEffect(() => {
    async function fetchBills() {
      try {
        const response = await executeFindBillsByUserId();
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills. Please try again later.');
      }
    }

    fetchBills();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{authContext.username} Bills</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Date</th>
            <th>Paid By</th>
            <th>Total Price</th>
            <th>Change Given</th>
            <th>Amount Given To Cashier</th>
            <th>Articles</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{new Date(bill.date).toLocaleString()}</td>
              <td>{bill.paidBy}</td>
              <td>{bill.totalPrice.toFixed(2)}</td>
              <td>{bill.changeGiven.toFixed(2)}</td>
              <td>{bill.amountGivenToCashier.toFixed(2)}</td>
              <td>
                <ul>
                  {bill.articles.map((article) => (
                    <li key={article.articleId}>
                      <strong>{article.articleName}</strong> (x{article.quantity}): ${article.fullPrice.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    <Link to="/create-bill">
        <Button variant="secondary">
            Go to retail checkout
        </Button>
    </Link>
    </Container>
  );
};

export default CashierBills;