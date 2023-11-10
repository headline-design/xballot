import * as Yup from 'yup';
import { create } from 'ipfs-http-client';

export const updateProposalSchema = Yup.object({
  title: Yup.string()
    .min(1, 'Title should be at least 1 characters')
    .max(38, 'Title should not exceed 30 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(10, 'Content should be at least 5 characters')
    .max(500, 'Content should not exceed 14000 characters')
    .required('Content is required'),
  discussion: Yup.string()
    .matches(
      /^https:\/\/www\.[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i,
      'Discussion URL should be in the format https://www.example.com',
    )
    .optional(),
  token: Yup.string()
    .min(3, 'Token should be at least 3 characters')
    .max(18, 'Token should not exceed 18 characters')
    .required('Vote token is required'),
  twitter: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid character')
    .notOneOf(['www', 'http', 'https', '.com'], 'Invalid character')
    .min(4, 'Min. 4 characters')
    .max(25, 'Max 25 characters')
    .optional(),

  terms: Yup.string()
    .matches(
      /^https:\/\/www\.[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i,
      'URL should be in the format https://www.example.com',
    )
    .optional(),
  strategies: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one strategy')
    .max(5, 'You can select a maximum of 5 strategies')
    .optional(),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one category')
    .max(5, 'You can select a maximum of 5 categories')
    .optional(),
  treasuries: Yup.array().of(Yup.string()).max(5, 'You can select a maximum of 5 treasuries'),
  voting: Yup.object().shape({
    delay: Yup.number()
      .min(0, 'Delay cannot be negative')
      .max(7, 'Delay cannot be greater than 7')
      .optional(),
    hideAbstain: Yup.boolean().optional(),
    period: Yup.number()
      .min(1, 'Voting period should be at least 1 day')
      .max(30, 'Voting period cannot be greater than 30 days')
      .optional(),
    quorum: Yup.number()
      .min(0, 'Quorum cannot be negative')
      .max(100, 'Quorum cannot be greater than 100')
      .optional(),
    type: Yup.string().optional(),
    privacy: Yup.string().optional(),
  }),

  symbol: Yup.string()
    .min(2, 'Symbol should contain at least 2 characters')
    .max(5, 'Symbol should not exceed 5 characters')
    .optional(),
});

const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';

export async function uploadRecord(object) {
  try {
    // const client = create(new URL('https://ipfs.infura.io:5001'))
    const auth =
      'Basic ' + Buffer.from(infuraProjectId + ':' + infuraProjectSecret).toString('base64');

    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });

    const returnedData = await client.add(Buffer.from(JSON.stringify(object)));
    console.log('Uploaded Record');
    console.log(returnedData);
    return returnedData;
  } catch (error) {
    console.log(error);
  }
}
