import { Post } from 'src/posts/entity/post.entity';
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
    ['tags/my/posts']: {
      operation: {
        description: 'Returns posts of my tags.',
      },
      response: {
        [200]: {
          description: 'Returns posts of my tags.',
          type: Post,
        },
        [400]: { description: 'Posts(of my tags) does not exist' },
      },
    },
    ['tags/id']: {
      operation: {
        description: 'Return posts with a tag ID.',
      },
      response: {
        [200]: {
          description: 'Return posts with a tag ID.',
          type: Post,
        },
        [400]: { description: 'Posts(wiht the tag ID) does not exist' },
      },
    },
    ['tags/name']: {
      operation: {
        description: 'Return posts with tag Name',
      },
      response: {
        [200]: {
          description: 'Return posts with tag name',
          type: Post,
        },
        [400]: { description: 'Posts(with tag Name) does not exist' },
      },
    },
  },
  post: {
    ['tags']: {
      operation: {
        description: 'Return Tags',
      },
      response: {
        [200]: {
          description: 'Return Tags',
          type: Tag,
        },
        [400]: { description: 'Error Create Tags' },
      },
    },
  },
  patch: {},
  delete: {},
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
