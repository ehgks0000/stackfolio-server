import { PostsOfSeriesResponse } from './dto/post-by-Id-response.dto';
import { Series } from './entity/series.entity';

export default {
  get: {
    ['series']: {
      operation: {
        description: 'Returns lists of my series.',
      },
      response: {
        [200]: {
          description: 'Returns lists of my series.',
          type: Series,
        },
        [400]: { description: 'series does not exist' },
      },
    },
    ['series/posts']: {
      operation: {
        description: 'Returns posts with my series.',
      },
      response: {
        [200]: {
          description: 'Returns posts with my series.',
          type: PostsOfSeriesResponse,
        },
        [400]: { description: 'Posts does not exist' },
      },
    },
  },
  post: {
    ['series']: {
      operation: {
        description: 'Return a series.',
      },
      response: {
        [200]: {
          description: 'Return a series.',
          type: Series,
        },
        [400]: { description: 'Series already exist' },
      },
    },
    ['series/posts']: {
      operation: {
        description: 'Insert a post into Series.',
      },
      response: {
        [200]: {
          description: 'Return void.',
        },
        [400]: { description: 'Error Insert' },
      },
    },
  },
  patch: {
    ['series']: {
      operation: {
        description: 'Update Series metadata.',
      },
      response: {
        [200]: {
          description: 'Return void',
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  delete: {},
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
