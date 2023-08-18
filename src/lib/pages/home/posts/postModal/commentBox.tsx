import React, { useState } from 'react';
import {
  Box,
  Textarea,
  Button
} from '@chakra-ui/react';

interface CommentBoxProps {
    user: any;
    parentAuthor: string;
    parentPermlink: string;
    onCommentPosted: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ user, parentAuthor, parentPermlink, onCommentPosted }) => {
  const [commentContent, setCommentContent] = useState('');

  const handleCommentSubmit = () => {
    if (!window.hive_keychain) {
      console.error("Hive Keychain extension not found!");
      return;
    }

    const username = user?.name;
    if (!username) {
      console.error("Username is missing");
      return;
    }

    const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // Generate a unique permlink for the comment

    const operations = [
      ["comment",
        {
          "parent_author": parentAuthor,
          "parent_permlink": parentPermlink,
          "author": username,
          "permlink": permlink,
          "title": "",
          "body": commentContent,
          "json_metadata": JSON.stringify({ tags: ["skateboard"], app: "pepeskate" })
        }
      ]
    ];

    window.hive_keychain.requestBroadcast(username, operations, "posting", (response: any) => {
        if (response.success) {
          alert("Comment successfully posted!");
          setCommentContent(''); // Clear the comment box
      
          // Call the callback to force re-render of Comments component
          onCommentPosted();
        } else {
          console.error("Error posting comment:", response.message);
        }
    });
  };

  return (
    <Box border="1px solid limegreen" padding="10px" mt="20px">
      <Textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write your comment here..."
      />
      <Button border="1px solid limegreen" mt="10px" onClick={handleCommentSubmit}>
        Submit Comment
      </Button>
    </Box>
  );
};

export default CommentBox;