import { staticEndpoints } from 'utils/endPoints';
import pkg from '../../package.json'

export function lsSet(key: string, value: any) {
  return localStorage.setItem(`${pkg.name}.${key}`, JSON.stringify(value));
}

export function lsGet(key: string, fallback?: any) {
  const item = localStorage.getItem(`${pkg.name}.${key}`);
  return jsonParse(item, fallback);
}

export function lsRemove(key: string) {
  return localStorage.removeItem(`${pkg.name}.${key}`);
}


export function shortenAddress(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === 'number') limit = key;
  if (key === 'symbol') limit = 6;
  if (key === 'name') limit = 64;
  if (key === 'choice') limit = 12;
  if (limit)
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function jsonParse(input, fallback?) {
  if (typeof input !== 'string') {
    return fallback || {};
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || {};
  }
}

export function filterProposals(space, proposal, tab) {
  const ts = (Date.now() / 1e3).toFixed();
  const members = space.members.map(address => address.toLowerCase());
  const author = proposal[1].address.toLowerCase();
  const isMember = members.includes(author);
  const start = proposal[1].msg.payload.start;
  const end = proposal[1].msg.payload.end;

  if (!isMember && proposal[1].score < space.filters.minScore) return false;
  if (space.filters.onlyMembers && !isMember) return false;

  if (tab === 'all') return true;
  if (tab === 'active' && start <= ts && end > ts) return true;
  if (tab === 'core' && isMember) return true;
  if (tab === 'community' && !isMember) return true;
  if (tab === 'closed' && end <= ts) return true;
  if (tab === 'pending' && start > ts) return true;

  return false;
}



export function getNumberWithOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function calcFromSeconds(value, unit) {
  if (unit === 'm') return Math.floor(value / 60);
  if (unit === 'h') return Math.floor(value / (60 * 60));
  if (unit === 'd') return Math.floor(value / (60 * 60 * 24));
}

export function calcToSeconds(value, unit) {
  if (unit === 'm') return value * 60;
  if (unit === 'h') return value * 60 * 60;
  if (unit === 'd') return value * 60 * 60 * 24;
}

export function mapOldPluginNames(space) {
  // The Dao Module has been renamed to SafeSnap
  // Previous spaces plugins have to be renamed
  if (space.plugins?.daoModule) {
    space.plugins.safeSnap = space.plugins.daoModule;
    delete space.plugins.daoModule;
  }

  return space;
}

export function explorerUrl(network, str: string, type = 'address'): string {
  return `${'https://algoexplorer.io'}/${type}/${str}`;
}


export const gateways =[
    'https://xballot-testnet.infura-ipfs.io'
]

export function getUrl(uri, gateway = gateways[0]) {
    const ipfsGateway = `https://${gateway}`;
    if (!uri) return null;
    if (
      !uri.startsWith('ipfs://') &&
      !uri.startsWith('ipns://') &&
      !uri.startsWith('https://') &&
      !uri.startsWith('http://')
    )
      return `${ipfsGateway}/ipfs/${uri}`;
    const uriScheme = uri.split('://')[0];
    if (uriScheme === 'ipfs')
      return uri.replace('ipfs://', `${ipfsGateway}/ipfs/`);
    if (uriScheme === 'ipns')
      return uri.replace('ipns://', `${ipfsGateway}/ipns/`);
    return uri;
  }

export function getIpfsUrl(url: string) {
  const gateway: any =
    process.env.IPFS_GATEWAY || 'xballot-testnet.infura-ipfs.io';
  return getUrl(url, gateway);
}


export async function clearStampCache(id: string, type = 'space') {
  if (type === 'space')
    return await fetch(`${staticEndpoints.stamp}clear/space/${id}`);

  if (type === 'avatar')
    return await fetch(`${staticEndpoints.stamp}clear/avatar/algo:${id}`);
}

export async function getJSON(uri) {
  const url = getUrl(uri);
  return fetch(url).then((res) => res.json());
}

export function calcPercentageOfSum(
  part: number,
  wholeArray: number[]
): number {
  const whole = wholeArray.reduce((a, b) => a + b, 0);
  const percent = part / whole;
  return isNaN(percent) ? 0 : percent;
}

export function calcSqrt(
  percentageWeight: number,
  votingPower: number
): number {
  return Math.sqrt(percentageWeight * votingPower);
}

export function calcSquare(num: number): number {
  return num * num;
}

export function calcReducedQuadraticScores(
  percentages: number[],
  scoresTotal: number
): number[] {
  // Reduce each quadratic score so that the sum of quadratic scores matches
  // the total scores.
  // This is done to unsure that features like quorum still work as expected.
  return percentages.map((p) => scoresTotal * p);
}

export const ordinalSuffix = (i) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return '(' + i + 'st)';
  }
  if (j === 2 && k !== 12) {
    return '(' + i + 'nd)';
  }
  if (j === 3 && k !== 13) {
    return '(' + i + 'rd)';
  }
  return '(' + i + 'th)';
};