import { graphql } from '@/src/gql'
import { gql } from '@apollo/client'

const GET_LIBRARY = graphql(`
  query GetLibrary($pagination: PaginationArg) {
    songs(pagination: $pagination, filters: { inLibrary: true }) {
      data {
        id
        attributes {
          createdAt
          updatedAt
          publishedAt
          name
          description
          inLibrary
          audio {
            data {
              id
              attributes {
                createdAt
                updatedAt
                name
                url
                duration
                waveform {
                  data {
                    id
                    attributes {
                      peaks
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`)

const GET_OWNED_SONGS = graphql(`
  query GetOwnedSongs {
    ownedSongs {
      data {
        id
        attributes {
          createdAt
          updatedAt
          publishedAt
          name
          description
          inLibrary
          audio {
            data {
              id
              attributes {
                createdAt
                updatedAt
                name
                url
                duration
                waveform {
                  data {
                    id
                    attributes {
                      peaks
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`)

export { GET_LIBRARY, GET_OWNED_SONGS }
