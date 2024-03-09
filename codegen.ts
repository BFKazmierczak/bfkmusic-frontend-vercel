import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://bfkmusic-api.up.railway.app/graphql',
  documents: ['src/**/*.tsx'],
  verbose: true,
  generates: {
    'src/gql/': {
      preset: 'client-preset',
      plugins: [],
      config: {
        addUnderscoreToArgsType: true,
        maybeValue: 'T'
      }
    },
    './graphql.schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
