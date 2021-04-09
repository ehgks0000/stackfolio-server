import { Tag } from './entity/tag.entity';

export default {
  get: {
    ['tags']: {
      operation: {
        description: 'Returns tags lists.',
      },
      response: {
        [200]: {
          description: 'Returns tags lists.',
          type: Tag,
        },
        [400]: { description: 'Tags does not exist' },
      },
    },
  },
  post: {
    ['tags']: {
      operation: {
        description: 'Returns a new Tag',
      },
      response: {
        [200]: {
          description: 'Returns a new Tag',
          type: Tag,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  patch: {},
  delete: {},
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
