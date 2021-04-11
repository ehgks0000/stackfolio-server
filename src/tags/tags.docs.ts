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
    ['tags/posts/user']: {
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
    ['tags/posts']: {
      operation: {
        description: 'Returns posts of tags.',
      },
      response: {
        [200]: {
          description: 'Returns posts of tags.',
          type: Post,
        },
        [400]: { description: 'Posts(of tags) does not exist' },
      },
    },
    ['tags/name']: {
      operation: {
        description: "Returns posts of tag's name.",
      },
      response: {
        [200]: {
          description: "Returns posts of tag's name.",
          type: Post,
        },
        [400]: { description: "Posts(of tag's name) does not exist" },
      },
    },
  },
  post: {
    ['tags']: {
      operation: {
        description: 'Returns Tags and Insert to Post',
      },
      response: {
        [200]: {
          description: 'Returns Tags and Insert to Post',
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
