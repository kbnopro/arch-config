declare const SRC: string;

declare module "eslint-plugin-import" {
  const content: {
    flatConfigs: {
      recommended: object;
      typescript: object;
    };
    configs: {
      typescript: {
        rules: object;
      };
    };
  };
  export default content;
}

declare module "inline:*" {
  const content: string;
  export default content;
}

declare module "*.scss" {
  const content: string;
  export default content;
}

declare module "*.blp" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const content: string;
  export default content;
}
