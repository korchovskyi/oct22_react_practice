/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

interface User {
  id: number,
  name: string,
  sex: string,
}

const getCategory = (categoryId: number) => {
  return categoriesFromServer.find(category => (
    category.id === categoryId
  )) as Category;
};

const getUser = (userId: number) => {
  return usersFromServer.find(user => user.id === userId) as User;
};

const productsCategory = productsFromServer.map(product => {
  return {
    ...product,
    category: getCategory(product.categoryId),
  };
});

const allProducts = productsCategory.map(product => {
  return {
    ...product,
    user: getUser(product.category?.ownerId),
    category: getCategory(product.categoryId),
  };
});

export const App: React.FC = () => {
  const [products] = useState(allProducts);
  const [filterBy, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const productsFilter = () => {
    const newQuery = query.toLowerCase().trim();

    return products.filter(product => {
      if (filterBy === 'All') {
        return product?.name.toLowerCase().includes(newQuery);
      }

      return product?.user.name === filterBy
        && product?.name.toLowerCase().includes(newQuery);
    });
  };

  const visibleProducts = productsFilter();

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn(
                  { 'is-active': filterBy === 'All' },
                )}
                onClick={() => setFilter('All')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn(
                    { 'is-active': filterBy === user.name },
                  )}
                  onClick={() => setFilter(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.currentTarget.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setFilter('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length > 0
            ? (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map(product => (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product?.id}
                      </td>
                      <td data-cy="ProductName">{product?.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product?.category.icon} - ${product?.category.title}`}
                      </td>
                      <td
                        data-cy="ProductUser"
                        className={cn(
                          { 'has-text-link': product?.user.sex === 'm' },
                          { 'has-text-danger': product?.user.sex === 'f' },
                        )}
                      >
                        {product?.user.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
