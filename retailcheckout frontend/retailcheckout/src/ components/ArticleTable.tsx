import React, { useState, useMemo } from 'react';
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
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'ascending' | 'descending' } | null>(null);

  const sortedArticles = useMemo(() => {
    let sortableArticles = [...articles];
    if (sortConfig !== null) {
      sortableArticles.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Article];
        const bValue = b[sortConfig.key as keyof Article];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortableArticles;
  }, [articles, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Table striped bordered hover className="custom-table">
      <thead className="thead-dark">
        <tr>
          <th>#</th>
          <th onClick={() => requestSort('serialNumber')}>Serial Number</th>
          <th onClick={() => requestSort('articleName')}>Article Name</th>
          <th onClick={() => requestSort('quantity')}>Quantity</th>
          <th onClick={() => requestSort('pricePerItem')}>Price per item</th>
          <th onClick={() => requestSort('quantity')}>Total price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedArticles.map((article, index) => (
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
