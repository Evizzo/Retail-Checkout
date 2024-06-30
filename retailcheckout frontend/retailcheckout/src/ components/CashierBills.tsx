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
  [key: string]: string | number | ArticleDTO[];
}

const CashierBills: React.FC = () => {
  const [bills, setBills] = useState<BillDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);
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

  const sortedBills = React.useMemo(() => {
    let sortableBills = [...bills];
    if (sortConfig !== null) {
      sortableBills.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableBills;
  }, [bills, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Container className="mt-5">
      <h1 className="mb-4">{authContext.username} Bills</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('id')}>Bill ID</th>
            <th onClick={() => requestSort('date')}>Date</th>
            <th onClick={() => requestSort('paidBy')}>Paid By</th>
            <th onClick={() => requestSort('totalPrice')}>Total Price</th>
            <th onClick={() => requestSort('changeGiven')}>Change Given</th>
            <th onClick={() => requestSort('amountGivenToCashier')}>Amount Given To Cashier</th>
            <th>Articles</th>
          </tr>
        </thead>
        <tbody>
          {sortedBills.map((bill) => (
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
