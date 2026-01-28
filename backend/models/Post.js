import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    frontImage: {
      type: String,
      required: true,
    },

    backImage: {
      type: String,
      required: true,
    },

    caption: String,

    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isLate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model("Post", postSchema);
