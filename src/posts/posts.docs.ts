import { Post } from './entity/post.entity';

export default {
  get: {
    ['posts']: {
      operation: {
        description: 'Returns posts lists.',
      },
      response: {
        [200]: {
          description: 'Returns posts lists.',
          type: Post,
        },
        [400]: { description: 'Posts does not exist' },
      },
    },
    ['user/:user_id']: {
      operation: {
        description: "Returns a user's posts lists.",
      },
      response: {
        [200]: {
          description: "Returns a user's posts lists.",
          type: Post,
        },
        [400]: { description: "User's posts does not exist" },
      },
    },
    [':post_id']: {
      operation: {
        description: 'Returns a post by post id.',
      },
      response: {
        [200]: {
          description: 'Returns a post by post id',
          type: Post,
        },
        [400]: { description: 'Post does not exist by id' },
      },
    },
  },
  post: {
    ['posts']: {
      operation: {
        description: "Returns a user's post lists.",
      },
      response: {
        [200]: {
          description: "Returns a user's post lists.",
          type: Post,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
    ['like/:post_id']: {
      operation: {
        description: 'Return void',
      },
      response: {
        [200]: {
          description: 'Return void',
          type: Post,
        },
      },
    },
    ['unlike/:post_id']: {
      operation: {
        description: 'Return void',
      },
      response: {
        [200]: {
          description: 'Return void',
          type: Post,
        },
      },
    },
  },
  patch: {
    [':post_id']: {
      operation: {
        description: 'Returns a updated post.',
      },
      response: {
        [200]: {
          description: 'Returns a updated post.',
          type: Post,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  delete: {
    [':post_id']: {
      operation: {
        description: 'Returns a deleted post.',
      },
      response: {
        [200]: {
          description: 'Returns a deleted post.',
          type: Post,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
