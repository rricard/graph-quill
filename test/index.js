/* @flow */
import assert from "assert"

describe("Mocha env", () => {
  before(function() {
    this.test = true
  })

  it("should bind correctly", function() {
    assert(this.test)
  })
})
