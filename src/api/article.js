import { fetch } from 'utils/fetch';

export function getList() {
  return fetch({
    url: '/article/list',
    method: 'POST'
  });
}

export function getArticle() {
  return fetch({
    url: '/article/detail',
    method: 'get'
  });
}

