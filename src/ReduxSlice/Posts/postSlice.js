import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// const initialState = {
//   posts: [
//     {
//       id: 1,
//       title: "Learn HTML",
//       content: "Learn HTML...",
//       date: sub(new Date(), { minutes: 10 }).toISOString(),
//       reactions: {
//         thumb: 0,
//         wow: 0,
//         heart: 0,
//       },
//       isReact: false,
//     },
//     {
//       id: 2,
//       title: "Learn CSS",
//       content: "Learn CSS...",
//       date: sub(new Date(), { minutes: 5 }).toISOString(),
//       reactions: {
//         thumb: 0,
//         wow: 0,
//         heart: 0,
//       },
//       isReact: false,
//     },
//     {
//       id: 3,
//       title: "Learn JS",
//       content: "Learn js...",
//       date: sub(new Date(), { minutes: 2 }).toISOString(),
//       reactions: {
//         thumb: 0,
//         wow: 0,
//         heart: 0,
//       },
//       isReact: false,
//     },
//   ],
// };
//

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

//Thunk

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    //
    const res = await axios.get(POST_URL);
    return res.data;
    //
  } catch (error) {
    //
    return error.message;
    //
  }
});

//add post thunk
export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const res = await axios.post(POST_URL, initialPost);
      console.log(res.data);
      return res.data; // payload = {}
    } catch (error) {
      return error.message;
    }
  }
);

const PostSlice = createSlice({
  name: "Post",
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },

      prepare({ title, body, userId }) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            userId,
            date: new Date().toISOString(),
            reactions: {
              thumb: 0,
              wow: 0,
              heart: 0,
            },
            isReact: false,
          },
        };
      },
    },

    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;

      console.log(action.payload);

      const exitingPost = state.posts.find((post) => post.id === postId);

      if (exitingPost && !exitingPost.isReact) {
        exitingPost.reactions[reaction]++;
        exitingPost.isReact = true;
      }

      // if (exitingPost) {
      //   exitingPost.reactions[reaction]++;
      // }
    },
    //
  },

  //it is maybe like a switch case which is create for createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        //posts comes from action.payload
        let min = 1;

        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumb: 0,
            wow: 0,
            heart: 0,
          };
          post.isReact = false;

          return post;
        });

        state.posts = [...loadedPosts];
        // state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        // state.error = action.error.message;
        state.error = action.payload;
        state.status = "failed";
      })

      //add new post
      .addCase(addNewPost.fulfilled, (state, action) => {
        //payload = {}
        //add data that action.payload do not have
        action.payload.userId = Number(action.payload.userId); //userId come in string
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumb: 0,
          wow: 0,
          heart: 0,
        };
        action.payload.isReact = false;

        console.log(action.payload);

        state.posts.push(action.payload); //[].push({})
      });
  },
});

export const selectAllPost = (state) => state.posts.posts;
export const stateStatus = (state) => state.posts.status;
export const stateError = (state) => state.posts.error;

//by post id:
export const selectPostById = (state, postId) => {
  console.log("post id is", postId);
  return state.posts.posts.find((post) => post.id === postId);
};

export const { addPost, reactionAdded } = PostSlice.actions;

export default PostSlice.reducer;
