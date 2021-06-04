import { PostByIdResponseDto } from './dto/post-by-Id-response.dto';
import { PostByUserResponseDto } from './dto/post-by-user-response.dto';
import { PostComment } from './entity/post-comment.entity';
import { Post } from './entity/post.entity';

export default {
  get: {
    ['posts']: {
      operation: {
        description: 'Return a list of all posts',
      },
      response: {
        [200]: {
          description: 'Return a list of all posts',
          type: Post,
        },
        [400]: { description: 'Posts does not exist' },
      },
    },
    ['posts/my']: {
      operation: {
        description: 'Return a list of my posts',
      },
      response: {
        [200]: {
          description: 'Return a list of my posts',
          type: Post,
        },
        [400]: { description: 'Posts does not exist' },
      },
    },
    ['user/:user_id']: {
      operation: {
        description: 'Return a list of user posts by user ID',
      },
      response: {
        [200]: {
          description: 'Return a list of user posts by user ID',
          type: PostByUserResponseDto,
        },
        [400]: { description: "User's posts does not exist" },
      },
    },
    [':post_id']: {
      operation: {
        description: 'Return a list of user posts by post ID',
      },
      response: {
        [200]: {
          description: 'Return a list of user posts by post ID',
          type: PostByIdResponseDto,
        },
        [400]: { description: 'Post does not exist by id' },
      },
    },
    ['post/comment/:post_id']: {
      operation: {
        description: 'Return a list of user posts by post ID',
      },
      response: {
        [200]: {
          description: 'Return a list of user posts by post ID',
          type: PostComment,
        },
        [400]: { description: 'Post does not exist by id' },
      },
    },
    ['post/comment/:comment_id']: {
      operation: {
        description: 'Return a comment of post by comment ID',
      },
      response: {
        [200]: {
          description: 'Return a comment of post by comment ID',
          type: PostComment,
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
        description: 'User turns on post likes by post ID',
      },
      response: {
        [200]: {
          description: 'Return void',
          //   type: Post,
        },
      },
    },
    ['unlike/:post_id']: {
      operation: {
        description: 'User turns off post likes by post ID',
      },
      response: {
        [200]: {
          description: 'Return void',
          //   type: Post,
        },
      },
    },
    ['post/comment/:post_id/:comment_id']: {
      operation: {
        description: 'User turns off post likes by post ID',
      },
      response: {
        [200]: {
          description: 'Return void',
        },
      },
    },
    ['upload/thumbnail']: {
      operation: {
        description: 'Return thumbnail images URL',
      },
      response: {
        [200]: {
          description: 'Return thumbnail images URL',
          type: String,
        },
      },
    },
    ['upload/contentImages']: {
      operation: {
        description: 'Return content images URL',
      },
      response: {
        [200]: {
          description: 'Return content images URL',
          type: String,
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
        description: 'Returns a deleted post by post ID.',
      },
      response: {
        [200]: {
          description: 'Returns a deleted post.',
          type: Post,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
    ['delete/thumbnail']: {
      operation: {
        description: 'Delete a thumbnail.',
      },
      response: {
        [200]: {
          description: 'Returns void.',
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
