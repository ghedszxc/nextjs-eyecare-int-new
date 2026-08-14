import { gql } from "@apollo/client";

export const SettingsQuery = (variables: {
  path: string;
  names?: string[] | string;
}) => {
  return {
    query: gql`
      query PageConfigs($path: String!, $names: [[String!]!]!) {
        content {
          pageByPath(path: $path) {
            settings(paths: $names)
          }
        }
      }
    `,
    variables,
  };
};
