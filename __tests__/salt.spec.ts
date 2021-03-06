import { genSalt, genSaltSync } from "../src";

it("Gen salt sync", () => {
  const salt = genSaltSync(10);

  expect(typeof salt).toBe("string");
  expect(salt.length).toBe(29);
});

it("Gen salt async", (done) => {
  void genSalt(10).then((salt) => {
    expect(typeof salt).toBe("string");
    expect(salt.length).toBe(29);

    done();
  });
});
