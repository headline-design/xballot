import { Form, useLoaderData } from 'react-router-dom';
import { localLinks } from 'utils/constants/common';

export default function LocalLink() {
  const link = useLoaderData();
  // existing code
}

export async function getLinks(query) {
  await fakeNetwork(`getLinks:${query}`);
  let links = await localLinks.getItem('links');
  if (!links) links = [];
  return links;
}

export async function createlink() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let link = { id, createdAt: Date.now() };
  let links = await getLinks();
  links.unshift(link);
  await set(links);
  return link;
}

export async function getlink(id) {
  await fakeNetwork(`link:${id}`);
  let links = await localLinks.getItem('links');
  let link = links.find((link) => link.id === id);
  return link ?? null;
}

export async function updatelink(id, updates) {
  await fakeNetwork();
  let links = await localLinks.getItem('links');
  let link = links.find((link) => link.id === id);
  if (!link) throw new Error('No link found for', id);
  Object.assign(link, updates);
  await set(links);
  return link;
}

export async function deletelink(id) {
  let links = await localLinks.getItem('links');
  let index = links.findIndex((link) => link.id === id);
  if (index > -1) {
    links.splice(index, 1);
    await set(links);
    return true;
  }
  return false;
}

function set(links) {
  return localLinks.setItem('links', links);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
