import init from "./0000_init.sql";

const migrations = {
  journal: {
    entries: [{ idx: 0, when: Date.now(), tag: "0000_init", breakpoints: true }],
  },
  migrations: {
    "0000_init": init as string,
  },
};

export default migrations;
