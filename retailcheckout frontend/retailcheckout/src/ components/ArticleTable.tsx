import React from 'react';
import { Table, Button } from 'react-bootstrap';
import '../styles/ArticleTable.css';

export interface Article {
  serialNumber: string;
  articleName: string;
  quantity: number;
  price: number;
}

interface ArticleTableProps {
  articles: Article[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({ articles, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover className="custom-table">
      <thead className="thead-dark">
        <tr>
          <th>#</th>
          <th>Serial Number</th>
          <th>Article Name</th>
          <th>Quantity</th>
          <th>Price</th>
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
            <td>${article.price.toFixed(2)}</td>
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
