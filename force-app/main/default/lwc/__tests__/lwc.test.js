import { sum } from "../boatAddReviewForm/sum";

// describe a test
describe("sum()", () => {
  //unit test
  it("should add 1 and 2 returning 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
