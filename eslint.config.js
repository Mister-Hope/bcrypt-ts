import { hope } from "eslint-config-mister-hope";

export default hope({
  ts: {
    parserOptions: {
      projectService: true,
    },
  },
});
