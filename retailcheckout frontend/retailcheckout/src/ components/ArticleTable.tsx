import React from 'react';
import { Table, Button } from 'react-bootstrap';
import '../styles/ArticleTable.css';

export interface Article {
  serialNumber: string;
  articleName: string;
  quantity: number;
  pricePerItem: number;
  storeArticle: {
    articleName: string;
    serialNumber: string;
    price: number;
    quantityAvailable: number;
  } | null;
}

interface ArticleTableProps {
  articles: Article[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const calculateTotalPrice = (article: Article) => {
  return (article.quantity * article.pricePerItem).toFixed(2);
};

const ArticleTable: React.FC<ArticleTableProps> = ({ articles, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover className="custom-table">
      <thead className="thead-dark">
        <tr>
          <th>#</th>
          <th>Serial Number</th>
          <th>Article Name</th>
          <th>Quantity</th>
          <th>Price per item</th>
          <th>Total price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{article.serialNumber}</td>
            <td>{article.articleName}</td>
            <td>{article.quantity}</td>
            <td>${article.pricePerItem.toFixed(2)}</td>
            <td>${calculateTotalPrice(article)}</td>
            <td>
              <Button variant="info" size="sm" onClick={() => onEdit(index)}>Edit</Button>{' '}
              <Button variant="danger" size="sm" onClick={() => onDelete(index)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ArticleTable;
