/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation Login($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      user {\n        id\n        username\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  query GetSongs($first: Int) {\n    allSongs(first: $first) {\n      edges {\n        cursor\n        node {\n          id\n          createdAt\n          updatedAt\n          publishedAt\n          name\n          description\n          inLibrary\n          isFavorite\n          audioFiles {\n            id\n            createdAt\n            updatedAt\n            uploadedBy {\n              id\n              username\n              email\n            }\n            name\n            description\n            duration\n            waveform\n            file\n          }\n        }\n      }\n    }\n  }\n": types.GetSongsDocument,
    "\n  query GetSong($songId: ID!) {\n    song(songId: $songId) {\n      id\n      createdAt\n      updatedAt\n      publishedAt\n      inLibrary\n      isFavorite\n      name\n      description\n      audioFiles {\n        id\n        createdAt\n        updatedAt\n        uploadedBy {\n          id\n          username\n        }\n        name\n        description\n        duration\n        waveform\n        file\n        comments {\n          id\n          createdAt\n          updatedAt\n          content\n          user {\n            id\n            username\n          }\n          startTime\n          endTime\n        }\n      }\n    }\n  }\n": types.GetSongDocument,
    "\n  mutation Register(\n    $username: String!\n    $firstName: String\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    userRegister(\n      email: $email\n      firstName: $firstName\n      lastName: $lastName\n      password: $password\n      username: $username\n    ) {\n      success\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation ManageFavorite($songId: ID!) {\n    songManageFavorite(songId: $songId) {\n      success\n      song {\n        id\n        createdAt\n        updatedAt\n        publishedAt\n        inLibrary\n        isFavorite\n        name\n        description\n        audioFiles {\n          id\n          createdAt\n          updatedAt\n          uploadedBy {\n            id\n            username\n            email\n          }\n          name\n          description\n          duration\n          waveform\n          file\n        }\n      }\n    }\n  }\n": types.ManageFavoriteDocument,
    "\n  mutation CreateComment(\n    $songId: ID!\n    $audioId: ID!\n    $content: String!\n    $startTime: Int!\n    $endTime: Int!\n  ) {\n    commentCreate(\n      songId: $songId\n      audioId: $audioId\n      content: $content\n      startTime: $startTime\n      endTime: $endTime\n    ) {\n      comment {\n        id\n        createdAt\n        updatedAt\n        content\n        startTime\n        endTime\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n": types.CreateCommentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      user {\n        id\n        username\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($username: String!, $password: String!) {\n    userLogin(username: $username, password: $password) {\n      token\n      user {\n        id\n        username\n        firstName\n        lastName\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSongs($first: Int) {\n    allSongs(first: $first) {\n      edges {\n        cursor\n        node {\n          id\n          createdAt\n          updatedAt\n          publishedAt\n          name\n          description\n          inLibrary\n          isFavorite\n          audioFiles {\n            id\n            createdAt\n            updatedAt\n            uploadedBy {\n              id\n              username\n              email\n            }\n            name\n            description\n            duration\n            waveform\n            file\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSongs($first: Int) {\n    allSongs(first: $first) {\n      edges {\n        cursor\n        node {\n          id\n          createdAt\n          updatedAt\n          publishedAt\n          name\n          description\n          inLibrary\n          isFavorite\n          audioFiles {\n            id\n            createdAt\n            updatedAt\n            uploadedBy {\n              id\n              username\n              email\n            }\n            name\n            description\n            duration\n            waveform\n            file\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSong($songId: ID!) {\n    song(songId: $songId) {\n      id\n      createdAt\n      updatedAt\n      publishedAt\n      inLibrary\n      isFavorite\n      name\n      description\n      audioFiles {\n        id\n        createdAt\n        updatedAt\n        uploadedBy {\n          id\n          username\n        }\n        name\n        description\n        duration\n        waveform\n        file\n        comments {\n          id\n          createdAt\n          updatedAt\n          content\n          user {\n            id\n            username\n          }\n          startTime\n          endTime\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSong($songId: ID!) {\n    song(songId: $songId) {\n      id\n      createdAt\n      updatedAt\n      publishedAt\n      inLibrary\n      isFavorite\n      name\n      description\n      audioFiles {\n        id\n        createdAt\n        updatedAt\n        uploadedBy {\n          id\n          username\n        }\n        name\n        description\n        duration\n        waveform\n        file\n        comments {\n          id\n          createdAt\n          updatedAt\n          content\n          user {\n            id\n            username\n          }\n          startTime\n          endTime\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register(\n    $username: String!\n    $firstName: String\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    userRegister(\n      email: $email\n      firstName: $firstName\n      lastName: $lastName\n      password: $password\n      username: $username\n    ) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation Register(\n    $username: String!\n    $firstName: String\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    userRegister(\n      email: $email\n      firstName: $firstName\n      lastName: $lastName\n      password: $password\n      username: $username\n    ) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ManageFavorite($songId: ID!) {\n    songManageFavorite(songId: $songId) {\n      success\n      song {\n        id\n        createdAt\n        updatedAt\n        publishedAt\n        inLibrary\n        isFavorite\n        name\n        description\n        audioFiles {\n          id\n          createdAt\n          updatedAt\n          uploadedBy {\n            id\n            username\n            email\n          }\n          name\n          description\n          duration\n          waveform\n          file\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation ManageFavorite($songId: ID!) {\n    songManageFavorite(songId: $songId) {\n      success\n      song {\n        id\n        createdAt\n        updatedAt\n        publishedAt\n        inLibrary\n        isFavorite\n        name\n        description\n        audioFiles {\n          id\n          createdAt\n          updatedAt\n          uploadedBy {\n            id\n            username\n            email\n          }\n          name\n          description\n          duration\n          waveform\n          file\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateComment(\n    $songId: ID!\n    $audioId: ID!\n    $content: String!\n    $startTime: Int!\n    $endTime: Int!\n  ) {\n    commentCreate(\n      songId: $songId\n      audioId: $audioId\n      content: $content\n      startTime: $startTime\n      endTime: $endTime\n    ) {\n      comment {\n        id\n        createdAt\n        updatedAt\n        content\n        startTime\n        endTime\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment(\n    $songId: ID!\n    $audioId: ID!\n    $content: String!\n    $startTime: Int!\n    $endTime: Int!\n  ) {\n    commentCreate(\n      songId: $songId\n      audioId: $audioId\n      content: $content\n      startTime: $startTime\n      endTime: $endTime\n    ) {\n      comment {\n        id\n        createdAt\n        updatedAt\n        content\n        startTime\n        endTime\n        user {\n          id\n          username\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;